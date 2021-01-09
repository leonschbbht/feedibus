module.exports = class Categorisation {
    /**
     * @param {number} id
     * @param {number} subscriptionId
     * @param {number} tagId
     */
    constructor (id, subscriptionId, tagId) {
        this._id = id;
        this._subscriptionId = subscriptionId;
        this._tagId = tagId;
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
     * @returns {number}
     */
    get subscriptionId () {
        return this._subscriptionId;
    }

    /**
     * @param {number} value
     */
    set subscriptionId (value) {
        this._subscriptionId = value;
    }

    /**
     * @returns {number}
     */
    get tagId () {
        return this._tagId;
    }

    /**
     * @param {number} value
     */
    set tagId (value) {
        this._tagId = value;
    }
}
