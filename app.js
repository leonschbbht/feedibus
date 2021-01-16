const Server = require('./src-backend/server/Server');
const config = require('./config.js');
const { Worker } = require('worker_threads');
const db = require('./src-backend/database/Database')

const server = new Server();
const worker = new Worker('./schedulerWorkerApp.js');

db.migrateKnex()
    .then(() => console.log('Datenbank ist Up-To-Date'))
    .catch(err => console.log('Fehler bei der Migration!', JSON.stringify(err, null, 2)));

server.setNewJobCallback(function (id) {
    worker.postMessage({
        type: 'newJob',
        id: id
    });
})
server.run(config.PORT);

// worker.on('message', message => console.log(message));
// worker.postMessage('ping');
