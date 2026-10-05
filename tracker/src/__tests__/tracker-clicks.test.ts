/**
 * Click and Unload Tracking Tests
 */

import ZephyrTracker from '../index';
import { testConfig, flushPromises } from './setup';

describe('ZephyrTracker - Click Tracking', () => {
  it('should set up click tracking when enabled', async () => {
    const mockAddEventListener = jest.fn();
    document.addEventListener = mockAddEventListener;

    new ZephyrTracker({
      ...testConfig,
      trackClicks: true,
    });
    await flushPromises();

    expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should not set up click tracking when disabled', async () => {
    const mockAddEventListener = jest.fn();
    document.addEventListener = mockAddEventListener;

    new ZephyrTracker({
      ...testConfig,
      trackClicks: false,
    });
    await flushPromises();

    expect(mockAddEventListener).not.toHaveBeenCalledWith('click', expect.any(Function));
  });
});

describe('ZephyrTracker - Unload Tracking', () => {
  it('should set up page unload tracking', async () => {
    const mockAddEventListener = jest.fn();
    window.addEventListener = mockAddEventListener;

    new ZephyrTracker(testConfig);
    await flushPromises();

    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
});
