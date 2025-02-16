// src/api/routes/tickets/bulk-send.ts

import { FastifyInstance } from "fastify";
import { Type as T } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { BadRequest } from "http-errors";
import assert from "assert";

// Import PGTyped queries for bulk send jobs.
import {
  createBulkSendJob,
  getBulkSendJobById,
  listBulkSendJobsWithFailures,
} from "../../../queries/bulkSendJobs.queries";

export async function routeBulkSend(instance: FastifyInstance) {
  // Ensure TypeBox type provider is used
  instance.withTypeProvider<TypeBoxTypeProvider>();

  // ------------------------------------------------
  // POST /bulk-send: Create a new bulk send job.
  // ------------------------------------------------
  const bulkSendBody = T.Object({
    ticketIds: T.Array(T.Number()),
    message: T.String(),
    senderId: T.String(),
    senderType: T.Literal("operator"),
  });

  const bulkSendResponse = T.Object({
    jobId: T.String(),
  });

  instance.route<{
    Body: {
      ticketIds: number[];
      message: string;
      senderId: string;
      senderType: "operator";
    };
  }>({
    method: "POST",
    url: "/bulk-send",
    schema: {
      body: bulkSendBody,
      response: { 200: bulkSendResponse },
    },
    handler: async (req, reply) => {
      // With our generic, req.body is now typed.
      const { ticketIds, message, senderId, senderType } = req.body;
      assert.ok(instance.db, "Missing DB connection");

      if (ticketIds.length === 0) {
        throw new BadRequest("No tickets selected for bulk send");
      }

      // Insert a new bulk send job record.
      // PGTyped returns an array; we destructure the first result.
      const [job] = await createBulkSendJob.run(
        {
          senderId,
          senderType,
          ticketIds,
          message,
          totalTickets: ticketIds.length,
          processedTickets: 0,
          errorCount: 0,
          status: "pending",
          createdAt: new Date(),
        },
        instance.db
      );

      // Enqueue the job for background processing.
      // Here we cast instance to any so TypeScript recognizes queue.
      await (instance as any).queue.add("processBulkSend", {
        jobId: job.id,
      });

      return { jobId: job.id.toString() };
    },
  });

  // ------------------------------------------------
  // GET /bulk-send/:jobId: Retrieve a bulk send job's status.
  // ------------------------------------------------
  const bulkSendJobParams = T.Object({
    jobId: T.String(),
  });

  const bulkSendJobStatusResponse = T.Object({
    jobId: T.String(),
    senderId: T.String(),
    senderType: T.String(),
    ticketIds: T.Array(T.Number()),
    message: T.String(),
    status: T.Union([
      T.Literal("pending"),
      T.Literal("running"),
      T.Literal("completed"),
      T.Literal("failed"),
    ]),
    totalTickets: T.Number(),
    processedTickets: T.Number(),
    errorCount: T.Number(),
    createdAt: T.String({ format: "date-time" }),
    startedAt: T.Optional(T.String({ format: "date-time" })),
    completedAt: T.Optional(T.String({ format: "date-time" })),
  });

  // instance.route({
  //   method: "GET",
  //   url: "/bulk-send/:jobId",
  //   schema: {
  //     params: bulkSendJobParams,
  //     response: { 200: bulkSendJobStatusResponse },
  //   },
  //   handler: async (req, reply) => {
  //     // Cast req.params since it's unknown by default.
  //     const { jobId } = req.params as { jobId: string };
  //     assert.ok(instance.db, "Missing DB connection");

  //     const job = await getBulkSendJobById.run(
  //       { jobId: Number(jobId) },
  //       instance.db
  //     );
  //     if (!job) {
  //       throw new BadRequest("Job not found");
  //     }

  //     return {
  //       jobId: job.jobId.toString(),
  //       senderId: job.senderId,
  //       senderType: job.senderType,
  //       ticketIds: job.ticketIds,
  //       message: job.message,
  //       status: job.status,
  //       totalTickets: job.totalTickets,
  //       processedTickets: job.processedTickets,
  //       errorCount: job.errorCount,
  //       createdAt: job.createdAt.toISOString(),
  //       startedAt: job.startedAt ? job.startedAt.toISOString() : undefined,
  //       completedAt: job.completedAt
  //         ? job.completedAt.toISOString()
  //         : undefined,
  //     };
  //   },
  // });

  // ------------------------------------------------
  // GET /bulk-sends: List all bulk send jobs with failed tickets.
  // ------------------------------------------------
  const failureSchema = T.Object({
    ticketId: T.Number(),
    customerId: T.String(),
  });

  const bulkSendsResponse = T.Array(
    T.Object({
      jobId: T.String(),
      senderId: T.String(),
      senderType: T.String(),
      ticketIds: T.Array(T.Number()),
      message: T.String(),
      status: T.Union([
        T.Literal("pending"),
        T.Literal("running"),
        T.Literal("completed"),
        T.Literal("failed"),
      ]),
      totalTickets: T.Number(),
      processedTickets: T.Number(),
      errorCount: T.Number(),
      createdAt: T.String({ format: "date-time" }),
      startedAt: T.Optional(T.String({ format: "date-time" })),
      completedAt: T.Optional(T.String({ format: "date-time" })),
      failures: T.Array(failureSchema),
    })
  );

  instance.route({
    method: "GET",
    url: "/bulk-sends",
    schema: {
      response: { 200: bulkSendsResponse },
    },
    handler: async (req, reply) => {
      assert.ok(instance.db, "Missing DB connection");

      const jobs = await listBulkSendJobsWithFailures.run({}, instance.db);
      return jobs.map((job) => ({
        jobId: job.jobId.toString(),
        senderId: job.senderId,
        senderType: job.senderType,
        ticketIds: job.ticketIds,
        message: job.message,
        status: job.status,
        totalTickets: job.totalTickets,
        processedTickets: job.processedTickets,
        errorCount: job.errorCount,
        createdAt: job.createdAt.toISOString(),
        startedAt: job.startedAt ? job.startedAt.toISOString() : undefined,
        completedAt: job.completedAt
          ? job.completedAt.toISOString()
          : undefined,
        failures: job.failures, // array of { ticketId, customerId }
      }));
    },
  });
}
