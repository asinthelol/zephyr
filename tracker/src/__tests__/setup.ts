/**
 * Test setup and shared utilities
 */

import { SessionManager } from '../session';
import { StorageManager } from '../storage';
import { NetworkManager } from '../network';
import { EventTracker } from '../events';

// Polyfill fetch for jsdom
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
    text: async () => '',
    status: 200,
    statusText: 'OK',
  } as Response)
);

// Polyfill AbortController
global.AbortController = class AbortController {
  signal = { aborted: false };
  abort() {
    this.signal.aborted = true;
  }
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Mock modules
jest.mock('../session');
jest.mock('../storage');
jest.mock('../network');
jest.mock('../events');

// Setup browser environment
beforeAll(() => {
  // Note:
  // If you need specific location values, configure them in jest.config.js:
  // testEnvironmentOptions: { url: 'https://example.com/test?param=value' }

  Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
  
  Object.defineProperty(window, 'screen', {
    value: { width: 1920, height: 1080 },
    writable: true,
  });

  // Setup navigator properties
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    writable: true,
  });
  Object.defineProperty(navigator, 'language', {
    value: 'en-US',
    writable: true,
  });
  Object.defineProperty(navigator, 'platform', {
    value: 'Win32',
    writable: true,
  });

  // Setup document properties
  Object.defineProperty(document, 'referrer', {
    value: 'https://google.com',
    writable: true,
  });
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();

  // Setup default mock implementations
  (SessionManager as jest.Mock).mockImplementation(() => ({
    initSession: jest.fn().mockReturnValue('sess_123'),
    getSessionId: jest.fn().mockReturnValue('sess_123'),
    updateExpiry: jest.fn(),
    endSession: jest.fn(),
    createSessionData: jest.fn().mockReturnValue({
      session_id: 'sess_123',
      started_at: new Date().toISOString(),
    }),
  }));

  (StorageManager.get as jest.Mock) = jest.fn().mockReturnValue(null);
  (StorageManager.set as jest.Mock) = jest.fn();
  (StorageManager.remove as jest.Mock) = jest.fn();

  (NetworkManager as jest.Mock).mockImplementation(() => ({
    post: jest.fn().mockResolvedValue({}),
    sendBeacon: jest.fn().mockReturnValue(true),
  }));

  (EventTracker as jest.Mock).mockImplementation(() => ({
    track: jest.fn(),
    trackPageView: jest.fn(),
    trackClick: jest.fn(),
    trackFormSubmit: jest.fn(),
    trackPageUnload: jest.fn(),
  }));
});

export const testConfig = {
  apiUrl: 'https://api.example.com',
  apiKey: 'test-api-key-123',
};

export { SessionManager, StorageManager, NetworkManager, EventTracker };
