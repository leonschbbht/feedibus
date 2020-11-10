const User = require('../model/User');
const dbConfig = require('../../knexfile');

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
                .catch(() => null)
            ;
            return (id && Array.isArray(id) && id.length > 0);
        }
        return false;
    }
}

// Die Datenbankverbindung sollte ein Singleton sein
const db = new Database();
module.exports = db;
