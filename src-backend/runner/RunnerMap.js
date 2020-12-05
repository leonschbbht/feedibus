const RssRunner = require('./RssRunner');
const TwitterRunner = require('./TwitterRunner');

/**
 * @type Record<string, AbstractRunner>
 */
module.exports = {
    rss: new RssRunner(),
    twitter: new TwitterRunner()
}
