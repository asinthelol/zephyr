/**
 * Error Handling and Debug Mode Tests
 */

import ZephyrTracker from '../index';
import { SessionManager, NetworkManager, testConfig } from './setup';

describe('ZephyrTracker - Debug Mode', () => {
  it('should initialize logger with debug enabled', () => {
    const tracker = new ZephyrTracker({
      ...testConfig,
      debug: true,
    });

    expect(tracker).toBeDefined();
    // Logger is called internally, we just verify it doesn't throw
  });

  it('should initialize logger with debug disabled by default', () => {
    const tracker = new ZephyrTracker(testConfig);

    expect(tracker).toBeDefined();
  });
});

describe('ZephyrTracker - Error Handling', () => {
  it('should handle errors when sending session fails', async () => {
    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (NetworkManager as jest.Mock).mockImplementation(() => ({
      post: mockPost,
      sendBeacon: jest.fn(),
    }));

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: jest.fn().mockReturnValue('sess_123'),
      updateExpiry: jest.fn(),
      endSession: jest.fn(),
      createSessionData: jest.fn().mockReturnValue({}),
    }));

    new ZephyrTracker(testConfig);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));

    // Should not throw error
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
