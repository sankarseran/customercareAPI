/** Types generated for queries found in "src/queries/bulk_send_jobs.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** Bulk send status type */
export type BulkSendStatus = 'pending' | 'running' | 'completed' | 'failed';

/** 'CreateBulkSendJob' parameters type */
export interface ICreateBulkSendJobParams {
  senderId: string;
  senderType: 'operator'; // Only operators can send bulk messages.
  ticketIds: number[];
  message: string;
  totalTickets: number;
  processedTickets: number;
  errorCount: number;
  status: BulkSendStatus;
  createdAt: Date;
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

const createBulkSendJobIR: any = {
  usedParamSet: {
    senderId: true,
    senderType: true,
    ticketIds: true,
    message: true,
    totalTickets: true,
    processedTickets: true,
    errorCount: true,
    status: true,
    createdAt: true,
  },
  params: [
    { name: 'senderId', required: true, transform: { type: 'scalar' }, locs: [{ a: 1, b: 10 }] },
    { name: 'senderType', required: true, transform: { type: 'scalar' }, locs: [{ a: 11, b: 21 }] },
    { name: 'ticketIds', required: true, transform: { type: 'scalar' }, locs: [{ a: 22, b: 31 }] },
    { name: 'message', required: true, transform: { type: 'scalar' }, locs: [{ a: 32, b: 39 }] },
    { name: 'totalTickets', required: true, transform: { type: 'scalar' }, locs: [{ a: 40, b: 50 }] },
    { name: 'processedTickets', required: true, transform: { type: 'scalar' }, locs: [{ a: 51, b: 63 }] },
    { name: 'errorCount', required: true, transform: { type: 'scalar' }, locs: [{ a: 64, b: 74 }] },
    { name: 'status', required: true, transform: { type: 'scalar' }, locs: [{ a: 75, b: 85 }] },
    { name: 'createdAt', required: true, transform: { type: 'scalar' }, locs: [{ a: 86, b: 96 }] },
  ],
  statement: `
    INSERT INTO bulk_send_jobs (
      sender_id, sender_type, ticket_ids, message, 
      total_tickets, processed_tickets, error_count, status, created_at
    )
    VALUES (
      :senderId, :senderType, :ticketIds, :message, 
      :totalTickets, :processedTickets, :errorCount, :status, :createdAt
    )
    RETURNING job_id as "id"
  `,
};

/**
 * Query generated from SQL:
 * ```sql
 * INSERT INTO bulk_send_jobs (
 *   sender_id, sender_type, ticket_ids, message, 
 *   total_tickets, processed_tickets, error_count, status, created_at
 * )
 * VALUES (
 *   :senderId, :senderType, :ticketIds, :message, 
 *   :totalTickets, :processedTickets, :errorCount, :status, :createdAt
 * )
 * RETURNING job_id as "id"
 * ```
 */
export const createBulkSendJob = new PreparedQuery<ICreateBulkSendJobParams, ICreateBulkSendJobResult>(createBulkSendJobIR);

/** 'GetBulkSendJobById' parameters type */
export interface IGetBulkSendJobByIdParams {
  jobId: number;
}

/** 'GetBulkSendJobById' return type */
export interface IGetBulkSendJobByIdResult {
  jobId: number;
  senderId: string;
  senderType: string;
  ticketIds: number[];
  message: string;
  status: BulkSendStatus;
  totalTickets: number;
  processedTickets: number;
  errorCount: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

/** 'GetBulkSendJobById' query type */
export interface IGetBulkSendJobByIdQuery {
  params: IGetBulkSendJobByIdParams;
  result: IGetBulkSendJobByIdResult;
}

const getBulkSendJobByIdIR: any = {
  usedParamSet: { jobId: true },
  params: [
    { name: 'jobId', required: true, transform: { type: 'scalar' }, locs: [{ a: 1, b: 7 }] },
  ],
  statement: `
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
    WHERE job_id = :jobId!
  `,
};

/**
 * Query generated from SQL:
 * ```sql
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
export const getBulkSendJobById = new PreparedQuery<IGetBulkSendJobByIdParams, IGetBulkSendJobByIdResult>(getBulkSendJobByIdIR);

/** 
 * We also want a query that returns each job plus an array of failures 
 * (including customerId and ticketId). We'll call this "ListBulkSendJobsWithFailures". 
 */

/** 'ListBulkSendJobsWithFailures' parameters type */
export interface IListBulkSendJobsWithFailuresParams {}

/** 'ListBulkSendJobsWithFailures' return type */
export interface IListBulkSendJobsWithFailuresResult {
  jobId: number;
  senderId: string;
  senderType: string;
  ticketIds: number[];
  message: string;
  status: BulkSendStatus;
  totalTickets: number;
  processedTickets: number;
  errorCount: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  failures: {
    ticketId: number;
    customerId: string;
  }[];
}

/** 'ListBulkSendJobsWithFailures' query type */
export interface IListBulkSendJobsWithFailuresQuery {
  params: IListBulkSendJobsWithFailuresParams;
  result: IListBulkSendJobsWithFailuresResult;
}

const listBulkSendJobsWithFailuresIR: any = {
  usedParamSet: {},
  params: [],
  statement: `
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
    ORDER BY j.created_at DESC
  `,
};

/**
 * Query generated from SQL:
 * ```sql
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
export const listBulkSendJobsWithFailures = new PreparedQuery<IListBulkSendJobsWithFailuresParams, IListBulkSendJobsWithFailuresResult>(listBulkSendJobsWithFailuresIR);

/** 'IncrementBulkSendJobError' parameters type */
export interface IIncrementBulkSendJobErrorParams {
  jobId: number;
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

const incrementBulkSendJobErrorIR: any = {
  usedParamSet: { jobId: true },
  params: [
    { name: 'jobId', required: true, transform: { type: 'scalar' }, locs: [{ a: 1, b: 7 }] },
  ],
  statement: `
    UPDATE bulk_send_jobs
    SET error_count = error_count + 1
    WHERE job_id = :jobId
    RETURNING job_id as "jobId"
  `,
};

/**
 * Query generated from SQL:
 * ```sql
 * UPDATE bulk_send_jobs
 * SET error_count = error_count + 1
 * WHERE job_id = :jobId
 * RETURNING job_id as "jobId"
 * ```
 */
export const incrementBulkSendJobError = new PreparedQuery<IIncrementBulkSendJobErrorParams, IIncrementBulkSendJobErrorResult>(incrementBulkSendJobErrorIR);

/** 'IncrementBulkSendJobProcessed' parameters type */
export interface IIncrementBulkSendJobProcessedParams {
  jobId: number;
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

const incrementBulkSendJobProcessedIR: any = {
  usedParamSet: { jobId: true },
  params: [
    { name: 'jobId', required: true, transform: { type: 'scalar' }, locs: [{ a: 1, b: 7 }] },
  ],
  statement: `
    UPDATE bulk_send_jobs
    SET processed_tickets = processed_tickets + 1
    WHERE job_id = :jobId
    RETURNING job_id as "jobId"
  `,
};

/**
 * Query generated from SQL:
 * ```sql
 * UPDATE bulk_send_jobs
 * SET processed_tickets = processed_tickets + 1
 * WHERE job_id = :jobId
 * RETURNING job_id as "jobId"
 * ```
 */
export const incrementBulkSendJobProcessed = new PreparedQuery<IIncrementBulkSendJobProcessedParams, IIncrementBulkSendJobProcessedResult>(incrementBulkSendJobProcessedIR);

/** 'UpdateBulkSendJob' parameters type */
export interface IUpdateBulkSendJobParams {
  jobId: number;
  status: BulkSendStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
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

const updateBulkSendJobIR: any = {
  usedParamSet: { jobId: true, status: true, startedAt: true, completedAt: true },
  params: [
    { name: 'jobId', required: true, transform: { type: 'scalar' }, locs: [{ a: 1, b: 7 }] },
    { name: 'status', required: true, transform: { type: 'scalar' }, locs: [{ a: 8, b: 16 }] },
    { name: 'startedAt', required: false, transform: { type: 'scalar' }, locs: [{ a: 17, b: 27 }] },
    { name: 'completedAt', required: false, transform: { type: 'scalar' }, locs: [{ a: 28, b: 38 }] },
  ],
  statement: `
    UPDATE bulk_send_jobs
    SET status = :status,
        started_at = :startedAt,
        completed_at = :completedAt
    WHERE job_id = :jobId
    RETURNING job_id as "jobId"
  `,
};

/**
 * Query generated from SQL:
 * ```sql
 * UPDATE bulk_send_jobs
 * SET status = :status,
 *     started_at = :startedAt,
 *     completed_at = :completedAt
 * WHERE job_id = :jobId
 * RETURNING job_id as "jobId"
 * ```
 */
export const updateBulkSendJob = new PreparedQuery<IUpdateBulkSendJobParams, IUpdateBulkSendJobResult>(updateBulkSendJobIR);
