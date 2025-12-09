/**
 * Custom Event Tracking Tests
 */

import ZephyrTracker from '../index';
import { SessionManager, StorageManager, EventTracker, testConfig } from './setup';

describe('ZephyrTracker - Custom Event Tracking', () => {
  it('should track custom events', () => {
    const mockTrack = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');
    const mockUpdateExpiry = jest.fn();

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      updateExpiry: mockUpdateExpiry,
      createSessionData: jest.fn(),
    }));

    (EventTracker as jest.Mock).mockImplementation(() => ({
      track: mockTrack,
      trackPageView: jest.fn(),
      trackClick: jest.fn(),
      trackFormSubmit: jest.fn(),
      trackPageUnload: jest.fn(),
    }));

    const tracker = new ZephyrTracker(testConfig);

    const metadata = { button_name: 'signup' };
    tracker.track('button_click', metadata);

    // Should be called with generated user ID
    expect(mockTrack).toHaveBeenCalledWith('button_click', 'sess_123', expect.stringContaining('user_'), metadata);
    expect(mockUpdateExpiry).toHaveBeenCalled();
  });

  it('should not track if no session ID', () => {
    const mockTrack = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue(null);

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      updateExpiry: jest.fn(),
      endSession: jest.fn(),
      createSessionData: jest.fn(),
    }));

    (EventTracker as jest.Mock).mockImplementation(() => ({
      track: mockTrack,
      trackPageView: jest.fn(),
      trackClick: jest.fn(),
      trackFormSubmit: jest.fn(),
      trackPageUnload: jest.fn(),
    }));

    const tracker = new ZephyrTracker(testConfig);

    tracker.track('custom_event');

    expect(mockTrack).not.toHaveBeenCalled();
  });

  it('should track events with user ID if set', () => {
    const mockTrack = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      updateExpiry: jest.fn(),
      createSessionData: jest.fn(),
    }));

    (EventTracker as jest.Mock).mockImplementation(() => ({
      track: mockTrack,
      trackPageView: jest.fn(),
      trackClick: jest.fn(),
      trackFormSubmit: jest.fn(),
      trackPageUnload: jest.fn(),
    }));

    (StorageManager.get as jest.Mock).mockReturnValue('user_456');

    const tracker = new ZephyrTracker(testConfig);
    tracker.track('custom_event');

    expect(mockTrack).toHaveBeenCalledWith('custom_event', 'sess_123', 'user_456', undefined);
  });
});
