-- Up Migration
CREATE TABLE bulk_send_failures (
    failure_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES bulk_send_jobs(job_id) ON DELETE CASCADE,
    ticket_id BIGINT NOT NULL,
    customer_id VARCHAR NOT NULL,
    error_message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Down Migration
DROP TABLE bulk_send_failures;
