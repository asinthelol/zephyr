/**
 * Data collection utilities
 * Gathers browser and user information
 */

import { sanitizeString } from './utils';

export interface CollectedData {
  url: string;
  referrer?: string;
  userAgent: string;
  viewportWidth?: number;
  viewportHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  timezone?: string;
  platform?: string;
}

export class DataCollector {
  /**
   * Collect current page data
   */
  public static collectPageData(): CollectedData {
    return {
      url: window.location.href,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language || undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
      platform: navigator.platform || undefined,
    };
  }

  /**
   * Collect element data for click tracking
   */
  public static collectElementData(element: HTMLElement): Record<string, unknown> {
    const data: Record<string, unknown> = {
      tagName: element.tagName.toLowerCase(),
      id: element.id || undefined,
      className: element.className || undefined,
      text: element.textContent ? sanitizeString(element.textContent, 100) : undefined,
    };

    // Collect link-specific data
    if (element.tagName === 'A') {
      const link = element as HTMLAnchorElement;
      data.href = link.href;
      data.target = link.target || undefined;
      data.download = link.download || undefined;
    }

    // Collect button-specific data
    if (element.tagName === 'BUTTON') {
      const button = element as HTMLButtonElement;
      data.type = button.type;
      data.name = button.name || undefined;
      data.disabled = button.disabled;
    }

    // Collect input-specific data
    if (element.tagName === 'INPUT') {
      const input = element as HTMLInputElement;
      data.type = input.type;
      data.name = input.name || undefined;
      data.placeholder = input.placeholder || undefined;
    }

    // Collect form-specific data
    if (element.tagName === 'FORM') {
      const form = element as HTMLFormElement;
      data.action = form.action || undefined;
      data.method = form.method || undefined;
      data.name = form.name || undefined;
    }

    // Get data attributes
    const dataAttrs: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-')) {
        dataAttrs[attr.name] = attr.value;
      }
    });

    if (Object.keys(dataAttrs).length > 0) {
      data.dataAttributes = dataAttrs;
    }

    return data;
  }

  /**
   * Collect form data
   */
  public static collectFormData(form: HTMLFormElement): Record<string, unknown> {
    const data: Record<string, unknown> = {
      id: form.id || undefined,
      name: form.name || undefined,
      action: form.action || undefined,
      method: form.method || undefined,
      fieldCount: form.elements.length,
    };

    // Collect field types (but not values)
    const fieldTypes: Record<string, number> = {};
    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement) {
        const type = element.type;
        fieldTypes[type] = (fieldTypes[type] || 0) + 1;
      }
    });

    data.fieldTypes = fieldTypes;

    return data;
  }

  /**
   * Collect performance data
   */
  public static collectPerformanceData(): Record<string, unknown> | null {
    if (!window.performance || !window.performance.getEntriesByType) {
      return null;
    }

    const [timing] = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (!timing) {
      return null;
    }
    const navigationStart = timing.startTime;

    return {
      loadTime: timing.loadEventEnd - navigationStart,
      domReadyTime: timing.domContentLoadedEventEnd - navigationStart,
      responseTime: timing.responseEnd - timing.requestStart,
      renderTime: timing.domComplete - timing.domContentLoadedEventEnd,
    };
  }

  /**
   * Get scroll depth percentage
   */
  public static getScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (documentHeight <= windowHeight) {
      return 100;
    }

    const scrollPercentage = ((scrollTop + windowHeight) / documentHeight) * 100;
    return Math.min(Math.round(scrollPercentage), 100);
  }
}
