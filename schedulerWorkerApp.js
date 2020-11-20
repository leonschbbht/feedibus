const workerThreads = require('worker_threads');
const Scheduler = require('./src-backend/scheduler/Scheduler');

const scheduler = new Scheduler();
scheduler.loadJobs().then(() => {
    scheduler.executeJobs();
})

if (!workerThreads.isMainThread) {
    workerThreads.parentPort.on('message', async (message) => {
        switch (message.type) {
        case 'newJob':
            await scheduler.registerNewJobById(message.id)
        }
    })
}
