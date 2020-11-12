// const puppeter = require('puppeteer');

// const loader = async function () {
//     const browser = await puppeter.launch({
//         headless: true,
//         product: 'chrome',
//         defaultViewport: null
//      });
//     const page = await browser.newPage();
//     await page.goto('https://www.youtube.com/c/inanutshell/videos');
//     await page.waitForSelector('ytd-grid-video-renderer')
//     .then(async () => {
//         const elements = await page.$$eval('ytd-grid-video-renderer', elements => elements.map(el => {
//             const title = el.querySelector('a#video-title');
//
//
//             return {
//                 tile: title.title,
//                 href: title.href
//             }
//         }));
//         console.log(elements);
//     });
//     await browser.close();
// }

// loader();
const Server = require('./src-backend/server/Server');
const config = require('./config.js');

/* eslint-disable-next-line no-unused-vars */
const server = new Server(config.PORT);
