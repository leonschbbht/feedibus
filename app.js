const Server = require('./src-backend/server/Server');
const config = require('./config.js');
const path = require('path');
const { Worker } = require('worker_threads');

const server = new Server();
const worker = new Worker('./schedulerWorkerApp.js');
server.setNewJobCallback(function (id) {
    worker.postMessage({
        type: 'newJob',
        id: id
    });
})
server.run(config.PORT);

//worker.on('message', message => console.log(message));
//worker.postMessage('ping');
