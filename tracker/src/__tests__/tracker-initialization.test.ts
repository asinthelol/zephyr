/**
 * Tracker Initialization Tests
 */

import ZephyrTracker from '../index';
import { SessionManager, StorageManager, NetworkManager, testConfig } from './setup';

describe('ZephyrTracker - Initialization', () => {
  it('should create a tracker instance with default config', () => {
    const tracker = new ZephyrTracker(testConfig);

    expect(tracker).toBeInstanceOf(ZephyrTracker);
    expect(SessionManager).toHaveBeenCalledWith(30); // default session timeout
    expect(NetworkManager).toHaveBeenCalledWith({
      apiUrl: testConfig.apiUrl,
      apiKey: testConfig.apiKey,
    });
  });

  it('should create a tracker with custom session timeout', () => {
    new ZephyrTracker({
      ...testConfig,
      sessionTimeout: 60,
    });

    expect(SessionManager).toHaveBeenCalledWith(60);
  });

  it('should initialize session on construction', () => {
    const mockInitSession = jest.fn().mockReturnValue('sess_123');
    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: mockInitSession,
      getSessionId: jest.fn(),
      updateExpiry: jest.fn(),
      endSession: jest.fn(),
      createSessionData: jest.fn(),
    }));

    new ZephyrTracker(testConfig);

    expect(mockInitSession).toHaveBeenCalled();
  });

  it('should initialize or retrieve user ID', () => {
    (StorageManager.get as jest.Mock).mockReturnValue(null);

    new ZephyrTracker(testConfig);

    expect(StorageManager.get).toHaveBeenCalledWith('zephyr_user');
    expect(StorageManager.set).toHaveBeenCalledWith('zephyr_user', expect.stringContaining('user_'));
  });

  it('should use existing user ID if available', () => {
    const existingUserId = 'user_existing_123';
    (StorageManager.get as jest.Mock).mockReturnValue(existingUserId);

    new ZephyrTracker(testConfig);

    expect(StorageManager.get).toHaveBeenCalledWith('zephyr_user');
    expect(StorageManager.set).not.toHaveBeenCalled();
  });

  it('should send session to backend on init', async () => {
    const mockPost = jest.fn().mockResolvedValue({});
    const mockCreateSessionData = jest.fn().mockReturnValue({
      session_id: 'sess_123',
      user_id: 'user_123',
      started_at: '2025-12-08T00:00:00.000Z',
    });
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      updateExpiry: jest.fn(),
      createSessionData: mockCreateSessionData,
    }));

    (NetworkManager as jest.Mock).mockImplementation(() => ({
      post: mockPost,
    }));

    new ZephyrTracker(testConfig);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockCreateSessionData).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith('/sessions/', expect.any(Object));
  });
});
