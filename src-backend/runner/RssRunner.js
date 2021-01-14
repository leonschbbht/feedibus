const AbstractRunner = require('./AbstractRunner');
const Message = require('../model/Message');
const axios = require('axios');
const xml2js = require('xml2js');
const parseString = xml2js.parseStringPromise;
const crypto = require('crypto');

module.exports = class RssRunner extends AbstractRunner {
    /**
     * @param job
     * @return {Promise<Message[]>}
     */
    async runJob (job) {
        try {
            const response = await axios
                .get(job.url)
                .catch(() => null);
            if (response && typeof response === 'object' &&
                'data' in response && typeof response.data === 'string') {
                return await this.parseRssXml(response.data, job);
            }
        } catch (e) {
            console.log(e);
        }
        return [];
    }

    /**
     * @param {string} xmlString
     * @param {Job} job
     * @return {Promise<Message[]>}
     */
    async parseRssXml (xmlString, job) {
        const messages = [];
        const xml = await parseString(xmlString).catch(() => null);
        if (
            xml && typeof xml === 'object' &&
            'rss' in xml && typeof xml.rss === 'object' &&
            'channel' in xml.rss && Array.isArray(xml.rss.channel)
        ) {
            for (const channel of xml.rss.channel) {
                const pubDate = this.getDateFromNode(channel, 'pubDate');
                const lastBuildDate = this.getDateFromNode(channel, 'lastBuildDate');
                const image = this.getImageFromUrl(channel);
                if ('item' in channel && Array.isArray(channel.item)) {
                    if (Array.isArray(channel.item)) {
                        channel.item.forEach(item => {
                            const message = this.itemToMessage(item, job, pubDate, lastBuildDate, image);
                            if (message) {
                                messages.push(message);
                            }
                        })
                    } else if (typeof channel.item === 'object') {
                        const message = this.itemToMessage(channel.item, job, pubDate, lastBuildDate, image);
                        if (message) {
                            messages.push(message);
                        }
                    }
                }
            }
        }
        return messages;
    }

    /**
     * @param {object} item
     * @param {Job} job
     * @param {Date|null} channelPubDate
     * @param {Date|null} channelLastBuildDate
     * @param {string|null} channelImage
     * @return {null|Message}
     */
    itemToMessage (item, job, channelPubDate, channelLastBuildDate, channelImage) {
        const title = this.getStringFromNode(item, 'title');
        const description = this.getStringFromNode(item, 'description');
        const link = this.getStringFromNode(item, 'link');
        const pubDate = this.getDateFromNode(item, 'pubDate');
        const author = this.getStringFromNode(item, 'author');
        const date = pubDate || (channelPubDate || (channelLastBuildDate || new Date()));
        if (title && description && link) {
            return new Message(
                0,
                job.id,
                title,
                description,
                channelImage,
                author,
                link,
                date,
                this.hashString(link)
            );
        }
        return null;
    }

    /**
     * @param {object} node
     * @param {string} tag
     * @return {Date|null}
     */
    getDateFromNode (node, tag) {
        const text = this.getStringFromNode(node, tag);
        if (typeof text === 'string') {
            return new Date(text);
        }
        return null;
    }

    /**
     * @param {object} node
     * @param {string} tag
     * @return {void|string|null}
     */
    getStringFromNode (node, tag) {
        if (tag in node && Array.isArray(node[tag])) {
            const text = node[tag].pop();
            if (text && typeof text === 'string') {
                return text;
            }
        }
        return null;
    }

    /**
     * @param {object} node
     * @return {void|string|null}
     */
    getImageFromUrl (node) {
        if ('image' in node && typeof node.image === 'object') {
            return this.getStringFromNode(node.image, 'link');
        }
        return null;
    }

    /**
     * @param {string} value
     * @return {string}
     */
    hashString (value) {
        const hash = crypto.createHash('sha1');
        hash.update(value);
        return hash.digest('hex');
    }
}
