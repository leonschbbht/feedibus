const User = require('../model/User');
const Tag = require('../model/Tag');
const Subscription = require('../model/Subscription');
const Categorisation = require('../model/Categorisation');
const dbConfig = require('../../knexfile');
const Job = require('../model/Job');
const Message = require('../model/Message');

class Database {
    constructor () {
        this._con = require('knex')(dbConfig);
    }

    async migrateKnex () {
        await this._con.migrate.up();
    }

    async isConnected () {
        const result = await this._con
            .distinct()
            .select('table_catalog')
            .from('information_schema.tables')
            .catch(() => null);
        return !!result;
    }

    async reconnect () {
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

    async updateUser (userId, name, email, password) {
        const user = new User(userId, name, email, '', '');
        if (password) {
            await user.setNewPassword(password);
        }

        const attributesToUpdate = {};
        if (name) {
            attributesToUpdate.name = user.name;
        }
        if (email) {
            attributesToUpdate.email = user.email;
        }
        if (password) {
            attributesToUpdate.password = user.password;
        }
        if (user.salt) {
            attributesToUpdate.salt = user.salt;
        }

        const resultArray = await this._con('user')
            .update(attributesToUpdate)
            .where('id', user.id)
            .returning('id')
            .catch(e => {
                console.log(e);
                return null
            })
            ;
        return resultArray;
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

    async getAllTableRows (tableName) {
        const resultArray = await this._con
            .select('*')
            .from(tableName)
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            return resultArray;
        }
        return undefined;
    }

    async deleteTableRowById (tableName, id) {
        await this._con(tableName)
            .where({
                id: id
            })
            .del();
    }

    async deleteTableRowByIdAndUserId (tableName, id, userId) {
        await this._con(tableName)
            .where({
                id: id,
                userId: userId
            })
            .del();
    }

    async getTableRowsById (tableName, id) {
        const resultArray = await this._con
            .select('*')
            .from(tableName)
            .where({
                id: id
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            return resultArray;
        }
        return undefined;
    }

    async getTableRowsByUserId (tableName, userId) {
        const resultArray = await this._con
            .select('*')
            .from(tableName)
            .where({
                userId: userId
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            return resultArray;
        }
        return undefined;
    }

    /**
 * @param {string} name
 * @param {string} color
 * @param {string} userId
 * @returns {Promise<null|Tag>}
 */
    async createTag (name, color, userId) {
        const tag = new Tag(0, userId, name, color);
        const id = await this._con('tag')
            .insert({
                userId: tag.userId,
                color: tag.color,
                name: tag.name
            })
            .returning('id')
            .catch(() => null);
        if (id && Array.isArray(id)) {
            tag.id = id.pop();
            return tag;
        }
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

    async getJobsByUserId (userId) {
        const resultArray = await this._con
            .select('*')
            .from('job')
            .innerJoin('subscription', 'subscription.jobId', 'job.id')
            .innerJoin('user', 'user.id', 'subscription.userId')
            .where('user.id', userId)
            .returning(['job.id', 'job.type', 'job.url'])
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
            return new Subscription(row.id, row.userId, row.jobId, row.name);
        }
        return null;
    }

    /**
     * @param {number} userId
     * @param {number} jobId
     * @return {Promise<Subscription|null>}
     */
    async createSubscription (userId, jobId, name) {
        const resultArray = await this._con('subscription')
            .insert({
                userId: userId,
                jobId: jobId,
                name: name
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            return new Subscription(row.id, row.userId, row.jobId, row.name);
        }
        return null;
    }

    async deleteSubscriptionByJobId (jobId) {
        await this._con('subscription')
            .where({
                jobId: jobId
            })
            .del();
    }

    async getSubscriptionsByUserId (userId) {
        const subscriptionArray = await this._con
            .distinct()
            .select('subscription.id', 'subscription.userId', 'subscription.jobId', 'subscription.name', 'job.url', 'job.type')
            .from('subscription')
            .innerJoin('job', 'job.id', 'subscription.jobId')
            .leftJoin('categorisation', 'categorisation.subscriptionId', 'subscription.id')
            .where({
                'subscription.userId': userId
            })
            .catch(() => null);
        if (subscriptionArray && Array.isArray(subscriptionArray) && subscriptionArray.length > 0) {
            let userTagsArray = await this._con
                .select('tag.id', 'tag.userId', 'tag.color', 'tag.name', 'categorisation.subscriptionId')
                .from('tag')
                .innerJoin('categorisation', 'categorisation.tagId', 'tag.id')
                .where({
                    'tag.userId': userId
                })
                .catch(() => null);
            userTagsArray = userTagsArray || [];
            for (const subscription of subscriptionArray) {
                const subscriptionTags = userTagsArray.filter(tag => tag.subscriptionId === subscription.id);
                subscription.tags = subscriptionTags.map(tag => { return { id: tag.id, userId: tag.userId, color: tag.color, name: tag.name } });
            }
            return subscriptionArray;
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

    async getMessagesByUserId (userId) {
        const messageSubscriptionArray = await this._con
            .select(['message.*', 'subscription.id as subscriptionId', 'subscription.name as subscriptionName', 'job.type'])
            .from('message')
            .innerJoin('subscription', 'subscription.jobId', 'message.jobId')
            .innerJoin('job', 'subscription.jobId', 'job.id')
            .where('subscription.userId', userId)
            .returning('*')
            .catch(() => null);
        if (messageSubscriptionArray && Array.isArray(messageSubscriptionArray) && messageSubscriptionArray.length > 0) {
            const tagSubscriptionIdArray = await this._con
                .select(['tag.*', 'categorisation.subscriptionId'])
                .from('tag')
                .innerJoin('categorisation', 'categorisation.tagId', 'tag.id')
                .where('tag.userId', userId)
                .returning('*')
                .catch(() => null);

            const subscriptionIdTagsMap = new Map();
            tagSubscriptionIdArray.forEach(elem => {
                const tags = subscriptionIdTagsMap.get(elem.subscriptionId);
                if (tags) {
                    tags.push(elem);
                    subscriptionIdTagsMap.set(elem.subscriptionId, tags)
                } else {
                    subscriptionIdTagsMap.set(elem.subscriptionId, [elem])
                }
            });

            const messageIdTagsMap = new Map();
            for (const element of messageSubscriptionArray) {
                const tags = subscriptionIdTagsMap.get(element.subscriptionId);
                if (tags != null) {
                    messageIdTagsMap.set(element.id, tags);
                }
            }

            for (const element of messageSubscriptionArray) {
                const tags = messageIdTagsMap.get(element.id);
                element.tags = tags || [];
            }
            return messageSubscriptionArray;
        }
        return [];
    }

    async createCategorisation (subscriptionId, tagId) {
        const resultArray = await this._con('categorisation')
            .insert({
                subscriptionId: subscriptionId,
                tagId: tagId
            })
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray) && resultArray.length === 1) {
            const row = resultArray.pop();
            return row.id;
        }
        return null;
    }

    async getCategorisationsByUserId (userId) {
        const resultArray = await this._con
            .select('*')
            .from('categorisation')
            .innerJoin('tag', 'tag.id', 'categorisation.tagId')
            .where('tag.userId', userId)
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            return resultArray.map(row => new Categorisation(row.id, row.subscriptionId, row.tagId));
        }
        return [];
    }

    async getCategorisationBySubscriptionIdAndTagId (subscriptionId, tagId) {
        const resultArray = await this._con
            .select('*')
            .from('categorisation')
            .where({
                subscriptionId: subscriptionId,
                tagId: tagId
            })
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            const row = resultArray.pop();
            if (!row) {
                return null;
            }
            return new Categorisation(row.id, row.subscriptionId, row.tagId);
        }
        return null;
    }

    async deleteCategorisationBySubscriptionIdAndTagId (subscriptionId, tagId) {
        await this._con('categorisation')
            .where({
                subscriptionId: subscriptionId,
                tagId: tagId
            })
            .del();
    }

    async createMutipleCategorisations (subscriptionId, tagIds) {
        const categorisations = [];
        for (const id of tagIds) {
            categorisations.push({ subscriptionId: subscriptionId, tagId: id });
        }
        const resultArray = await this._con('categorisation')
            .insert(categorisations)
            .returning('*')
            .catch(() => null);
        if (resultArray && Array.isArray(resultArray)) {
            return resultArray;
        }
        return null;
    }
}
// Die Datenbankverbindung sollte ein Singleton sein
const db = new Database();
module.exports = db;
