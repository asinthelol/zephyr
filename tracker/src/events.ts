/**
 * Event tracking module
 * Handles event creation and transmission to the backend
 */

export interface EventData {
  event_type: string;
  url: string;
  referrer?: string;
  user_agent: string;
  viewport_width?: number;
  viewport_height?: number;
  event_metadata?: Record<string, unknown>;
  session_id: string;
  user_id?: string;
}

export class EventTracker {
  private apiUrl: string;
  private apiKey: string;
  private debug: boolean;

  constructor(apiUrl: string, apiKey: string, debug = false) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.debug = debug;
  }

  /**
   * Track a custom event
   */
  public async track(
    eventType: string,
    sessionId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const eventData: EventData = {
      event_type: eventType,
      url: window.location.href,
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      event_metadata: metadata,
      session_id: sessionId,
      user_id: userId,
    };

    await this.sendEvent(eventData);
  }

  /**
   * Track a page view event
   */
  public async trackPageView(sessionId: string, userId?: string): Promise<void> {
    await this.track('pageview', sessionId, userId);
  }

  /**
   * Track a click event
   */
  public async trackClick(
    sessionId: string,
    userId: string | undefined,
    element: HTMLElement
  ): Promise<void> {
    const metadata: Record<string, unknown> = {
      element_type: element.tagName.toLowerCase(),
      element_id: element.id || undefined,
      element_classes: element.className || undefined,
      element_text: element.textContent?.trim().substring(0, 100) || undefined,
    };

    // Add specific data for links
    // Tagname is by default all-caps
    if (element.tagName === 'A') {
      const link = element as HTMLAnchorElement;
      metadata.href = link.href;
      metadata.target = link.target || undefined;
    }

    // Add specific data for buttons
    if (element.tagName === 'BUTTON') {
      const button = element as HTMLButtonElement;
      metadata.button_type = button.type;
      metadata.button_name = button.name || undefined;
    }

    await this.track('click', sessionId, userId, metadata);
  }

  /**
   * Track form submission
   */
  public async trackFormSubmit(
    sessionId: string,
    userId: string | undefined,
    form: HTMLFormElement
  ): Promise<void> {
    const metadata: Record<string, unknown> = {
      form_id: form.id || undefined,
      form_name: form.name || undefined,
      form_action: form.action || undefined,
      form_method: form.method || undefined,
    };

    await this.track('form_submit', sessionId, userId, metadata);
  }

  /**
   * Track page unload
   */
  public trackPageUnload(sessionId: string, userId?: string): void {
    if (!navigator.sendBeacon) {
      this.log('sendBeacon not supported');
      return;
    }

    const eventData: EventData = {
      event_type: 'page_unload',
      url: window.location.href,
      user_agent: navigator.userAgent,
      session_id: sessionId,
      user_id: userId,
    };

    const url = `${this.apiUrl}/events/`;
    const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });

    // Maybe add API key to headers via workaround (sendBeacon doesn't support custom headers)
    // Consider using a query parameter or implementing on server side
    // this --> `${this.apiUrl}/events/?api_key=${this.apiKey}` wouldn't work due to CORS and security concerns
    navigator.sendBeacon(url, blob);
    this.log('Page unload tracked via sendBeacon');
  }

  /**
   * Send event data to backend
   */
  private async sendEvent(eventData: EventData): Promise<void> {
    const url = `${this.apiUrl}/events/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(eventData),
        keepalive: true, // Keep connection alive for page unload scenarios
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      this.log('Event tracked successfully:', eventData.event_type);
    } catch (error) {
      this.log('Error tracking event:', error);
      throw error;
    }
  }

  /**
   * Log debug messages
   */
  private log(...args: unknown[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log('[Zephyr Events]', ...args);
    }
  }
}
