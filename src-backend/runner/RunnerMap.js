const RssRunner = require('./RssRunner');
const TwitterRunner = require('./TwitterRunner');
const YoutubeRunner = require('./YoutubeRunner');

/**
 * @type Record<string, AbstractRunner>
 */
module.exports = {
    rss: new RssRunner(),
    twitter: new TwitterRunner(),
    youtube: new YoutubeRunner()
}
