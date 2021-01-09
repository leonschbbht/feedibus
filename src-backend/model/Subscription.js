const crypto = require('crypto');
const util = require('util');

module.exports = class Subscription {
    /**
     * @param {number} id
     * @param {string} type
     * @param {string} url
     * @param {number} userId
     */
    constructor (id, type, url, userId) {
        this._id = id;
        this._type = type;
        this._url = url;
        this._userId = userId;
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
    get type () {
        return this._type;
    }

    /**
     * @param {string} value
     */
    set type (value) {
        this._type = value;
    }

    /**
     * @return {string}
     */
    get url () {
        return this._url;
    }

    /**
     * @param {string} value
     */
    set url (value) {
        this._url = value;
    }

    /**
     * @return {number}
     */
    get userId () {
        return this._userId;
    }

    /**
     * @param {string} value
     * @return {Promise<boolean>}
     */
}
