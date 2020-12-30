const AbstractRunner = require('./AbstractRunner');
const getBrowser = require('../scheduler/Browser')
const Message = require('../model/Message');

module.exports = class YoutubeRunner extends AbstractRunner {
    /**
     * @param job
     * @return {Promise<Message[]>}
     */
    async runJob (job) {
        try {
            /**
             * @type {Browser}
             */
            const browser = await getBrowser();
            const page = await browser.newPage();
            await page.setCacheEnabled(false);
            await page.goto(job.url);
            await page.waitForSelector('paper-tab');
            const tabs = await page.$$('paper-tab');
            if (tabs.length < 2) {
                return [];
            }
            tabs[1].click(); // Der "Videos"-Tab
            await page.waitForSelector('yt-icon#label-icon');
            await page.waitForSelector('ytd-grid-video-renderer');
            const author = await page.$eval('yt-formatted-string.ytd-channel-name', el => el.textContent);
            if (!author) {
                return [];
            }
            const messageData = await page.$$eval('ytd-grid-video-renderer', elements => elements.map(el => {
                const titleElement = el.querySelector('a#video-title');
                const metadataElement = el.querySelector('#metadata-line');
                if (titleElement === null || metadataElement === null) {
                    return null;
                }
                const title = titleElement.title;
                const href = titleElement.href;
                if (typeof href !== 'string' || typeof title !== 'string') {
                    return null;
                }
                const matches = href.match(/v=([A-Za-z0-9_-]+)/);
                if (matches === null) {
                    return null
                }
                const id = matches[1];
                const imgUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                let dateline = '';
                if (metadataElement.childElementCount > 1) {
                    dateline = metadataElement.childNodes.item(1).textContent;
                }
                return {
                    title: title,
                    imgUrl: imgUrl,
                    href: href,
                    dateline: dateline,
                    id: id
                };
            }));
            await page.close();

            return messageData
                .filter(data => data !== null)
                .map(data => new Message(
                    0,
                    job.id,
                    data.title,
                    null,
                    data.imgUrl,
                    author,
                    data.href,
                    this.interpretDateline(data.dateline),
                    data.id
                ));
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    /**
     * @param {string} dateline
     * @return {Date}
     */
    interpretDateline (dateline) {
        const date = new Date();
        if (typeof dateline === 'string') {
            const matches = dateline.match(/(\d+)\s([^\s]+)/);
            if (matches !== null) {
                const number = parseFloat(matches[1]);
                switch (matches[2]) {
                case 'minute':
                case 'minutes':
                case 'Minute':
                case 'Minuten':
                    date.setMinutes(date.getMinutes() - number);
                    break;
                case 'day':
                case 'days':
                case 'Tag':
                case 'Tagen':
                    date.setDate(date.getDate() - number);
                    break;
                case 'month':
                case 'months':
                case 'Monat':
                case 'Monate':
                    date.setMonth(date.getMonth() - number);
                    break;
                case 'year':
                case 'years':
                case 'Jahr':
                case 'Jahren':
                    date.setFullYear(date.getFullYear() - number);
                    break;
                }
            }
        }
        return date;
    }
}
