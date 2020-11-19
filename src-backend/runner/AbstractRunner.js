const Job = require('../model/Job');
const Message = require('../model/Message');

module.exports = class AbstractRunner {
    /**
     * @param {Job} job
     * @return {Promise<Message[]>}
     */
    async runJob(job) {
        return [];
    }
}
