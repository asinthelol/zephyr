# Zephyr Analytics

## Quick Start

### Local Development

1. Clone the repo

```bash
git clone https://github.com/asinthelol/zephyr.git
cd zephyr
```

2. Install frontend dependencies

```bash
cd frontend
npm install
```

3. Run the frontend

```bash
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

## How To Use

1. View real-time analytics dashboard with dummy data
2. Monitor website traffic and user behavior
3. Track page views, sessions, and unique visitors
4. Analyze user engagement metrics
5. View traffic sources and referral data
6. Monitor device and browser statistics

## Features

- Analytics dashboard
- Session tracking and monitoring
- Traffic source analysis
- Device and browser detection
- Dummy data for demonstration

## ETL Ingestion Pipeline

The tracker batches events and sends them to `POST /api/v1/ingest/events`. The backend runs each batch through an extract, transform, validate and load pipeline (`backend/app/etl/`).

```
Tracker --(JSON envelope)--> POST /api/v1/ingest/events
   |
   v
Extract    parse envelope into raw records            (bad record -> ingest_rejects)
Transform  map to the canonical event, enrich, dedupe (bad record -> ingest_rejects)
Validate   serialize to XML, check against the XSD    (bad record -> ingest_rejects)
Load       bulk insert + session/user rollups, one transaction
   |
   v
{ batch_id, received, loaded, rejected, duplicates }
```

- **Canonical model**:  [canonical_event.xsd](backend/app/etl/schemas/canonical_event.xsd) defines the contract, with an example in `sample_batch.xml`.
- **Record rejection**: a bad record is stored in `ingest_rejects` with its stage, reason and payload. The rest of the batch continues, and `received = loaded + rejected + duplicates`.
- **Idempotent**:       each event carries an `event_id`, so duplicates are counted, but not inserted.
- **Atomic**:           events, rollups and rejects commit in one transaction. A failed load rolls everything back.

Example request (the session must already exist):

```bash
curl -X POST http://localhost:8000/api/v1/ingest/events \
  -H "X-API-Key: <your key>" -H "Content-Type: application/json" \
  -d '{"schema_version": "1", "sent_at": "2026-10-04T14:00:05Z", "events": [{
        "event_id": "3f6c1a9e-0b1d-4c55-9a43-6d1f7a2b8e10", "event_type": "pageview",
        "session_id": "sess_abc12345", "url": "https://example.com/pricing",
        "user_agent": "Mozilla/5.0", "timestamp": "2026-10-04T14:00:00Z"}]}'
```

Run the tests with `pytest` in `backend/` and `npm test` in `tracker/`.

## Built With

- **Frontend**: Next.js, React, TypeScript, Tailwind
- **Backend**: Python, SQLAlchemy, FastAPI, Alembic (NOT ENABLED)
- **Analytics**: Custom event tracking system       (NOT ENABLED)

## License

I don't care what you do with it, just don't say you made this.

---

### by asinthelol
