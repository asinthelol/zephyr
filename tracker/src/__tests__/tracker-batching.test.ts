/**
 * Event Batching Tests
 * Uses the real EventTracker (setup.ts mocks it for the other suites)
 */

import './setup';

const { EventTracker } = jest.requireActual('../events') as typeof import('../events');

const API_URL = 'https://api.example.com/api/v1';
const fetchMock = global.fetch as jest.Mock;

const response = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const sentBodies = () => fetchMock.mock.calls.map(([, init]) => JSON.parse(init.body));

describe('EventTracker - batching', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(response(202, { loaded: 1 }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not send until the batch is full or the timer fires', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 3, flushInterval: 5000 });

    await tracker.track('click', 'sess_1', 'user_1');
    await tracker.track('click', 'sess_1', 'user_1');
    expect(fetchMock).not.toHaveBeenCalled();

    await tracker.track('click', 'sess_1', 'user_1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBodies()[0].events).toHaveLength(3);
  });

  it('should flush on the timer', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 10, flushInterval: 5000 });

    await tracker.track('pageview', 'sess_1');
    jest.advanceTimersByTime(5000);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should post an envelope to the ingest endpoint with the API key', async () => {
    const tracker = new EventTracker(API_URL, 'key-123', false, { batchSize: 1 });

    await tracker.track('pageview', 'sess_1', 'user_1', { a: 1 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_URL}/ingest/events`);
    expect(init.headers['X-API-Key']).toBe('key-123');
    expect(init.keepalive).toBe(true);

    const body = sentBodies()[0];
    expect(body.schema_version).toBe('1');
    expect(body.sent_at).toEqual(expect.any(String));
    expect(body.events[0]).toMatchObject({
      event_type: 'pageview',
      session_id: 'sess_1',
      user_id: 'user_1',
      event_metadata: { a: 1 },
      language: 'en-US',
      screen_width: 1920,
    });
    expect(body.events[0].event_id).toEqual(expect.any(String));
    expect(body.events[0].timestamp).toEqual(expect.any(String));
  });

  it('should give every event a unique event_id', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 2 });

    await tracker.track('a', 'sess_1');
    await tracker.track('b', 'sess_1');

    const ids = sentBodies()[0].events.map((e: { event_id: string }) => e.event_id);
    expect(new Set(ids).size).toBe(2);
  });

  it('should requeue events and keep their ids after a network failure', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 1 });
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    await tracker.track('pageview', 'sess_1');
    await tracker.flush();

    const [first, retry] = sentBodies();
    expect(retry.events[0].event_id).toBe(first.events[0].event_id);
  });

  it('should requeue on a 5xx response', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 1 });
    fetchMock.mockResolvedValueOnce(response(503));

    await tracker.track('pageview', 'sess_1');
    await tracker.flush();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should drop events on a 4xx response instead of retrying', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 1 });
    fetchMock.mockResolvedValueOnce(response(422));

    await tracker.track('pageview', 'sess_1');
    await tracker.flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should cap the queue and drop the oldest events', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, {
      batchSize: 100,
      maxQueueSize: 2,
    });

    await tracker.track('first', 'sess_1');
    await tracker.track('second', 'sess_1');
    await tracker.track('third', 'sess_1');
    await tracker.flush();

    const types = sentBodies()[0].events.map((e: { event_type: string }) => e.event_type);
    expect(types).toEqual(['second', 'third']);
  });

  it('should flush immediately on page unload', async () => {
    const tracker = new EventTracker(API_URL, 'key', false, { batchSize: 10 });

    await tracker.track('pageview', 'sess_1');
    tracker.trackPageUnload('sess_1', 'user_1');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const types = sentBodies()[0].events.map((e: { event_type: string }) => e.event_type);
    expect(types).toEqual(['pageview', 'page_unload']);
  });
});
