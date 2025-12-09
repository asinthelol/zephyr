/**
 * Storage management module
 * Handles localStorage operations
 */

export class StorageManager {
  /**
   * Check if localStorage is available
   */
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Set item in localStorage
   */
  public static set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error setting localStorage item:', e);
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  public static get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error getting localStorage item:', e);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  public static remove(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing localStorage item:', e);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  public static clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }

  /**
   * Check if key exists in localStorage
   */
  public static has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys from localStorage
   */
  public static keys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    return Object.keys(localStorage);
  }
}
