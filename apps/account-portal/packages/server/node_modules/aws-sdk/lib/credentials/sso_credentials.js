var AWS = require('../core');
var path = require('path');
var crypto = require('crypto');
var iniLoader = AWS.util.iniLoader;

/**
 *  Represents credentials from sso.getRoleCredentials API for
 * `sso_*` values defined in shared credentials file.
 *
 * ## Using SSO credentials
 *
 * The credentials file must specify the information below to use sso:
 *
 *     [profile sso-profile]
 *     sso_account_id = 012345678901
 *     sso_region = **-****-*
 *     sso_role_name = SampleRole
 *     sso_start_url = https://d-******.awsapps.com/start
 *
 * or using the session format:
 *
 *     [profile sso-token]
 *     sso_session = prod
 *     sso_account_id = 012345678901
 *     sso_role_name = SampleRole
 *
 *     [sso-session prod]
 *     sso_region = **-****-*
 *     sso_start_url = https://d-******.awsapps.com/start
 *
 * This information will be automatically added to your shared credentials file by running
 * `aws configure sso`.
 *
 * ## Using custom profiles
 *
 * The SDK supports loading credentials for separate profiles. This can be done
 * in two ways:
 *
 * 1. Set the `AWS_PROFILE` environment variable in your process prior to
 *    loading the SDK.
 * 2. Directly load the AWS.SsoCredentials provider:
 *
 * ```javascript
 * var creds = new AWS.SsoCredentials({profile: 'myprofile'});
 * AWS.config.credentials = creds;
 * ```
 *
 * @!macro nobrowser
 */
AWS.SsoCredentials = AWS.util.inherit(AWS.Credentials, {
  /**
   * Creates a new SsoCredentials object.
   *
   * @param options [map] a set of options
   * @option options profile [String] (AWS_PROFILE env var or 'default')
   *   the name of the profile to load.
   * @option options filename [String] ('~/.aws/credentials' or defined by
   *   AWS_SHARED_CREDENTIALS_FILE process env var)
   *   the filename to use when loading credentials.
   * @option options callback [Function] (err) Credentials are eagerly loaded
   *   by the constructor. When the callback is called with no error, the
   *   credentials have been loaded successfully.
   */
  constructor: function SsoCredentials(options) {
    AWS.Credentials.call(this);

    options = options || {};
    this.errorCode = 'SsoCredentialsProviderFailure';
    this.expired = true;

    this.filename = options.filename;
    this.profile = options.profile || process.env.AWS_PROFILE || AWS.util.defaultProfile;
    this.service = options.ssoClient;
    this.httpOptions = options.httpOptions || null;
    this.get(options.callback || AWS.util.fn.noop);
  },

  /**
   * @api private
   */
  load: function load(callback) {
    var self = this;

    try {
      var profiles = AWS.util.getProfilesFromSharedConfig(iniLoader, this.filename);
      var profile = profiles[this.profile] || {};

      if (Object.keys(profile).length === 0) {
        throw AWS.util.error(
          new Error('Profile ' + this.profile + ' not found'),
          { code: self.errorCode }
        );
      }

      if (profile.sso_session) {
        if (!profile.sso_account_id || !profile.sso_role_name) {
          throw AWS.util.error(
            new Error('Profile ' + this.profile + ' with session ' + profile.sso_session +
              ' does not have valid SSO credentials. Required parameters "sso_account_id", "sso_session", ' +
              '"sso_role_name". Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html'),
            { code: self.errorCode }
          );
        }
      } else {
        if (!profile.sso_start_url || !profile.sso_account_id || !profile.sso_region || !profile.sso_role_name) {
          throw AWS.util.error(
            new Error('Profile ' + this.profile + ' does not have valid SSO credentials. Required parameters "sso_account_id", "sso_region", ' +
            '"sso_role_name", "sso_start_url". Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html'),
            { code: self.errorCode }
          );
        }
      }

      this.getToken(this.profile, profile, function (err, token) {
        if (err) {
          return callback(err);
        }
        var request = {
          accessToken: token,
          accountId: profile.sso_account_id,
          roleName: profile.sso_role_name,
        };

        if (!self.service || self.service.config.region !== profile.sso_region) {
          self.service = new AWS.SSO({
            region: profile.sso_region,
            httpOptions: self.httpOptions,
          });
        }

        self.service.getRoleCredentials(request, function(err, data) {
          if (err || !data || !data.roleCredentials) {
            callback(AWS.util.error(
              err || new Error('Please log in using "aws sso login"'),
              { code: self.errorCode }
            ), null);
          } else if (!data.roleCredentials.accessKeyId || !data.roleCredentials.secretAccessKey || !data.roleCredentials.sessionToken || !data.roleCredentials.expiration) {
            throw AWS.util.error(new Error(
              'SSO returns an invalid temporary credential.'
            ));
          } else {
            self.expired = false;
            self.accessKeyId = data.roleCredentials.accessKeyId;
            self.secretAccessKey = data.roleCredentials.secretAccessKey;
            self.sessionToken = data.roleCredentials.sessionToken;
            self.expireTime = new Date(data.roleCredentials.expiration);
            callback(null);
          }
        });
      });
    } catch (err) {
      callback(err);
    }
  },

  /**
   * @private
   * Uses legacy file system retrieval or if sso-session is set,
   * use the SSOTokenProvider.
   *
   * @param {string} profileName - name of the profile.
   * @param {object} profile - profile data containing sso_session or sso_start_url etc.
   * @param {function} callback - called with (err, (string) token).
   *
   * @returns {void}
   */
  getToken: function getToken(profileName, profile, callback) {
    var self = this;

    if (profile.sso_session) {
      var _iniLoader = AWS.util.iniLoader;
      var ssoSessions = _iniLoader.loadSsoSessionsFrom();
      var ssoSession = ssoSessions[profile.sso_session];
      Object.assign(profile, ssoSession);

      var ssoTokenProvider = new AWS.SSOTokenProvider({
        profile: profileName,
      });
      ssoTokenProvider.load(function (err) {
        if (err) {
          return callback(err);
        }
        return callback(null, ssoTokenProvider.token);
      });
      return;
    }

    try {
      /**
       * The time window (15 mins) that SDK will treat the SSO token expires in before the defined expiration date in token.
       * This is needed because server side may have invalidated the token before the defined expiration date.
       */
      var EXPIRE_WINDOW_MS = 15 * 60 * 1000;
      var hasher = crypto.createHash('sha1');
      var fileName = hasher.update(profile.sso_start_url).digest('hex') + '.json';
      var cachePath = path.join(
        iniLoader.getHomeDir(),
        '.aws',
        'sso',
        'cache',
        fileName
      );
      var cacheFile = AWS.util.readFileSync(cachePath);
      var cacheContent = null;
      if (cacheFile) {
        cacheContent = JSON.parse(cacheFile);
      }
      if (!cacheContent) {
        throw AWS.util.error(
          new Error('Cached credentials not found under ' + this.profile + ' profile. Please make sure you log in with aws sso login first'),
          { code: self.errorCode }
        );
      }

      if (!cacheContent.startUrl || !cacheContent.region || !cacheContent.accessToken || !cacheContent.expiresAt) {
        throw AWS.util.error(
          new Error('Cached credentials are missing required properties. Try running aws sso login.')
        );
      }

      if (new Date(cacheContent.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS) {
        throw AWS.util.error(new Error(
          'The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.'
        ));
      }

      return callback(null, cacheContent.accessToken);
    } catch (err) {
      return callback(err, null);
    }
  },

  /**
   * Loads the credentials from the AWS SSO process
   *
   * @callback callback function(err)
   *   Called after the AWS SSO process has been executed. When this
   *   callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    iniLoader.clearCachedFiles();
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },
});
