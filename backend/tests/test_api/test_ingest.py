"""
Tests for the batch ingest endpoint
"""

from tests.test_etl.conftest import make_envelope, make_raw

URL = "/api/v1/ingest/events"


def seed(client, sample_user_data, sample_session_data):
    client.post("/api/v1/users/", json=sample_user_data)
    client.post("/api/v1/sessions/", json=sample_session_data)


def event(**overrides):
    base = {"session_id": "test-session-456", "user_id": "test-user-123"}
    base.update(overrides)
    return make_raw(**base)


def test_ingest_returns_202_with_counts(client, sample_user_data, sample_session_data):
    seed(client, sample_user_data, sample_session_data)

    response = client.post(URL, json=make_envelope(event(), event(event_id="evt-2"), {"bad": 1}))

    assert response.status_code == 202
    body = response.json()
    assert (body["received"], body["loaded"], body["rejected"], body["duplicates"]) == (3, 2, 1, 0)
    assert body["batch_id"]


def test_ingested_events_are_listed(client, sample_user_data, sample_session_data):
    seed(client, sample_user_data, sample_session_data)

    client.post(URL, json=make_envelope(event()))

    events = client.get("/api/v1/events/").json()
    assert [e["event_type"] for e in events] == ["pageview"]


def test_resend_reports_duplicates(client, sample_user_data, sample_session_data):
    seed(client, sample_user_data, sample_session_data)
    payload = make_envelope(event())

    client.post(URL, json=payload)
    body = client.post(URL, json=payload).json()

    assert (body["loaded"], body["duplicates"]) == (0, 1)


def test_bad_envelope_returns_422(client):
    response = client.post(URL, json={"schema_version": "9", "events": []})

    assert response.status_code == 422
    assert "schema_version" in response.json()["detail"]


def test_non_object_body_returns_422(client):
    assert client.post(URL, json=[1, 2, 3]).status_code == 422


def test_missing_body_returns_422(client):
    assert client.post(URL).status_code == 422
