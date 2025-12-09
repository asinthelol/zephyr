/**
 * Utility functions
 * Helper functions used across the tracker
 */

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a unique user ID
 */
export function generateUserId(): string {
  return 'user_' + generateUUID();
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Delay helper
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is defined and not null
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Get nested object property
 */
export function getNestedProperty(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Sanitize string
 */
export function sanitizeString(str: string, maxLength = 1000): string {
  return str.trim().substring(0, maxLength);
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(queryString);

  urlParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Get URL parameters as object
 */
export function getUrlParams(): Record<string, string> {
  return parseQueryString(window.location.search);
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if 'Do Not Track' is enabled
 */
export function isDoNotTrackEnabled(): boolean {
  if (!isBrowser()) return false;

  const dnt = navigator.doNotTrack || (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === '1' || dnt === 'yes';
}

/**
 * Get browser name from user agent
 */
export function getBrowserName(): string {
  const ua = navigator.userAgent;

  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'Internet Explorer';

  return 'Unknown';
}

/**
 * Get device type
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|Opera M(obi|ini)|webOS/i.test(ua)
  ) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Logger utility
 */
export class Logger {
  private debug: boolean;
  private prefix: string;

  constructor(prefix = '[Zephyr]', debug = false) {
    this.prefix = prefix;
    this.debug = debug;
  }

  public log(...args: unknown[]): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log(this.prefix, ...args);
    }
  }

  public warn(...args: unknown[]): void {
    if (this.debug) {
      console.warn(this.prefix, ...args);
    }
  }

  public error(...args: unknown[]): void {
    console.error(this.prefix, ...args);
  }
}
