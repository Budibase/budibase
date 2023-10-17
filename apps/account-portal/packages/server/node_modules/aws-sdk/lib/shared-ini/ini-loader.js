var AWS = require('../core');
var os = require('os');
var path = require('path');

function parseFile(filename) {
  return AWS.util.ini.parse(AWS.util.readFileSync(filename));
}

function getProfiles(fileContent) {
  var tmpContent = {};
  Object.keys(fileContent).forEach(function(sectionName) {
    if (/^sso-session\s/.test(sectionName)) return;
    Object.defineProperty(tmpContent, sectionName.replace(/^profile\s/, ''), {
      value: fileContent[sectionName],
      enumerable: true
    });
  });
  return tmpContent;
}

function getSsoSessions(fileContent) {
  var tmpContent = {};
  Object.keys(fileContent).forEach(function(sectionName) {
    if (!/^sso-session\s/.test(sectionName)) return;
    Object.defineProperty(tmpContent, sectionName.replace(/^sso-session\s/, ''), {
      value: fileContent[sectionName],
      enumerable: true
    });
  });
  return tmpContent;
}

/**
 * Ini file loader class the same as that used in the SDK. It loads and
 * parses config and credentials files in .ini format and cache the content
 * to assure files are only read once.
 * Note that calling operations on the instance instantiated from this class
 * won't affect the behavior of SDK since SDK uses an internal singleton of
 * this class.
 * @!macro nobrowser
 */
AWS.IniLoader = AWS.util.inherit({
  constructor: function IniLoader() {
    this.resolvedProfiles = {};
    this.resolvedSsoSessions = {};
  },

  /** Remove all cached files. Used after config files are updated. */
  clearCachedFiles: function clearCachedFiles() {
    this.resolvedProfiles = {};
    this.resolvedSsoSessions = {};
  },

  /**
   * Load configurations from config/credentials files and cache them
   * for later use. If no file is specified it will try to load default files.
   *
   * @param options [map] information describing the file
   * @option options filename [String] ('~/.aws/credentials' or defined by
   *   AWS_SHARED_CREDENTIALS_FILE process env var or '~/.aws/config' if
   *   isConfig is set to true)
   *   path to the file to be read.
   * @option options isConfig [Boolean] (false) True to read config file.
   * @return [map<String,String>] object containing contents from file in key-value
   *   pairs.
   */
  loadFrom: function loadFrom(options) {
    options = options || {};
    var isConfig = options.isConfig === true;
    var filename = options.filename || this.getDefaultFilePath(isConfig);
    if (!this.resolvedProfiles[filename]) {
      var fileContent = parseFile(filename);
      if (isConfig) {
        Object.defineProperty(this.resolvedProfiles, filename, {
          value: getProfiles(fileContent)
        });
      } else {
        Object.defineProperty(this.resolvedProfiles, filename, { value: fileContent });
      }
    }
    return this.resolvedProfiles[filename];
  },

  /**
   * Load sso sessions from config/credentials files and cache them
   * for later use. If no file is specified it will try to load default file.
   *
   * @param options [map] information describing the file
   * @option options filename [String] ('~/.aws/config' or defined by
   *   AWS_CONFIG_FILE process env var)
   * @return [map<String,String>] object containing contents from file in key-value
   *   pairs.
   */
  loadSsoSessionsFrom: function loadSsoSessionsFrom(options) {
    options = options || {};
    var filename = options.filename || this.getDefaultFilePath(true);
    if (!this.resolvedSsoSessions[filename]) {
      var fileContent = parseFile(filename);
      Object.defineProperty(this.resolvedSsoSessions, filename, {
        value: getSsoSessions(fileContent)
      });
    }
    return this.resolvedSsoSessions[filename];
  },

  /**
   * @api private
   */
  getDefaultFilePath: function getDefaultFilePath(isConfig) {
    return path.join(
      this.getHomeDir(),
      '.aws',
      isConfig ? 'config' : 'credentials'
    );
  },

  /**
   * @api private
   */
  getHomeDir: function getHomeDir() {
    var env = process.env;
    var home = env.HOME ||
      env.USERPROFILE ||
      (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null);

    if (home) {
      return home;
    }

    if (typeof os.homedir === 'function') {
      return os.homedir();
    }

    throw AWS.util.error(
      new Error('Cannot load credentials, HOME path not set')
    );
  }
});

var IniLoader = AWS.IniLoader;

module.exports = {
  IniLoader: IniLoader
};
