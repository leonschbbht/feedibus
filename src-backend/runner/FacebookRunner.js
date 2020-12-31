const AbstractRunner = require('./AbstractRunner');
const getBrowser = require('../scheduler/Browser')
const Message = require('../model/Message');

module.exports = class FacebookRunner extends AbstractRunner {
    /**
     * @param job
     * @return {Promise<Message[]>}
     */
    async runJob (job) {
        const messages = [];
        try {
            const browser = await getBrowser();
            const page = await browser.newPage();
            await page.setCacheEnabled(false);
            await page.goto(job.url);
            await page.waitForSelector('div[data-key="tab_posts"] a');
            await page.$eval('div[data-key="tab_posts"] a', node => node.click()); // Die Beiträge-Seite
            await page.waitForNavigation({
                waitUntil: 'networkidle0'
            });
            // "Mehr ansehen..." verschwinden lassen
            await page.$$eval('a.see_more_link', nodes => {
                nodes.forEach(node => {
                    node.innerHTML = '';
                })
            })
            const userContentWrappers = await page.$$('.userContentWrapper');
            for (const userContentWrapper of userContentWrappers) {
                const data = await userContentWrapper.$eval('abbr[data-utime]', node => {
                    return {
                        time: node.dataset.utime,
                        href: node.parentNode.href
                    };
                });
                const timestamp = data.time;
                let href = data.href;
                const name = await userContentWrapper.$eval('h5 a', node => node.textContent);
                const text = await userContentWrapper.$eval('div.userContent', node => node.textContent);
                let img = ''
                if (await page.$x('img[data-src]').catch(() => []).length !== 0) {
                    img = await userContentWrapper.$eval('img[data-src]', node => node.dataset.src);
                }
                if (
                    !name ||
                    (!img && !text) ||
                    typeof href !== 'string' ||
                    typeof timestamp !== 'string' ||
                    !(/^\d+$/.test(timestamp)) ||
                    !(/\/(posts|photos|videos)\//.test(href))
                ) {
                    continue;
                }
                href = href.replace(/\?.+$/, '');
                const matches = href.match(/\/(\d+)\/?$/);
                if (matches === null || matches.length < 2) {
                    continue;
                }
                const postId = matches[1];
                href = href
                    .replace(/\/photos\/[^/]+\//, '/posts/')
                    .replace(/\/videos\//, '/posts/');
                messages.push(new Message(
                    0,
                    job.id,
                    '',
                    text,
                    img,
                    name,
                    href,
                    new Date(parseFloat(timestamp) * 1000),
                    postId
                ));
            }
            await page.close();
        } catch (e) {
            console.log(e);
        }
        return messages;
    }
}
