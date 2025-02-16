// src/plugins/jobQueue.ts

import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import Bull, { Queue } from 'bull';
import { processBulkSendJob } from '../../lib/processBulkSendJob'; // Import your function

const queuePlugin: FastifyPluginCallback = (fastify, options, done) => {
  // Create a new Bull queue for processing bulk send jobs.
  const queue: Queue = new Bull('processBulkSend', {
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });

  // Set up a processor for jobs of type "processBulkSend".
  queue.process(async (job) => {
    const { jobId } = job.data;
    fastify.log.info(`Processing bulk send job ${jobId}`);
    
    // Call your background processing function.
    await processBulkSendJob(jobId, fastify);
    
    return { success: true };
  });

  // Decorate Fastify instance with jobQueue.
  fastify.decorate('jobQueue', queue);
  fastify.log.info('Bull jobQueue configured');
  done();
};

export default queuePlugin;
