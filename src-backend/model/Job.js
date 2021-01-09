module.exports = class Job {
    /**
     * @param {number} id
     * @param {string} type
     * @param {string} url
     */
    constructor (id, type, url) {
        this._id = id;
        this._type = type;
        this._url = url;
    }

    /**
     * @returns {number}
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
     * @returns {string}
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
     * @returns {string}
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
}
