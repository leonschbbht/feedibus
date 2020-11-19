const knex = require('knex');

module.exports = class Message {
    /**
     * @param {number} id
     * @param {number} jobId
     * @param {string|null} headline
     * @param {string|null} text
     * @param {string|null} imageUrl
     * @param {string|null} author
     * @param {string} sourceUrl
     * @param {Date} time
     * @param {string} identifier
     */
    constructor(
        id,
        jobId,
        headline,
        text,
        imageUrl,
        author,
        sourceUrl,
        time,
        identifier
    ) {
        this._id = id;
        this._jobId = jobId;
        this._headline = headline;
        this._text = text;
        this._imageUrl = imageUrl;
        this._author = author;
        this._sourceUrl = sourceUrl;
        this._time = time;
        this._identifier = identifier;
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
    get jobId() {
        return this._jobId;
    }

    /**
     * @param {number} value
     */
    set jobId(value) {
        this._jobId = value;
    }

    /**
     * @returns {string|null}
     */
    get headline() {
        return this._headline;
    }

    /**
     * @param {string|null} value
     */
    set headline(value) {
        this._headline = value;
    }

    /**
     * @returns {string|null}
     */
    get text() {
        return this._text;
    }

    /**
     * @param {string|null} value
     */
    set text(value) {
        this._text = value;
    }

    /**
     * @returns {string|null}
     */
    get imageUrl() {
        return this._imageUrl;
    }

    /**
     * @param {string|null} value
     */
    set imageUrl(value) {
        this._imageUrl = value;
    }

    /**
     * @returns {string|null}
     */
    get author() {
        return this._author;
    }

    /**
     * @param {string|null} value
     */
    set author(value) {
        this._author = value;
    }

    /**
     * @returns {string}
     */
    get sourceUrl() {
        return this._sourceUrl;
    }

    /**
     * @param {string} value
     */
    set sourceUrl(value) {
        this._sourceUrl = value;
    }

    /**
     * @returns {Date}
     */
    get time() {
        return this._time;
    }

    /**
     * @param {Date} value
     */
    set time(value) {
        this._time = value;
    }

    /**
     * @returns {string}
     */
    get identifier() {
        return this._identifier;
    }

    /**
     * @param {string} value
     */
    set identifier(value) {
        this._identifier = value;
    }
}
