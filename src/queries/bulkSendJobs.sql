/* @name CreateBulkSendJob */
INSERT INTO bulk_send_jobs (
    sender_id, sender_type, ticket_ids, message, 
    total_tickets, processed_tickets, error_count, status, created_at
)
VALUES (
    :senderId, :senderType, :ticketIds, :message, 
    :totalTickets, :processedTickets, :errorCount, :status, :createdAt
)
RETURNING job_id as "id";

/* @name GetBulkSendJobById */
SELECT
    job_id as "jobId",
    sender_id as "senderId",
    sender_type as "senderType",
    ticket_ids as "ticketIds",
    message,
    status,
    total_tickets as "totalTickets",
    processed_tickets as "processedTickets",
    error_count as "errorCount",
    created_at as "createdAt",
    started_at as "startedAt",
    completed_at as "completedAt"
FROM bulk_send_jobs
WHERE job_id = :jobId!;

/* @name ListBulkSendJobsWithFailures */
SELECT
    j.job_id as "jobId",
    j.sender_id as "senderId",
    j.sender_type as "senderType",
    j.ticket_ids as "ticketIds",
    j.message,
    j.status,
    j.total_tickets as "totalTickets",
    j.processed_tickets as "processedTickets",
    j.error_count as "errorCount",
    j.created_at as "createdAt",
    j.started_at as "startedAt",
    j.completed_at as "completedAt",
    COALESCE(
        json_agg(
        json_build_object(
            'ticketId', f.ticket_id,
            'customerId', f.customer_id
        )
        ) FILTER (WHERE f.failure_id IS NOT NULL),
        '[]'
    ) AS "failures"
FROM bulk_send_jobs j
LEFT JOIN bulk_send_failures f ON f.job_id = j.job_id
GROUP BY j.job_id
ORDER BY j.created_at DESC;

/* @name IncrementBulkSendJobError */
UPDATE bulk_send_jobs
SET error_count = error_count + 1
WHERE job_id = :jobId
RETURNING job_id as "jobId";

/* @name IncrementBulkSendJobProcessed */
UPDATE bulk_send_jobs
SET processed_tickets = processed_tickets + 1
WHERE job_id = :jobId
RETURNING job_id as "jobId";

/* @name UpdateBulkSendJob */
UPDATE bulk_send_jobs
SET status = :status,
    started_at = :startedAt,
    completed_at = :completedAt
WHERE job_id = :jobId
RETURNING job_id as "jobId";
