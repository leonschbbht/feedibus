module.exports = class Subscription {
    /**
     * @param {number} id
     * @param {number} userId
     * @param {number} jobId
     */
    constructor(id, userId, jobId) {
        this._id = id;
        this._userId = userId;
        this._jobId = jobId;
    }

    /**
     * @returns {number}
     */
    get id() {
        return this._id;
    }

    /**
     * @param {number} value
     */
    set id(value) {
        this._id = value;
    }

    /**
     * @returns {number}
     */
    get userId() {
        return this._userId;
    }

    /**
     * @param {number} value
     */
    set userId(value) {
        this._userId = value;
    }

    /**
     * @returns {number}
     */
    get jobId() {
        return this._jobId;
    }

    /**
     * @param {number} value
     */
    set jobId(value) {
        this._jobId = value;
    }
}
