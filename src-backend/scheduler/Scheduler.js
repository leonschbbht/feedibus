const Job = require('../model/Job');
const Message = require('../model/Message');
const AbstractRunner = require('../runner/AbstractRunner');
const { CYCLE_TIME } = require('../../config');
const RunnerMap = require('../runner/RunnerMap');
const db = require('../database/Database');

module.exports = class Scheduler {
    constructor () {
        this._jobs = [];
        this._finishedJob = [];
        this._db = db;
    }

    async loadJobs () {
        //const jobs = await this._db.getAllJobs();
        //jobs.forEach(job => this._jobs.push(job));
        this._jobs.push(new Job(0, 'twitter', 'https://twitter.com/realdonaldtrump'))

    }

    async executeJobs () {
        const startTime = Date.now();
        while (this._jobs.length > 0) {
            /**
             * @type {Job} job
             */
            const job = this._jobs.pop();
            if (!job || !(job instanceof Job)) {
                continue;
            }
            const runner = this.determineRunnerByType(job.type);
            if (!runner || !(runner instanceof AbstractRunner)) {
                continue;
            }
            const messages = await runner.runJob(job);
            //await this.insertMessagesIntoDb(messages);
            // const sortedMsg = messages.sort((a, b) => {
            //    a.time - b.time;
            //})
            //console.log(sortedMsg);
            this._finishedJob.push(job);
        }
        const finishingTime = Date.now();
        const duration = finishingTime - startTime;
        const timeoutTime = CYCLE_TIME > duration ? CYCLE_TIME - duration : 0;
        this._jobs = [...this._finishedJob, ...this._jobs];
        this._finishedJob = [];
        setTimeout(async () => await this.executeJobs(), timeoutTime);
    }

    /**
     *
     * @param {Message[]} messages
     */
    async insertMessagesIntoDb (messages) {
        for (const message of messages) {
            if (message instanceof Message) {
                const existingMessage = await this._db.getMessageByJobIdAndIdentifier(message.jobId, message.identifier);
                if (!existingMessage) {
                    await this._db.saveMessage(message);
                }
            }
        }
    }

    /**
     * @param {string} type
     * @return {AbstractRunner|null}
     */
    determineRunnerByType (type) {
        if (type in RunnerMap) {
            return RunnerMap[type];
        }
        return null;
    }

    /**
     * @param {number} id
     * @return {Promise<void>}
     */
    async registerNewJobById (id) {
        this._db.getJobById(id).then(job => {
            if (job) {
                this._jobs.push(job);
            }
        });
    }
}
