const crypto = require('crypto');
const util = require('util');

module.exports = class Subscription {
    /**
     * @param {number} id
     * @param {string} headline
     * @param {string} text
     * @param {string} imageUrl
     * @param {string} author
     * @param {string} sourceUrl
     * @param {string} time
     * @param {number} userId
     */
    constructor(id, headline, text, imageUrl, author, sourceUrl, time) {
        this._id = id;
        this._headline = headline;
        this._text = text;
        this._imageUrl = imageUrl;
        this._author = author;
        this._sourceUrl = sourceUrl;
        this.time = time;
        this._userId = userId;
    }

    /**
     * @return {number}
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
     * @return {string}
     */
    get headline() {
        return this._headline;
    }

    /**
     * @param {string} value
     */
    set headline(value) {
        this._headline = value;
    }

    /**
     * @return {string}
     */
    get text() {
        return this._text;
    }

    /**
     * @param {string} value
     */
    set text(value) {
        this._text = value;
    }

    /**
     * @return {number}
     */
    get userId() {
        return this._userId;
    }

    /**
 * @return {string}
 */
    get imageUrl() {
        return this._imageUrl;
    }

    /**
     * @param {string} value
     */
    set imageUrl(value) {
        this._imageUrl = value;
    }

    /**
* @return {string}
*/
    get author() {
        return this._author;
    }

    /**
     * @param {string} value
     */
    set author(value) {
        this._author = value;
    }

    /**
* @return {string}
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
* @return {string}
*/
    get time() {
        return this._time;
    }

    /**
     * @param {string} value
     */
    set time(value) {
        this._time = value;
    }


    /**
     * @param {string} value
     * @return {Promise<boolean>}
     */
}
