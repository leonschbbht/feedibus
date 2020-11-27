const puppeteer = require('puppeteer');

let browser = null;

/**
 *
 * @return {Promise<Browser>}
 */
module.exports = async () => {
    if (browser === null) {
        browser = await puppeteer.launch({
            headless: false,
            product: 'chrome',
            defaultViewport: {
                height: 1080,
                width: 1920
            }
        });
    }
    return browser;
}
