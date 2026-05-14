require('dotenv').config();
const { Queue } = require('bullmq');


// Use REDIS_URL from environment, fall back to localhost if not provided.
// Example REDIS_URL: redis://localhost:6379
const connection = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const notificationQueue = new Queue('email-queue', { connection });

async function init() {
    const res = await notificationQueue.add('email', {
        email: 'strangecode93@gmail.com',
        subject: 'Welcome msg',
        body: 'Welcome to our service',
    });
    console.log('Job added to the queue', res.id);
}

init();