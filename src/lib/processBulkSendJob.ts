import { FastifyInstance } from "fastify";
import assert from "assert";
import { getTicket, isTicketUnresolved } from "../queries/tickets.queries";
import { addMessageToTicket } from "../queries/messages.queries";
import {
  getBulkSendJobById,
  incrementBulkSendJobError,
  incrementBulkSendJobProcessed,
  updateBulkSendJob,
} from "../queries/bulk_send_jobs.queries";
import { addBulkSendFailure } from "../queries/bulk_send_failures.queries";

interface TicketProcessingDeps {
  isTicketUnresolved: typeof isTicketUnresolved;
  addMessageToTicket: typeof addMessageToTicket;
  getTicket: typeof getTicket;
  incrementBulkSendJobError: typeof incrementBulkSendJobError;
  incrementBulkSendJobProcessed: typeof incrementBulkSendJobProcessed;
  addBulkSendFailure: typeof addBulkSendFailure;
}

async function processTicket(
  ticketId: number,
  job: any,
  db: any,
  instance: FastifyInstance,
  deps: TicketProcessingDeps
): Promise<void> {
  try {
    const [{ ok }] = await deps.isTicketUnresolved.run({ ticketId }, db);
    if (ok) {
      await deps.addMessageToTicket.run(
        {
          ticketId,
          text: job.message,
          senderType: job.senderType,
          senderId: job.senderId,
        },
        db
      );
    }
  } catch (error) {
    instance.log.error(
      `Error processing ticket ${ticketId} for job ${job.jobId}: ${
        error instanceof Error ? error.message : error
      }`
    );
    await deps.incrementBulkSendJobError.run({ jobId: job.jobId }, db);
    try {
      const [ticket] = await deps.getTicket.run({ id: ticketId }, db);
      await deps.addBulkSendFailure.run(
        {
          jobId: job.jobId,
          ticketId,
          customerId: ticket.customerId,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
        db
      );
    } catch (ticketError) {
      instance.log.error(
        `Error retrieving ticket ${ticketId} or logging failure: ${
          ticketError instanceof Error ? ticketError.message : ticketError
        }`
      );
      await deps.addBulkSendFailure.run(
        {
          jobId: job.jobId,
          ticketId,
          customerId: "Invalid customer ID",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
        db
      );
    }
  }
  await deps.incrementBulkSendJobProcessed.run({ jobId: job.jobId }, db);
}

export async function processBulkSendJob(
  jobId: number,
  instance: FastifyInstance
) {
  assert.ok(instance.db, "Missing DB connection");
  const db = instance.db;

  const [job] = await getBulkSendJobById.run({ jobId }, db);
  if (!job) {
    instance.log.warn(`No job found with id ${jobId}`);
    return;
  }

  await updateBulkSendJob.run(
    { jobId, status: "running", startedAt: new Date() },
    db
  );

  const deps: TicketProcessingDeps = {
    isTicketUnresolved,
    addMessageToTicket,
    getTicket,
    incrementBulkSendJobError,
    incrementBulkSendJobProcessed,
    addBulkSendFailure,
  };

  for (const ticketId of job.ticketIds) {
    await processTicket(ticketId, job, db, instance, deps);
  }

  await updateBulkSendJob.run(
    { jobId, status: "completed", completedAt: new Date() },
    db
  );
}
