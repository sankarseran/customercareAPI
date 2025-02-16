-- Up Migration
CREATE TYPE bulk_send_status AS ENUM ('pending', 'running', 'completed', 'failed');

CREATE TABLE bulk_send_jobs (
    job_id SERIAL PRIMARY KEY,
    sender_id VARCHAR NOT NULL,
    sender_type sender_type NOT NULL,
    ticket_ids INTEGER[] NOT NULL,
    message TEXT NOT NULL,
    status bulk_send_status NOT NULL,
    total_tickets INTEGER NOT NULL,
    processed_tickets INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Down Migration
DROP TABLE bulk_send_jobs;
DROP TYPE bulk_send_status;
