const AbstractRunner = require('./AbstractRunner');
const getBrowser = require('../scheduler/Browser')
const Message = require('../model/Message');
const fs = require('fs');

module.exports = class TwitterRunner extends AbstractRunner {
    /**
     * @param {Job} job
     * @return {Promise<Message[]>}
     */
    async runJob (job) {
        const messages = [];
        const globalObjects = await this.getGlobalObjectsForUrl(job.url);
        const matches = job.url.match(/twitter\.com\/(.+)($|\?|\/|#)/);
        const screenName = matches ? matches[1] : null;
        console.log(screenName);
        if (globalObjects !== null) {
            const author = this.getUsersStringFromGlobalObjects(globalObjects, 'name');
            const screenName = this.getUsersStringFromGlobalObjects(globalObjects, 'screen_name');
            const bannerImage = this.getUsersStringFromGlobalObjects(globalObjects, 'profile_banner_url');
            if ('tweets' in globalObjects && typeof globalObjects.tweets === 'object') {
                for (const id in globalObjects.tweets) {
                    const tweet = globalObjects.tweets[id];
                    const date = this.getDateFromTweet(tweet, 'created_at');
                    const url = `https://twitter.com/${screenName}/status/${id}`;
                    const text = this.getTweetText(tweet);
                    const image = this.getImageFromTweet(tweet);
                    const displayImage = image ? image : bannerImage;
                    const time = date !== null ? date : new Date();
                    messages.push(new Message(
                        0,
                        job.id,
                        null,
                        text,
                        displayImage,
                        author,
                        url,
                        time,
                        id
                    ));
                }
            }
        }
        return messages;
    }

    /**
     * @param {string} url
     * @return {Promise<null|object>}
     */
    async getGlobalObjectsForUrl (url) {
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.setCacheEnabled(false);
        const responsePromise = page.waitForResponse(response => (
                response.url().match('api.twitter.com/2/timeline/profile/') &&
                response.status() === 200 &&
                response.request().method().toLowerCase() === 'get'
            )
        );
        await page.goto(url);
        const response =  await responsePromise.catch(() => null);
        if (response) {
            const json = await response.json().catch(() => null);
            if (
                typeof json === 'object' &&
                'globalObjects' in json &&
                typeof json.globalObjects === 'object'
            ) {
                fs.writeFileSync('../../fun.json', JSON.stringify(json));
                await page.close();
                return json.globalObjects
            }
        }
        await page.close();
        return null;
    }

    /**
     * @param {object} globalObjects
     * @param {string} key
     * @return {null|string}
     */
    getUsersStringFromGlobalObjects (globalObjects, key) {
        if ('users' in globalObjects && typeof globalObjects.users === 'object') {
            for (const userId in globalObjects.users) {
                const userData = globalObjects.users[userId];
                if (
                    typeof userData === 'object' &&
                    key in userData &&
                    typeof userData[key] === 'string'
                ) {
                    return userData[key];
                }
            }
        }
        return null;
    }

    /**
     * @param {object} tweet
     * @param {string} tag
     * @return {Date|null}
     */
    getDateFromTweet (tweet, tag) {
        const text = this.getStringFromTweet(tweet, tag);
        if (typeof text === 'string') {
            return new Date(text);
        }
        return null;
    }

    /**
     * @param {object} tweet
     * @param {string} tag
     * @return {string|null}
     */
    getStringFromTweet (tweet, tag) {
        if (tag in tweet && typeof tweet[tag] === 'string') {
            return tweet[tag];
        }
        return null;
    }

    /**
     * @param {object} tweet
     * @return {string|null}
     */
    getTweetText (tweet) {
        const text = this.getStringFromTweet(tweet, 'full_text');
        if (
             typeof text === 'string' &&
            'display_text_range' in tweet &&
            Array.isArray(tweet['display_text_range']) &&
            typeof tweet['display_text_range'][0] === 'number' &&
            typeof tweet['display_text_range'][1] === 'number'
        ) {
            return text.substring(tweet['display_text_range'][0], tweet['display_text_range'][1]);
        }
        return text;
    }

    /**
     * @param {object} tweet
     * @return {string|null}
     */
    getImageFromTweet (tweet) {
        if (
            'entities' in tweet &&
            typeof tweet.entities === 'object' &&
            'media' in tweet.entities &&
            Array.isArray(tweet.entities.media)
        ) {
            const image = tweet.entities.media.find(medium =>
                typeof medium === 'object' &&
                'type' in medium &&
                medium.type === 'photo' &&
                'media_url_https' in medium &&
                typeof medium['media_url_https'] === 'string'
            );
            return image ? image['media_url_https'] : null;
        }
        return null;
    }
}
