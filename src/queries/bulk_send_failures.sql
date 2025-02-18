/* @name AddBulkSendFailure */
INSERT INTO bulk_send_failures (
    job_id, ticket_id, customer_id, error_message, created_at
)
VALUES (
    :jobId, :ticketId, :customerId, :errorMessage, NOW()
)
RETURNING failure_id as "id";
