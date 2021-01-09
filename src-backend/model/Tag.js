const crypto = require('crypto');
const util = require('util');

module.exports = class Tag {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} color
     * @param {number} userId
     */
    constructor (id, name, color, userId) {
        this._id = id;
        this._name = name;
        this._color = color;
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
    get color () {
        return this._color;
    }

    /**
     * @param {string} value
     */
    set color (value) {
        this._color = value;
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
