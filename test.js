const puppeter = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const util = require('util');


 const twitterLoader = async () => {
     const browser = await puppeter.launch({
         headless: true,
         product: 'chrome',
         defaultViewport: {
             height: 1080,
             width: 1920
         }
     });
     const page = await browser.newPage();
     const responsePromise = page.waitForResponse(response => (
             response.url().match('api.twitter.com/2/timeline/media/') &&
             response.status() === 200 &&
             response.request().method().toLowerCase() === 'get'
         )
     );
     await page.goto('https://twitter.com/DelosSoftware');
     const response =  await responsePromise.catch(() => null);
     const json = await response.json().catch(() => null);
     await page.close();
     console.log(json);
     console.log(json.globalObjects.users);
    return browser;
 }

twitterLoader().then(browser => {
    browser.close();
});

function getUserFromGlobalObjects (globalObjects) {
    if ('users' in globalObjects && typeof globalObjects.users === 'object') {
        for (const userData of globalObjects.users) {
            if (
                typeof userData === 'object' &&
                'name' in userData &&
                typeof userData.name === 'string'
            ) {
                return userData.name
            }
        }
    }
    return null;
}

//axios.get('https://twitter.com/DelosSoftware').then(res => {
//    console.log(res);
//    fs.writeFileSync('./twitter.html', res.data)
//})
//
// const loader = async function () {
//     const browser = await puppeter.launch({
//         headless: false,
//         product: 'chrome',
//         defaultViewport: {
//             height: 1080,
//             width: 1920
//         }
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
// }
