/** Types generated for queries found in "src/queries/bulk_send_failures.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'AddBulkSendFailure' parameters type */
export interface IAddBulkSendFailureParams {
  customerId?: string | null | void;
  errorMessage?: string | null | void;
  jobId?: number | null | void;
  ticketId?: NumberOrString | null | void;
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

const addBulkSendFailureIR: any = {"usedParamSet":{"jobId":true,"ticketId":true,"customerId":true,"errorMessage":true},"params":[{"name":"jobId","required":false,"transform":{"type":"scalar"},"locs":[{"a":110,"b":115}]},{"name":"ticketId","required":false,"transform":{"type":"scalar"},"locs":[{"a":118,"b":126}]},{"name":"customerId","required":false,"transform":{"type":"scalar"},"locs":[{"a":129,"b":139}]},{"name":"errorMessage","required":false,"transform":{"type":"scalar"},"locs":[{"a":142,"b":154}]}],"statement":"INSERT INTO bulk_send_failures (\n    job_id, ticket_id, customer_id, error_message, created_at\n)\nVALUES (\n    :jobId, :ticketId, :customerId, :errorMessage, NOW()\n)\nRETURNING failure_id as \"id\""};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO bulk_send_failures (
 *     job_id, ticket_id, customer_id, error_message, created_at
 * )
 * VALUES (
 *     :jobId, :ticketId, :customerId, :errorMessage, NOW()
 * )
 * RETURNING failure_id as "id"
 * ```
 */
export const addBulkSendFailure = new PreparedQuery<IAddBulkSendFailureParams,IAddBulkSendFailureResult>(addBulkSendFailureIR);


