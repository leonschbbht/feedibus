const AbstractRunner = require('./AbstractRunner');
const getBrowser = require('../scheduler/Browser')
const Message = require('../model/Message');

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
        if (globalObjects !== null && screenName) {
            const user = this.getUserFromGlobalObjectsByScreenName(globalObjects, screenName);
            if (typeof user !== 'object') {
                return [];
            }
            const userIdString = this.getStringFromUser(user, 'id_str');
            const author = this.getStringFromUser(user, 'name');
            const bannerImage = this.getStringFromUser(user, 'profile_banner_url');
            if ('tweets' in globalObjects && typeof globalObjects.tweets === 'object') {
                for (const id in globalObjects.tweets) {
                    const tweet = globalObjects.tweets[id];
                    const tweetUserIdString = this.getStringFromTweet(tweet, 'user_id_str');
                    if (tweetUserIdString !== userIdString) {
                        continue;
                    }
                    let headline = `${author} tweeted`;
                    const date = this.getDateFromTweet(tweet, 'created_at');
                    const url = `https://twitter.com/${screenName}/status/${id}`;
                    let text = this.getTweetText(tweet);
                    const image = this.getImageFromTweet(tweet);
                    let displayImage = bannerImage;
                    if (image) {
                        displayImage = image;
                    }

                    // Quoted Tweet
                    if (this.isReactionTweet(tweet)) {
                        const quotedTweetId = this.getStringFromTweet(tweet, 'quoted_status_id_str');
                        if (quotedTweetId) {
                            const quotedUserName = this.getUserNameForTweet(globalObjects, quotedTweetId);
                            if (quotedUserName) {
                                headline = `${author} reagiert auf ${quotedUserName}`;
                            }
                        }
                    }

                    // Retweet
                    if (
                        'retweeted_status_id_str' in tweet &&
                        typeof tweet.retweeted_status_id_str === 'string'
                    ) {
                        const retweetId = tweet.retweeted_status_id_str;
                        const retweetedUserName = this.getUserNameForTweet(globalObjects, retweetId);
                        if (retweetedUserName) {
                            headline = `${author} retweeted ${retweetedUserName}`;
                        }
                        if (retweetId in globalObjects.tweets) {
                            const retweet = globalObjects.tweets[retweetId];
                            if (typeof retweet === 'object') {
                                const retweetText = this.getTweetText(retweet);
                                if (retweetText) {
                                    text = retweetText;
                                }
                            }
                        }
                    }

                    const time = date !== null ? date : new Date();
                    messages.push(new Message(
                        0,
                        job.id,
                        headline,
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
        /**
         * @type {Browser}
         */
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
        const response = await responsePromise.catch(() => null);
        if (response) {
            const json = await response.json().catch(() => null);
            if (
                typeof json === 'object' &&
                'globalObjects' in json &&
                typeof json.globalObjects === 'object'
            ) {
                await page.close();
                return json.globalObjects
            }
        }
        await page.close();
        return null;
    }

    /**
     * @param {object} user
     * @param {string} key
     * @return {null|string}
     */
    getStringFromUser (user, key) {
        if (key in user && typeof user[key] === 'string') {
            return user[key];
        }
        return '';
    }

    /**
     * @param {object} globalObjects
     * @param {string} screenName
     * @return {null|object}
     */
    getUserFromGlobalObjectsByScreenName (globalObjects, screenName) {
        if ('users' in globalObjects && typeof globalObjects.users === 'object') {
            for (const userId in globalObjects.users) {
                const userData = globalObjects.users[userId];
                if (
                    typeof userData === 'object' &&
                    'screen_name' in userData &&
                    typeof userData.screen_name === 'string' &&
                    userData.screen_name.toLowerCase() === screenName.toLowerCase()
                ) {
                    return userData;
                }
            }
        }
        return null;
    }

    /**
     * @param {object} globalObjects
     * @param {string} userId
     * @return {null|object}
     */
    getUserFromGlobalObjectsById (globalObjects, userId) {
        if (
            'users' in globalObjects &&
            typeof globalObjects.users === 'object' &&
            userId in globalObjects.users &&
            typeof globalObjects.users[userId] === 'object'
        ) {
            return globalObjects.users[userId]
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
            Array.isArray(tweet.display_text_range) &&
            typeof tweet.display_text_range[0] === 'number' &&
            typeof tweet.display_text_range[1] === 'number'
        ) {
            return text.substring(tweet.display_text_range[0], tweet.display_text_range[1]);
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
                typeof medium.media_url_https === 'string'
            );
            return image ? image.media_url_https : null;
        }
        return null;
    }

    /**
     * @param {object} tweet
     * @return {boolean}
     */
    isReactionTweet (tweet) {
        return (
            'is_quote_status' in tweet &&
            tweet.is_quote_status
        );
    }

    /**
     * @param {object} globalObjects
     * @param {string} tweetId
     * @return {string|null}
     */
    getUserNameForTweet (globalObjects, tweetId) {
        const tweet = globalObjects.tweets[tweetId];
        const quotedUserId = this.getStringFromTweet(tweet, 'user_id_str');
        const quotedUser = this.getUserFromGlobalObjectsById(globalObjects, quotedUserId);
        if (typeof quotedUser === 'object') {
            const quotedUserName = this.getStringFromUser(quotedUser, 'name');
            if (quotedUserName) {
                return quotedUserName;
            }
        }
        return null;
    }
}
