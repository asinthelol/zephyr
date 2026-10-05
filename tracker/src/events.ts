/**
 * Event tracking module
 * Handles event creation and transmission to the backend
 */

import { DataCollector } from './collector';
import { generateUUID } from './utils';

export interface EventData {
  event_id: string;
  event_type: string;
  url: string;
  referrer?: string;
  user_agent: string;
  timestamp: string;
  viewport_width?: number;
  viewport_height?: number;
  screen_width?: number;
  screen_height?: number;
  language?: string;
  timezone?: string;
  platform?: string;
  event_metadata?: Record<string, unknown>;
  session_id: string;
  user_id?: string;
}

export interface BatchConfig {
  batchSize: number;
  // Flush this long after the first queued event (ms)
  flushInterval: number;
  maxQueueSize: number;
}

const ENVELOPE_SCHEMA_VERSION = '1';

export class EventTracker {
  private apiUrl: string;
  private apiKey: string;
  private debug: boolean;
  private batch: BatchConfig;
  private queue: EventData[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private flushing = false;

  constructor(apiUrl: string, apiKey: string, debug = false, batch: Partial<BatchConfig> = {}) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.debug = debug;
    this.batch = { batchSize: 10, flushInterval: 5000, maxQueueSize: 500, ...batch };
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
    this.enqueue(this.buildEvent(eventType, sessionId, userId, metadata));
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
    this.enqueue(this.buildEvent('page_unload', sessionId, userId), false);

    // sendBeacon cannot set the X-API-Key header, so flush with a keepalive fetch instead
    void this.flush();
    this.log('Page unload queued and flushed');
  }

  /**
   * Send all queued events to the ingest endpoint as one batch
   *
   * On a network error or 5xx the events are put back on the queue to retry on
   * the next flush (the backend de-duplicates on event_id). On a 4xx they are
   * dropped, since resending the same payload cannot succeed.
   */
  public async flush(): Promise<void> {
    this.clearFlushTimer();
    if (this.flushing || this.queue.length === 0) return;

    this.flushing = true;
    const events = this.queue.splice(0, this.queue.length);

    try {
      const response = await fetch(`${this.apiUrl}/ingest/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          schema_version: ENVELOPE_SCHEMA_VERSION,
          sent_at: new Date().toISOString(),
          events,
        }),
        keepalive: true, // Keep connection alive for page unload scenarios
      });

      if (response.ok) {
        this.log('Flushed', events.length, 'events', await response.json());
      } else if (response.status >= 500) {
        this.requeue(events);
        this.log('Server error, will retry:', response.status);
      } else {
        this.log('Batch rejected, dropping:', response.status, await response.text());
      }
    } catch (error) {
      this.requeue(events);
      this.log('Error flushing events, will retry:', error);
    } finally {
      this.flushing = false;
    }
  }

  /**
   * Build an event with its key and collected browser data
   */
  private buildEvent(
    eventType: string,
    sessionId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): EventData {
    const page = DataCollector.collectPageData();

    return {
      event_id: generateUUID(),
      event_type: eventType,
      url: page.url,
      referrer: page.referrer,
      user_agent: page.userAgent,
      timestamp: new Date().toISOString(),
      viewport_width: page.viewportWidth,
      viewport_height: page.viewportHeight,
      screen_width: page.screenWidth,
      screen_height: page.screenHeight,
      language: page.language,
      timezone: page.timezone,
      platform: page.platform,
      event_metadata: metadata,
      session_id: sessionId,
      user_id: userId,
    };
  }

  /**
   * Queue an event; flush when the batch is full, otherwise on a timer
   */
  private enqueue(eventData: EventData, schedule = true): void {
    this.queue.push(eventData);
    if (this.queue.length > this.batch.maxQueueSize) {
      this.queue.splice(0, this.queue.length - this.batch.maxQueueSize);
    }

    if (this.queue.length >= this.batch.batchSize) {
      void this.flush();
    } else if (schedule && !this.flushTimer) {
      this.flushTimer = setTimeout(() => void this.flush(), this.batch.flushInterval);
    }
  }

  private requeue(events: EventData[]): void {
    this.queue.unshift(...events);
    if (this.queue.length > this.batch.maxQueueSize) {
      this.queue.splice(0, this.queue.length - this.batch.maxQueueSize);
    }

    // Retry later even if no further events arrive
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => void this.flush(), this.batch.flushInterval);
    }
  }

  private clearFlushTimer(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
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
