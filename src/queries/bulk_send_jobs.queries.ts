/** Types generated for queries found in "src/queries/bulk_send_jobs.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type bulk_send_status = 'completed' | 'failed' | 'pending' | 'running';

export type sender_type = 'customer' | 'operator';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type numberArray = (number)[];

/** 'CreateBulkSendJob' parameters type */
export interface ICreateBulkSendJobParams {
  createdAt?: Date | null | void;
  errorCount?: number | null | void;
  message?: string | null | void;
  processedTickets?: number | null | void;
  senderId?: string | null | void;
  senderType?: sender_type | null | void;
  status?: bulk_send_status | null | void;
  ticketIds?: numberArray | null | void;
  totalTickets?: number | null | void;
}

/** 'CreateBulkSendJob' return type */
export interface ICreateBulkSendJobResult {
  id: number;
}

/** 'CreateBulkSendJob' query type */
export interface ICreateBulkSendJobQuery {
  params: ICreateBulkSendJobParams;
  result: ICreateBulkSendJobResult;
}

const createBulkSendJobIR: any = {"usedParamSet":{"senderId":true,"senderType":true,"ticketIds":true,"message":true,"totalTickets":true,"processedTickets":true,"errorCount":true,"status":true,"createdAt":true},"params":[{"name":"senderId","required":false,"transform":{"type":"scalar"},"locs":[{"a":164,"b":172}]},{"name":"senderType","required":false,"transform":{"type":"scalar"},"locs":[{"a":175,"b":185}]},{"name":"ticketIds","required":false,"transform":{"type":"scalar"},"locs":[{"a":193,"b":202}]},{"name":"message","required":false,"transform":{"type":"scalar"},"locs":[{"a":215,"b":222}]},{"name":"totalTickets","required":false,"transform":{"type":"scalar"},"locs":[{"a":225,"b":237}]},{"name":"processedTickets","required":false,"transform":{"type":"scalar"},"locs":[{"a":245,"b":261}]},{"name":"errorCount","required":false,"transform":{"type":"scalar"},"locs":[{"a":264,"b":274}]},{"name":"status","required":false,"transform":{"type":"scalar"},"locs":[{"a":277,"b":283}]},{"name":"createdAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":286,"b":295}]}],"statement":"INSERT INTO bulk_send_jobs (\n    sender_id, sender_type, ticket_ids, message, \n    total_tickets, processed_tickets, error_count, status, created_at\n) VALUES (\n    :senderId, :senderType, CAST(:ticketIds AS int[]), :message, :totalTickets, \n    :processedTickets, :errorCount, :status, :createdAt\n) RETURNING job_id as \"id\""};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO bulk_send_jobs (
 *     sender_id, sender_type, ticket_ids, message, 
 *     total_tickets, processed_tickets, error_count, status, created_at
 * ) VALUES (
 *     :senderId, :senderType, CAST(:ticketIds AS int[]), :message, :totalTickets, 
 *     :processedTickets, :errorCount, :status, :createdAt
 * ) RETURNING job_id as "id"
 * ```
 */
export const createBulkSendJob = new PreparedQuery<ICreateBulkSendJobParams,ICreateBulkSendJobResult>(createBulkSendJobIR);


/** 'GetBulkSendJobById' parameters type */
export interface IGetBulkSendJobByIdParams {
  jobId: number;
}

/** 'GetBulkSendJobById' return type */
export interface IGetBulkSendJobByIdResult {
  completedAt: Date | null;
  createdAt: Date;
  errorCount: number;
  jobId: number;
  message: string;
  processedTickets: number;
  senderId: string;
  senderType: sender_type;
  startedAt: Date | null;
  status: bulk_send_status;
  ticketIds: numberArray;
  totalTickets: number;
}

/** 'GetBulkSendJobById' query type */
export interface IGetBulkSendJobByIdQuery {
  params: IGetBulkSendJobByIdParams;
  result: IGetBulkSendJobByIdResult;
}

const getBulkSendJobByIdIR: any = {"usedParamSet":{"jobId":true},"params":[{"name":"jobId","required":true,"transform":{"type":"scalar"},"locs":[{"a":370,"b":376}]}],"statement":"SELECT\n  job_id as \"jobId\",\n  sender_id as \"senderId\",\n  sender_type as \"senderType\",\n  ticket_ids as \"ticketIds\",\n  message,\n  status,\n  total_tickets as \"totalTickets\",\n  processed_tickets as \"processedTickets\",\n  error_count as \"errorCount\",\n  created_at as \"createdAt\",\n  started_at as \"startedAt\",\n  completed_at as \"completedAt\"\nFROM bulk_send_jobs\nWHERE job_id = :jobId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   job_id as "jobId",
 *   sender_id as "senderId",
 *   sender_type as "senderType",
 *   ticket_ids as "ticketIds",
 *   message,
 *   status,
 *   total_tickets as "totalTickets",
 *   processed_tickets as "processedTickets",
 *   error_count as "errorCount",
 *   created_at as "createdAt",
 *   started_at as "startedAt",
 *   completed_at as "completedAt"
 * FROM bulk_send_jobs
 * WHERE job_id = :jobId!
 * ```
 */
export const getBulkSendJobById = new PreparedQuery<IGetBulkSendJobByIdParams,IGetBulkSendJobByIdResult>(getBulkSendJobByIdIR);


/** 'ListBulkSendJobsWithFailures' parameters type */
export type IListBulkSendJobsWithFailuresParams = void;

/** 'ListBulkSendJobsWithFailures' return type */
export interface IListBulkSendJobsWithFailuresResult {
  completedAt: Date | null;
  createdAt: Date;
  errorCount: number;
  failures: Json | null;
  jobId: number;
  message: string;
  processedTickets: number;
  senderId: string;
  senderType: sender_type;
  startedAt: Date | null;
  status: bulk_send_status;
  ticketIds: numberArray;
  totalTickets: number;
}

/** 'ListBulkSendJobsWithFailures' query type */
export interface IListBulkSendJobsWithFailuresQuery {
  params: IListBulkSendJobsWithFailuresParams;
  result: IListBulkSendJobsWithFailuresResult;
}

const listBulkSendJobsWithFailuresIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  j.job_id as \"jobId\",\n  j.sender_id as \"senderId\",\n  j.sender_type as \"senderType\",\n  j.ticket_ids as \"ticketIds\",\n  j.message,\n  j.status,\n  j.total_tickets as \"totalTickets\",\n  j.processed_tickets as \"processedTickets\",\n  j.error_count as \"errorCount\",\n  j.created_at as \"createdAt\",\n  j.started_at as \"startedAt\",\n  j.completed_at as \"completedAt\",\n  COALESCE(\n    json_agg(\n      json_build_object(\n        'ticketId', f.ticket_id,\n        'customerId', f.customer_id\n      )\n    ) FILTER (WHERE f.failure_id IS NOT NULL),\n    '[]'\n  ) AS \"failures\"\nFROM bulk_send_jobs j\nLEFT JOIN bulk_send_failures f ON f.job_id = j.job_id\nGROUP BY j.job_id\nORDER BY j.created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   j.job_id as "jobId",
 *   j.sender_id as "senderId",
 *   j.sender_type as "senderType",
 *   j.ticket_ids as "ticketIds",
 *   j.message,
 *   j.status,
 *   j.total_tickets as "totalTickets",
 *   j.processed_tickets as "processedTickets",
 *   j.error_count as "errorCount",
 *   j.created_at as "createdAt",
 *   j.started_at as "startedAt",
 *   j.completed_at as "completedAt",
 *   COALESCE(
 *     json_agg(
 *       json_build_object(
 *         'ticketId', f.ticket_id,
 *         'customerId', f.customer_id
 *       )
 *     ) FILTER (WHERE f.failure_id IS NOT NULL),
 *     '[]'
 *   ) AS "failures"
 * FROM bulk_send_jobs j
 * LEFT JOIN bulk_send_failures f ON f.job_id = j.job_id
 * GROUP BY j.job_id
 * ORDER BY j.created_at DESC
 * ```
 */
export const listBulkSendJobsWithFailures = new PreparedQuery<IListBulkSendJobsWithFailuresParams,IListBulkSendJobsWithFailuresResult>(listBulkSendJobsWithFailuresIR);


/** 'IncrementBulkSendJobError' parameters type */
export interface IIncrementBulkSendJobErrorParams {
  jobId?: number | null | void;
}

/** 'IncrementBulkSendJobError' return type */
export interface IIncrementBulkSendJobErrorResult {
  jobId: number;
}

/** 'IncrementBulkSendJobError' query type */
export interface IIncrementBulkSendJobErrorQuery {
  params: IIncrementBulkSendJobErrorParams;
  result: IIncrementBulkSendJobErrorResult;
}

const incrementBulkSendJobErrorIR: any = {"usedParamSet":{"jobId":true},"params":[{"name":"jobId","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":76}]}],"statement":"UPDATE bulk_send_jobs\nSET error_count = error_count + 1\nWHERE job_id = :jobId\nRETURNING job_id as \"jobId\""};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bulk_send_jobs
 * SET error_count = error_count + 1
 * WHERE job_id = :jobId
 * RETURNING job_id as "jobId"
 * ```
 */
export const incrementBulkSendJobError = new PreparedQuery<IIncrementBulkSendJobErrorParams,IIncrementBulkSendJobErrorResult>(incrementBulkSendJobErrorIR);


/** 'IncrementBulkSendJobProcessed' parameters type */
export interface IIncrementBulkSendJobProcessedParams {
  jobId?: number | null | void;
}

/** 'IncrementBulkSendJobProcessed' return type */
export interface IIncrementBulkSendJobProcessedResult {
  jobId: number;
}

/** 'IncrementBulkSendJobProcessed' query type */
export interface IIncrementBulkSendJobProcessedQuery {
  params: IIncrementBulkSendJobProcessedParams;
  result: IIncrementBulkSendJobProcessedResult;
}

const incrementBulkSendJobProcessedIR: any = {"usedParamSet":{"jobId":true},"params":[{"name":"jobId","required":false,"transform":{"type":"scalar"},"locs":[{"a":83,"b":88}]}],"statement":"UPDATE bulk_send_jobs\nSET processed_tickets = processed_tickets + 1\nWHERE job_id = :jobId\nRETURNING job_id as \"jobId\""};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bulk_send_jobs
 * SET processed_tickets = processed_tickets + 1
 * WHERE job_id = :jobId
 * RETURNING job_id as "jobId"
 * ```
 */
export const incrementBulkSendJobProcessed = new PreparedQuery<IIncrementBulkSendJobProcessedParams,IIncrementBulkSendJobProcessedResult>(incrementBulkSendJobProcessedIR);


/** 'UpdateBulkSendJob' parameters type */
export interface IUpdateBulkSendJobParams {
  completedAt?: Date | null | void;
  jobId?: number | null | void;
  startedAt?: Date | null | void;
  status?: bulk_send_status | null | void;
}

/** 'UpdateBulkSendJob' return type */
export interface IUpdateBulkSendJobResult {
  jobId: number;
}

/** 'UpdateBulkSendJob' query type */
export interface IUpdateBulkSendJobQuery {
  params: IUpdateBulkSendJobParams;
  result: IUpdateBulkSendJobResult;
}

const updateBulkSendJobIR: any = {"usedParamSet":{"status":true,"startedAt":true,"completedAt":true,"jobId":true},"params":[{"name":"status","required":false,"transform":{"type":"scalar"},"locs":[{"a":35,"b":41}]},{"name":"startedAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":61,"b":70}]},{"name":"completedAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":103}]},{"name":"jobId","required":false,"transform":{"type":"scalar"},"locs":[{"a":120,"b":125}]}],"statement":"UPDATE bulk_send_jobs\nSET status = :status,\n    started_at = :startedAt,\n    completed_at = :completedAt\nWHERE job_id = :jobId\nRETURNING job_id as \"jobId\""};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bulk_send_jobs
 * SET status = :status,
 *     started_at = :startedAt,
 *     completed_at = :completedAt
 * WHERE job_id = :jobId
 * RETURNING job_id as "jobId"
 * ```
 */
export const updateBulkSendJob = new PreparedQuery<IUpdateBulkSendJobParams,IUpdateBulkSendJobResult>(updateBulkSendJobIR);


