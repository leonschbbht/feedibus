const RssRunner = require('./RssRunner');
const TwitterRunner = require('./TwitterRunner');
const YoutubeRunner = require('./YoutubeRunner');
const TagesschauRunner = require('./TagesschauRunner');
const FacebookRunner = require('./FacebookRunner');

/**
 * @type Record<string, AbstractRunner>
 */
module.exports = {
    rss: new RssRunner(),
    twitter: new TwitterRunner(),
    youtube: new YoutubeRunner(),
    tagesschau: new TagesschauRunner(),
    facebook: new FacebookRunner()
}
