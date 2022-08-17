const NodeCache = require( "node-cache");
const secretHandler = new NodeCache();
module.exports = secretHandler;