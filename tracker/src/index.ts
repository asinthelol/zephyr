/**
 * Zephyr Tracker - Analytics tracking library
 * 
 * @example
 * const tracker = new ZephyrTracker({
 *   apiUrl: 'https://your-api.com/api',
 *   apiKey: 'your-api-key',
 *   trackPageViews: true,
 * });
 */

import { EventTracker } from './events';
import { SessionManager } from './session';
import { StorageManager } from './storage';
import { NetworkManager } from './network';
import { Logger, generateUserId } from './utils';

export interface ZephyrTrackerConfig {
  apiUrl: string;
  apiKey: string;
  trackPageViews?: boolean;
  trackClicks?: boolean;
  debug?: boolean;
  sessionTimeout?: number; // in minutes
}

class ZephyrTracker {
  private config: Required<ZephyrTrackerConfig>;
  private userId: string | null = null;
  private sessionManager: SessionManager;
  private eventTracker: EventTracker;
  private networkManager: NetworkManager;
  private logger: Logger;

  constructor(config: ZephyrTrackerConfig) {
    this.config = {
      trackPageViews: true,
      trackClicks: false,
      debug: false,
      sessionTimeout: 30, // 30 minutes default
      ...config,
    };

    // Initialize logger
    this.logger = new Logger('[Zephyr]', this.config.debug);

    // Initialize network manager
    this.networkManager = new NetworkManager({
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
    });

    // Initialize session manager
    this.sessionManager = new SessionManager(this.config.sessionTimeout);

    // Initialize event tracker
    this.eventTracker = new EventTracker(this.config.apiUrl, this.config.apiKey, this.config.debug);

    this.init();
  }

  /**
   * Initialize the tracker
   */
  private init(): void {
    this.logger.log('Initializing Zephyr Tracker');

    // Initialize session
    const sessionId = this.sessionManager.initSession();
    this.logger.log('Session initialized:', sessionId);

    // Get or create user ID
    this.initUser();

    // Send session to backend
    this.sendSession();

    // Track initial page view if enabled
    if (this.config.trackPageViews) {
      this.trackPageView();
    }

    // Set up click tracking if enabled
    if (this.config.trackClicks) {
      this.setupClickTracking();
    }

    // Set up page unload tracking
    this.setupUnloadTracking();
  }

  /**
   * Initialize or retrieve user ID
   */
  private initUser(): void {
    const storageKey = 'zephyr_user';
    this.userId = StorageManager.get<string>(storageKey);

    if (!this.userId) {
      this.userId = generateUserId();
      StorageManager.set(storageKey, this.userId);
      this.logger.log('New user ID created:', this.userId);
    } else {
      this.logger.log('Existing user ID found:', this.userId);
    }
  }

  /**
   * Send session data to backend
   */
  private async sendSession(): Promise<void> {
    const sessionId = this.sessionManager.getSessionId();
    if (!sessionId) return;

    try {
      const sessionData = this.sessionManager.createSessionData(this.userId || undefined);
      await this.networkManager.post('/sessions/', sessionData);
      this.logger.log('Session sent successfully');
    } catch (error) {
      this.logger.error('Error sending session:', error);
    }
  }

  /**
   * Track a page view
   */
  public trackPageView(): void {
    const sessionId = this.sessionManager.getSessionId();
    if (!sessionId) {
      this.logger.warn('No session ID, cannot track page view');
      return;
    }

    this.eventTracker.trackPageView(sessionId, this.userId || undefined);
    this.sessionManager.updateExpiry();
  }

  /**
   * Track a custom event
   */
  public track(eventType: string, metadata?: Record<string, unknown>): void {
    const sessionId = this.sessionManager.getSessionId();
    if (!sessionId) {
      this.logger.warn('No session ID, cannot track event');
      return;
    }

    this.eventTracker.track(eventType, sessionId, this.userId || undefined, metadata);
    this.sessionManager.updateExpiry(); // Keep session alive
  }

  /**
   * Set up click event tracking
   */
  private setupClickTracking(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const sessionId = this.sessionManager.getSessionId();
      
      if (sessionId) {
        // Track button clicks
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          const button = target.tagName === 'BUTTON' ? target : target.closest('button');
          if (button) {
            this.eventTracker.trackClick(sessionId, this.userId || undefined, button);
            this.sessionManager.updateExpiry();
          }
        }
        
        // Track link clicks
        if (target.tagName === 'A' || target.closest('a')) {
          const link = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a');
          if (link) {
            this.eventTracker.trackClick(sessionId, this.userId || undefined, link);
            this.sessionManager.updateExpiry();
          }
        }
      }
    });
  }

  /**
   * Set up page unload tracking
   */
  private setupUnloadTracking(): void {
    window.addEventListener('beforeunload', () => {
      const sessionId = this.sessionManager.getSessionId();
      if (sessionId) {
        this.eventTracker.trackPageUnload(sessionId, this.userId || undefined);
      }
    });
  }

  /**
   * Set user ID manually
   */
  public setUserId(userId: string): void {
    this.userId = userId;
    StorageManager.set('zephyr_user', userId);
    this.logger.log('User ID set:', userId);
  }

  /**
   * Get current session ID
   */
  public getSessionId(): string | null {
    return this.sessionManager.getSessionId();
  }

  /**
   * Get current user ID
   */
  public getUserId(): string | null {
    return this.userId;
  }
}

export default ZephyrTracker;
