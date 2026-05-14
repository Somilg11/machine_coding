require('dotenv').config();
const { Worker } = require('bullmq');

// Use the same REDIS_URL env var as producer with a localhost fallback
const connection = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const worker = new Worker(
  'email-queue',
  async job => {
    if (job.name === 'email') {
      const { email, subject, body } = job.data;
      // Simulate sending email
      console.log(`Sending email to ${email}: ${subject} - ${body}`);
      return { ok: true };
    }
    return { ok: false };
  },
  { connection }
);

worker.on('completed', job => console.log(`Job ${job.id} has completed`));
worker.on('failed', (job, err) => console.error(`Job ${job && job.id} failed:`, err));

console.log('Worker is running and connected to', connection);
