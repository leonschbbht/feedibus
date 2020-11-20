module.exports = class AbstractRunner {
    /**
     * @param {Job} job
     * @return {Promise<Message[]>}
     */
    async runJob (job) {
        return [];
    }
}
