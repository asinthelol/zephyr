/**
 * Page View Tracking Tests
 */

import ZephyrTracker from '../index';
import { SessionManager, EventTracker, testConfig, flushPromises } from './setup';

describe('ZephyrTracker - Page View Tracking', () => {
  it('should track page view when trackPageViews is enabled', async () => {
    const mockTrackPageView = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');
    const mockUpdateExpiry = jest.fn();

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue({ sessionId: 'sess_123', isNew: true }),
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
    await flushPromises();

    expect(mockTrackPageView).toHaveBeenCalled();
  });

  it('should not track page view when trackPageViews is disabled', async () => {
    const mockTrackPageView = jest.fn();

    (EventTracker as jest.Mock).mockImplementation(() => ({
      trackPageView: mockTrackPageView,
    }));

    new ZephyrTracker({
      ...testConfig,
      trackPageViews: false,
    });
    await flushPromises();

    expect(mockTrackPageView).not.toHaveBeenCalled();
  });

  it('should update session expiry after tracking page view', async () => {
    const mockUpdateExpiry = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue('sess_123');

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue({ sessionId: 'sess_123', isNew: true }),
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
    await tracker.trackPageView();

    expect(mockUpdateExpiry).toHaveBeenCalled();
  });

  it('should not track page view if no session ID', async () => {
    const mockTrackPageView = jest.fn();
    const mockGetSessionId = jest.fn().mockReturnValue(null);

    (SessionManager as jest.Mock).mockImplementation(() => ({
      initSession: jest.fn().mockReturnValue({ sessionId: 'sess_123', isNew: true }),
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

    await tracker.trackPageView();

    expect(mockTrackPageView).not.toHaveBeenCalled();
  });
});
