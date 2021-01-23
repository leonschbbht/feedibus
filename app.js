const Server = require('./src-backend/server/Server');
const config = require('./config.js');
const { Worker } = require('worker_threads');
const db = require('./src-backend/database/Database')

const server = new Server();
const worker = new Worker('./schedulerWorkerApp.js');

start().then(startSuccessful => {
    if (startSuccessful) {
        console.log('Starte Server...');
        server.setNewJobCallback(function (id) {
            worker.postMessage({
                type: 'newJob',
                id: id
            });
        })
        server.run(config.PORT);
    }
});
async function start () {
    const maxConnectionAttempts = 12;
    let connectionAttempts = 1;
    let isConnected = await db.isConnected();
    while (!isConnected) {
        await sleep(10 * 1000);
        if (connectionAttempts > maxConnectionAttempts) {
            throw Error('Maximale Versuchsanzahl erreicht. Die Verbindung zur Datenbank konnte nicht hergestellt werden.');
        }
        console.log('Verbindung zur Datenbank wird aufgebaut... (Versuch ' + connectionAttempts + '/' + maxConnectionAttempts + ')');
        await db.reconnect();
        isConnected = await db.isConnected();
        connectionAttempts++;
    }

    let migrationSuccessful = false;
    if (isConnected) {
        console.log('Datenbankverbindung hergestellt!');
        await db.migrateKnex()
            .then(() => { console.log('Datenbank-Migration wurde erfolgreich durchgeführt.'); migrationSuccessful = true; })
            .catch(err => console.log('Fehler bei der Migration!', JSON.stringify(err, null, 2)));
    }

    return migrationSuccessful && isConnected;
}
// worker.on('message', message => console.log(message));
// worker.postMessage('ping');

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
