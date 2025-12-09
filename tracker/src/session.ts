/**
 * Session management module
 * Handles session creation, persistence, and lifecycle
 */

import { StorageManager } from './storage';
import { generateUUID, getTimestamp } from './utils';

export interface SessionData {
  session_id: string;
  user_id?: string;
  started_at: string;
}

export class SessionManager {
  private sessionId: string | null = null;
  private sessionTimeout: number;
  private storageKey = 'zephyr_session';

  constructor(sessionTimeout: number = 30) {
    // Convert minutes to milliseconds
    this.sessionTimeout = sessionTimeout * 60 * 1000;
  }

  /**
   * Initialize or retrieve session
   */
  public initSession(): { sessionId: string; isNew: boolean } {
    const stored = StorageManager.get<{ sessionId: string; expiresAt: string }>(
      this.storageKey
    );

    if (stored) {
      const expiresAt = new Date(stored.expiresAt).getTime();

      // Check if session is still valid
      if (Date.now() < expiresAt) {
        this.sessionId = stored.sessionId;
        this.updateExpiry();
        return { sessionId: this.sessionId!, isNew: false };
      }
    }

    // Create new session
    this.sessionId = this.generateSessionId();
    this.updateExpiry();
    return { sessionId: this.sessionId!, isNew: true };
  }

  /**
   * Get current session ID
   */
  public getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Update session expiry time
   */
  public updateExpiry(): void {
    if (!this.sessionId) return;

    const expiresAt = new Date(Date.now() + this.sessionTimeout);
    StorageManager.set(this.storageKey, {
      sessionId: this.sessionId,
      expiresAt: expiresAt.toISOString(),
    });
  }

  /**
   * End the current session
   */
  public endSession(): void {
    if (this.sessionId) {
      StorageManager.remove(this.storageKey);
      this.sessionId = null;
    }
  }

  /**
   * Generate a new session ID
   */
  private generateSessionId(): string {
    return 'sess_' + generateUUID();
  }

  /**
   * Create session data payload for backend
   */
  public createSessionData(userId?: string): SessionData {
    if (!this.sessionId) {
      throw new Error('Session not initialized');
    }

    return {
      session_id: this.sessionId,
      user_id: userId,
      started_at: getTimestamp(),
    };
  }
}
