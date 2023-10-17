var IniLoader = require('./ini-loader').IniLoader;
/**
 * Singleton object to load specified config/credentials files.
 * It will cache all the files ever loaded;
 */
module.exports.iniLoader = new IniLoader();
