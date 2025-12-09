/**
 * User Management Tests
 */

import ZephyrTracker from '../index';
import { SessionManager, StorageManager, testConfig } from './setup';

describe('ZephyrTracker - User Management', () => {
  it('should set user ID manually', () => {
    const tracker = new ZephyrTracker(testConfig);
    const newUserId = 'user_manual_123';

    tracker.setUserId(newUserId);

    expect(StorageManager.set).toHaveBeenCalledWith('zephyr_user', newUserId);
  });

  it('should get current user ID', () => {
    const existingUserId = 'user_existing_789';
    (StorageManager.get as jest.Mock).mockReturnValue(existingUserId);

    const tracker = new ZephyrTracker(testConfig);
    const userId = tracker.getUserId();

    expect(userId).toBe(existingUserId);
  });

  it('should get current session ID', () => {
    const mockGetSessionId = jest.fn().mockReturnValue('sess_456');

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_456'),
      getSessionId: mockGetSessionId,
      updateExpiry: jest.fn(),
      endSession: jest.fn(),
      createSessionData: jest.fn(),
    }));

    const tracker = new ZephyrTracker(testConfig);
    const sessionId = tracker.getSessionId();

    expect(sessionId).toBe('sess_456');
  });
});
