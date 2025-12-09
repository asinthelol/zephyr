/**
 * Network utilities module
 * Handles HTTP requests to the backend API
 */

import { delay } from './utils';

export interface NetworkConfig {
  apiUrl: string;
  apiKey: string;
  timeout?: number;
  retries?: number;
}

export class NetworkManager {
  private config: Required<NetworkConfig>;

  constructor(config: NetworkConfig) {
    this.config = {
      timeout: 5000,
      retries: 3,
      ...config,
    };
  }

  /**
   * Send POST request
   */
  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey,
          },
          body: JSON.stringify(data),
          keepalive: true,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          throw error;
        }

        // Wait before retrying
        if (attempt < this.config.retries - 1) {
          await delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Send beacon (for page unload events)
   */
  public sendBeacon(endpoint: string, data: unknown): boolean {
    if (!navigator.sendBeacon) {
      console.warn('sendBeacon not supported');
      return false;
    }

    const url = `${this.config.apiUrl}${endpoint}`;
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    return navigator.sendBeacon(url, blob);
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Check if API is reachable
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(this.config.apiUrl, {
        method: 'HEAD',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
