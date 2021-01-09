module.exports = class Tag {
    /**
     * @param {number} id
     * @param {number} userId
     * @param {string} name
     * @param {string} color
     */
    constructor (id, userId, name, color) {
        this._id = id;
        this._userId = userId;
        this._name = name;
        this._color = color;
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
    get userId () {
        return this._userId;
    }

    /**
     * @param {number} value
     */
    set userId (value) {
        this._userId = value;
    }

    /**
     * @returns {string}
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
     * @returns {string}
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
}
