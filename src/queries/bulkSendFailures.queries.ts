/** Types generated for queries found in "src/queries/bulk_send_failures.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'AddBulkSendFailure' parameters type */
export interface IAddBulkSendFailureParams {
  jobId: number;
  ticketId: number;
  customerId: string;
  errorMessage: string;
}

/** 'AddBulkSendFailure' return type */
export interface IAddBulkSendFailureResult {
  id: number;
}

/** 'AddBulkSendFailure' query type */
export interface IAddBulkSendFailureQuery {
  params: IAddBulkSendFailureParams;
  result: IAddBulkSendFailureResult;
}

const addBulkSendFailureIR: any = {
  usedParamSet: { jobId: true, ticketId: true, customerId: true, errorMessage: true },
  params: [
    { name: 'jobId', required: true, transform: { type: 'scalar' }, locs: [{ a: 1, b: 7 }] },
    { name: 'ticketId', required: true, transform: { type: 'scalar' }, locs: [{ a: 8, b: 16 }] },
    { name: 'customerId', required: true, transform: { type: 'scalar' }, locs: [{ a: 17, b: 27 }] },
    { name: 'errorMessage', required: true, transform: { type: 'scalar' }, locs: [{ a: 28, b: 40 }] },
  ],
  statement: `
    INSERT INTO bulk_send_failures (
      job_id, ticket_id, customer_id, error_message, created_at
    )
    VALUES (
      :jobId, :ticketId, :customerId, :errorMessage, NOW()
    )
    RETURNING failure_id as "id"
  `,
};

/**
 * Query generated from SQL:
 * ```sql
 * INSERT INTO bulk_send_failures (
 *   job_id, ticket_id, customer_id, error_message, created_at
 * )
 * VALUES (
 *   :jobId, :ticketId, :customerId, :errorMessage, NOW()
 * )
 * RETURNING failure_id as "id"
 * ```
 */
export const addBulkSendFailure = new PreparedQuery<IAddBulkSendFailureParams, IAddBulkSendFailureResult>(addBulkSendFailureIR);
