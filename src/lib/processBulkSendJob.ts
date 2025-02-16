import { FastifyInstance } from "fastify";
import { isTicketUnresolved } from "../queries/tickets.queries";
import { addMessageToTicket } from "../queries/messages.queries";
import {
  incrementBulkSendJobError,
  incrementBulkSendJobProcessed,
  updateBulkSendJob,
} from "../queries/bulkSendJobs.queries";
import { addBulkSendFailure } from "../queries/bulkSendFailures.queries";

export async function processBulkSendJob(
  jobId: number,
  instance: FastifyInstance
) {
  // Fetch the job details.
  const job = await instance.db.bulkSendJobs.findById(jobId);
  if (!job) return;

  // Mark the job as running.
  await instance.db.bulkSendJobs.update(jobId, {
    status: "running",
    startedAt: new Date(),
  });

  for (const ticketId of job.ticketIds) {
    try {
      // Check if the ticket is still unresolved.
      const [{ ok }] = await isTicketUnresolved.run({ ticketId }, instance.db);
      if (ok) {
        // Add the message to the ticket.
        await addMessageToTicket.run(
          {
            ticketId,
            text: job.message,
            senderType: job.senderType,
            senderId: job.senderId,
          },
          instance.db
        );
      }
    } catch (error) {
      // Increment the error count.
      await incrementBulkSendJobError.run({ jobId }, instance.db);

      // Fetch the ticket details to get the customerId.
      // (Assuming you have instance.db.tickets.findById or a similar query.)
      const ticket = await instance.db.tickets.findById(ticketId);

      // Insert a failure record with the ticketId and customerId.
      await addBulkSendFailure.run(
        {
          jobId,
          ticketId,
          customerId: ticket.customerId,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
        instance.db
      );
    }

    // Increment the processed count.
    await incrementBulkSendJobProcessed.run({ jobId }, instance.db);
  }

  // Mark the job as completed.
  await updateBulkSendJob.run(
    { jobId, status: "completed", completedAt: new Date() },
    instance.db
  );
}
