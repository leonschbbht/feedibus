const RssRunner = require('./RssRunner');

/**
 * @type Record<string, AbstractRunner>
 */
module.exports = {
    rss: new RssRunner()
}
