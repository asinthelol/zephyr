/**
 * Page View Tracking Tests
 */

import ZephyrTracker from '../index';
import { SessionManager, EventTracker, testConfig } from './setup';

describe('ZephyrTracker - Page View Tracking', () => {
  it('should track page view when trackPageViews is enabled', () => {
    const mockTrackPageView = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');
    const mockUpdateExpiry = jest.fn();

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      updateExpiry: mockUpdateExpiry,
      createSessionData: jest.fn(),
    }));

    (EventTracker as jest.Mock).mockImplementation(() => ({
      trackPageView: mockTrackPageView,
    }));

    new ZephyrTracker({
      ...testConfig,
      trackPageViews: true,
    });

    expect(mockTrackPageView).toHaveBeenCalled();
  });

  it('should not track page view when trackPageViews is disabled', () => {
    const mockTrackPageView = jest.fn();

    (EventTracker as jest.Mock).mockImplementation(() => ({
      trackPageView: mockTrackPageView,
    }));

    new ZephyrTracker({
      ...testConfig,
      trackPageViews: false,
    });

    expect(mockTrackPageView).not.toHaveBeenCalled();
  });

  it('should update session expiry after tracking page view', () => {
    const mockUpdateExpiry = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      updateExpiry: mockUpdateExpiry,
      createSessionData: jest.fn(),
    }));

    (EventTracker as jest.Mock).mockImplementation(() => ({
      trackPageView: jest.fn(),
    }));

    const tracker = new ZephyrTracker({
      ...testConfig,
      trackPageViews: false,
    });

    mockUpdateExpiry.mockClear(); // Clear init calls
    tracker.trackPageView();

    expect(mockUpdateExpiry).toHaveBeenCalled();
  });

  it('should not track page view if no session ID', () => {
    const mockTrackPageView = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue(null);

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue('sess_123'),
      getSessionId: mockGetSessionId,
      createSessionData: jest.fn(),
    }));

    (EventTracker as jest.Mock).mockImplementation(() => ({
      trackPageView: mockTrackPageView,
    }));

    const tracker = new ZephyrTracker({
      ...testConfig,
      trackPageViews: false,
    });

    tracker.trackPageView();

    expect(mockTrackPageView).not.toHaveBeenCalled();
  });
});
