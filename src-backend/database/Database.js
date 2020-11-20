const dbConfig = require('../../knexfile');
const User = require('../model/User');
const Job = require('../model/Job');
const Subscription = require('../model/Subscription');
const Message = require('../model/Message');

class Database {
    constructor () {
        this._con = require('knex')(dbConfig);
    }

    /**
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<null|User>}
     */
    async createUser (name, email, password) {
        const user = new User(0, name, email, '', '');
        await user.setNewPassword(password);
        const resultArray = await this._con('user')
            .insert({
                name: user.name,
                email: user.email,
                password: user.password,
                salt: user.salt
            })
            .returning('id')
            .catch(e => {
                console.log(e);
                return null
            })
        ;
        if (resultArray && Array.isArray(resultArray)) {
            user.id = resultArray.pop();
            return user;
        }
        return null;
    }

    /**
     * @param {number} id
     * @returns {Promise<User|undefined>}
     */
    async getUserById (id) {
        const resultArray = await this._con
            .select('*')
            .from('user')
            .where('id', id)
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            return new User(row.id, row.name, row.email, row.password, row.salt);
        }
        return undefined;
    }

    /**
     * @param {string} email
     * @returns {Promise<User|undefined>}
     */
    async getUserByEmail (email) {
        const resultArray = await this._con
            .select('*')
            .from('user')
            .where('email', email)
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            return new User(row.id, row.name, row.email, row.password, row.salt);
        }
        return undefined;
    }

    /**
     * @param {User} user
     * @returns {Promise<boolean>}
     */
    async saveUser (user) {
        if (user instanceof User) {
            const id = this._con('user')
                .where('id', user.id)
                .update({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    salt: user.salt
                })
                .returning('id')
                .catch(() => null);
            return (id && Array.isArray(id) && id.length > 0);
        }
        return false;
    }

    /**
     * @return {Promise<Job[]>}
     */
    async getAllJobs () {
        const resultArray = await this._con
            .select('*')
            .from('job')
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            return resultArray.map(row => new Job(row.id, row.type, row.url));
        }
        return [];
    }

    /**
     * @param {number} id
     * @return {Promise<Job|null>}
     */
    async getJobById (id) {
        const resultArray = await this._con
            .select('*')
            .from('job')
            .where('id', id)
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length > 0) {
            const row = resultArray.pop();
            return new Job(row.id, row.type, row.url);
        }
        return null;
    }

    /**
     * @param {string} type
     * @param {string} url
     * @return {Promise<Job|null>}
     */
    async getJobByTypeAndUrl (type, url) {
        const resultArray = await this._con
            .select('*')
            .from('job')
            .where({
                type: type,
                url: url
            })
            .returning('id')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length > 0) {
            const row = resultArray.pop();
            return new Job(row.id, row.type, row.url);
        }
        return null;
    }

    /**
     * @param {string} type
     * @param {string} url
     * @return {Promise<Job|null>}
     */
    async createJob (type, url) {
        const resultArray = await this._con('job')
            .insert({
                type: type,
                url: url
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            return new Job(row.id, row.type, row.url);
        }
        return null;
    }

    /**
     * @param {number} userId
     * @param {number} jobId
     * @return {Promise<Subscription|null>}
     */
    async getSubscriptionByUserIdAndJobId (userId, jobId) {
        const resultArray = await this._con
            .select('*')
            .from('subscription')
            .where({
                userId: userId,
                jobId: jobId
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length > 0) {
            const row = resultArray.pop();
            return new Subscription(row.id, row.userId, row.jobId);
        }
        return null;
    }

    /**
     * @param {number} userId
     * @param {number} jobId
     * @return {Promise<Subscription|null>}
     */
    async createSubscription (userId, jobId) {
        const resultArray = await this._con('subscription')
            .insert({
                userId: userId,
                jobId: jobId
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            return new Subscription(row.id, row.userId, row.jobId);
        }
        return null;
    }

    /**
     *
     * @param {message} message
     * @return {Promise<Message|void>}
     */
    async saveMessage (message) {
        const resultArray = this._con('message')
            .insert({
                jobId: message.jobId,
                headline: message.headline,
                text: message.text,
                imageUrl: message.imageUrl,
                author: message.author,
                sourceUrl: message.sourceUrl,
                time: message.time,
                identifier: message.identifier
            })
            .returning('id')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            message.id = row.id;
            return message;
        }
        return null;
    }

    /**
     * @param {number} jobId
     * @param {string} identifier
     * @return {Promise<null|Message>}
     */
    async getMessageByJobIdAndIdentifier (jobId, identifier) {
        const resultArray = await this._con('message')
            .select('*')
            .where({
                jobId: jobId,
                identifier: identifier
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length > 0) {
            const row = resultArray.pop();
            return new Message(
                row.id,
                row.jobId,
                row.headline,
                row.text,
                row.imageUrl,
                row.author,
                row.sourceUrl,
                row.time,
                row.identifier
            );
        }
        return null;
    }
}

// Die Datenbankverbindung sollte ein Singleton sein
const db = new Database();
module.exports = db;
