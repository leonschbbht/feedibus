const User = require('../model/User');
const Tag = require('../model/Tag');
const Subscription = require('../model/Subscription');
const dbConfig = require('../../knexfile');

class Database {
    constructor() {
        this._con = require('knex')(dbConfig);
    }

    /**
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<null|User>}
     */
    async createUser(name, email, password) {
        const user = new User(0, name, email, '', '');
        await user.setNewPassword(password);
        const id = await this._con('user')
            .insert({
                name: user.name,
                email: user.email,
                password: user.password,
                salt: user.salt
            })
            .returning('id')
            .catch(() => null)
            ;

        if (id && Array.isArray(id)) {
            user.id = id.pop();
            return user;
        }
        return null;
    }

    /**
     * @param {number} id
     * @returns {Promise<User|undefined>}
     */
    async getUserById(id) {
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
    async getUserByEmail(email) {
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
    async saveUser(user) {
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
                .catch(() => null)
                ;
            return (id && Array.isArray(id) && id.length > 0);
        }
        return false;
    }

    async getAllTableRows(tableName) {
        const resultArray = await this._con
            .select('*')
            .from(tableName)
            .returning('*')
            .catch(() => null);
        console.log(resultArray);
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
    async createTag(name, color, userId) {
        const tag = new Tag(0, name, color, userId);
        const id = await this._con('tag')
            .insert({
                userId: tag.userId,
                color: tag.color,
                name: tag.name
            })
            .returning('id')
            .catch(() => null)
            ;

        console.log("Tag:");
        console.log(id)
        if (id && Array.isArray(id)) {
            tag.id = id.pop();
            return tag;
        }
        return null;
    }

    async deleteTableRowById(tableName, id) {
        await this._con(tableName)
            .where({
                id: id
            })
            .del();
    }

        /**
 * @param {string} type
 * @param {string} userId
 * @returns {Promise<null|Subscription>}
 */
async createSubscription(type, userId) {
    const jobUrl = await this._con('subscription')
        .select('url')
        .from('job')
        .where('type', type)
        .returning('url')
        .catch(() => null);

    const subscription = new Subscription(0, type, "", userId);
    if (jobUrl && Array.isArray(jobUrl)) {
        subscription.url = jobUrl.pop();
    }

    const id = await this._con('subscription')
        .insert({
            type: subscription.userId,
            url: subscription.url,
            userId: subscription.userId
        })
        .returning('id')
        .catch(() => null)
        ;

    console.log("Subscription:");
    console.log(id)
    if (id && Array.isArray(id)) {
        subscription.id = id.pop();
        return subscription;
    }
    return null;
}

async createJob(type, url) {

    const id = await this._con('job')
        .insert({
            type: type,
            url: url
        })
        .returning('id')
        .catch(() => null)
        ;

    console.log("Job:");
    console.log(id)
    const job = new Job(0, type, url);
    if (id && Array.isArray(id)) {
        job.id = id.pop();
        return job;
    }
    return null;
}

}

// Die Datenbankverbindung sollte ein Singleton sein
const db = new Database();
module.exports = db;
