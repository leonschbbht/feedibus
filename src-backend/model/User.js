const crypto = require('crypto');
const util = require('util');

module.exports = class User {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {string} salt
     */
    constructor (id, name, email, password, salt) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this._salt = salt;
    }

    /**
     * @return {number}
     */
    get id () {
        return this._id;
    }

    /**
     * @param {number} value
     */
    set id (value) {
        this._id = value;
    }

    /**
     * @return {string}
     */
    get name () {
        return this._name;
    }

    /**
     * @param {string} value
     */
    set name (value) {
        this._name = value;
    }

    /**
     * @return {string}
     */
    get email () {
        return this._email;
    }

    /**
     * @param {string} value
     */
    set email (value) {
        this._email = value;
    }

    /**
     * @return {string}
     */
    get password () {
        return this._password;
    }

    /**
     * @return {string}
     */
    get salt () {
        return this._salt;
    }

    /**
     * @param {string} value
     * @return {Promise<boolean>}
     */
    async setNewPassword (value) {
        if (typeof value !== 'string') {
            return false;
        }
        const saltBuffer = await util.promisify(crypto.randomBytes)(64);
        this._salt = saltBuffer.toString('hex');
        const passwordBuffer = await util.promisify(crypto.pbkdf2)(value, this._salt, 100000, 64, 'sha512');
        this._password = passwordBuffer.toString('hex');
        return true;
    }

    /**
     * @param {string} value
     * @return {Promise<boolean>}
     */
    async validatePassword (value) {
        const hashedPasswordBuffer = await util.promisify(crypto.pbkdf2)(value, this._salt, 100000, 64, 'sha512');
        const hashedPassword = hashedPasswordBuffer.toString('hex');
        return this._password === hashedPassword;
    }
}
