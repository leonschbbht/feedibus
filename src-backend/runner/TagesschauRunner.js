const AbstractRunner = require('./AbstractRunner');
const getBrowser = require('../scheduler/Browser')
const Message = require('../model/Message');

module.exports = class TagesschauRunner extends AbstractRunner {
    /**
     * @param job
     * @return {Promise<Message[]>}
     */
    async runJob (job) {
        try {
            const browser = await getBrowser();
            const page = await browser.newPage();
            await page.setCacheEnabled(false);
            await page.goto(job.url);
            await page.waitForSelector('.teaser');
            const messageData = await page.$$eval('.section.sectionA:not(.sectionC) :not(.kachel) .teaser', elements => elements.map(el => {
                const link = el.querySelector('a');
                const headlineElement = el.querySelector('h4.headline');
                const teaserElement = el.querySelector('p.teasertext');
                const imgElement = el.querySelector('img');
                if (
                    link === null ||
                    typeof link.href !== 'string' ||
                    headlineElement === null ||
                    teaserElement === null ||
                    imgElement === null
                ) {
                    return null;
                }
                const href = link.href;
                const headline = headlineElement.textContent;
                let teaser = teaserElement.textContent;
                teaser = teaser
                    .replace(/\|\s*mehr/, '')
                    .replace('\n', '')
                    .trim()
                ;
                let author = 'Tagesschau';
                const matches = teaser.match(/\.\s+Von\s+(.+)\.?$/);
                if (matches !== null) {
                    author = matches[1];
                    teaser = teaser.replace(matches[0], '.');
                }
                let img = null;
                if (imgElement.src) {
                    img = imgElement.src;
                }
                if (headline === 'Teletext im Internet' || headline === 'TV und Radio weltweit') {
                    return null;
                }

                return {
                    href: href,
                    title: headline,
                    text: teaser,
                    author: author,
                    imgUrl: img
                }
            }));
            await page.close();
            return messageData
                .filter(data => data !== null)
                .map(data => new Message(
                    0,
                    job.id,
                    data.title,
                    data.text,
                    data.imgUrl,
                    data.author,
                    data.href,
                    new Date(),
                    data.href
                ));
        } catch (e) {
            console.log(e)
            return [];
        }
    }
}
