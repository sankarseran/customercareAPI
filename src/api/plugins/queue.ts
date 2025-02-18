import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import Bull, { Queue } from "bull";
import { processBulkSendJob } from "../../lib/processBulkSendJob";

declare module "fastify" {
  interface FastifyInstance {
    queue: Queue;
  }
}

const queuePlugin: FastifyPluginCallback = (fastify, options) => {
  const queue: Queue = new Bull("processBulkSend", {
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });

  queue.process("processBulkSend", async (job) => {
    const { jobId } = job.data;
    try {
      await processBulkSendJob(jobId, fastify);
      return { success: true };
    } catch (err) {
      fastify.log.error(`Error processing job ${jobId}: ${err}`);
      throw err;
    }
  });

  fastify.decorate("queue", queue);
  fastify.log.info("Bull queue configured");
  
  fastify.addHook("onClose", async () => {
    await queue.close();
  });
};



export default fp(queuePlugin);
