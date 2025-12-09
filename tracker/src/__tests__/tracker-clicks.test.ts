/**
 * Click and Unload Tracking Tests
 */

import ZephyrTracker from '../index';
import { testConfig } from './setup';

describe('ZephyrTracker - Click Tracking', () => {
  it('should set up click tracking when enabled', () => {
    const mockAddEventListener = jest.fn();
    document.addEventListener = mockAddEventListener;

    new ZephyrTracker({
      ...testConfig,
      trackClicks: true,
    });

    expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should not set up click tracking when disabled', () => {
    const mockAddEventListener = jest.fn();
    document.addEventListener = mockAddEventListener;

    new ZephyrTracker({
      ...testConfig,
      trackClicks: false,
    });

    expect(mockAddEventListener).not.toHaveBeenCalledWith('click', expect.any(Function));
  });
});

describe('ZephyrTracker - Unload Tracking', () => {
  it('should set up page unload tracking', () => {
    const mockAddEventListener = jest.fn();
    window.addEventListener = mockAddEventListener;

    new ZephyrTracker(testConfig);

    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
});
