var AWS = require('../core');
require('../metadata_service');

/**
 * Represents credentials received from the metadata service on an EC2 instance.
 *
 * By default, this class will connect to the metadata service using
 * {AWS.MetadataService} and attempt to load any available credentials. If it
 * can connect, and credentials are available, these will be used with zero
 * configuration.
 *
 * This credentials class will by default timeout after 1 second of inactivity
 * and retry 3 times.
 * If your requests to the EC2 metadata service are timing out, you can increase
 * these values by configuring them directly:
 *
 * ```javascript
 * AWS.config.credentials = new AWS.EC2MetadataCredentials({
 *   httpOptions: { timeout: 5000 }, // 5 second timeout
 *   maxRetries: 10, // retry 10 times
 *   retryDelayOptions: { base: 200 }, // see AWS.Config for information
 *   logger: console // see AWS.Config for information
 * });
 * ```
 *
 * If your requests are timing out in connecting to the metadata service, such
 * as when testing on a development machine, you can use the connectTimeout
 * option, specified in milliseconds, which also defaults to 1 second.
 *
 * If the requests failed or returns expired credentials, it will
 * extend the expiration of current credential, with a warning message. For more
 * information, please go to:
 * https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html
 *
 * @!attribute originalExpiration
 *   @return [Date] The optional original expiration of the current credential.
 *   In case of AWS outage, the EC2 metadata will extend expiration of the
 *   existing credential.
 *
 * @see AWS.Config.retryDelayOptions
 * @see AWS.Config.logger
 *
 * @!macro nobrowser
 */
AWS.EC2MetadataCredentials = AWS.util.inherit(AWS.Credentials, {
  constructor: function EC2MetadataCredentials(options) {
    AWS.Credentials.call(this);

    options = options ? AWS.util.copy(options) : {};
    options = AWS.util.merge(
      {maxRetries: this.defaultMaxRetries}, options);
    if (!options.httpOptions) options.httpOptions = {};
    options.httpOptions = AWS.util.merge(
      {timeout: this.defaultTimeout,
        connectTimeout: this.defaultConnectTimeout},
       options.httpOptions);

    this.metadataService = new AWS.MetadataService(options);
    this.logger = options.logger || AWS.config && AWS.config.logger;
  },

  /**
   * @api private
   */
  defaultTimeout: 1000,

   /**
   * @api private
   */
  defaultConnectTimeout: 1000,

  /**
   * @api private
   */
  defaultMaxRetries: 3,

  /**
   * The original expiration of the current credential. In case of AWS
   * outage, the EC2 metadata will extend expiration of the existing
   * credential.
   */
  originalExpiration: undefined,

  /**
   * Loads the credentials from the instance metadata service
   *
   * @callback callback function(err)
   *   Called when the instance metadata service responds (or fails). When
   *   this callback is called with no error, it means that the credentials
   *   information has been loaded into the object (as the `accessKeyId`,
   *   `secretAccessKey`, and `sessionToken` properties).
   *   @param err [Error] if an error occurred, this value will be filled
   * @see get
   */
  refresh: function refresh(callback) {
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },

  /**
   * @api private
   * @param callback
   */
  load: function load(callback) {
    var self = this;
    self.metadataService.loadCredentials(function(err, creds) {
      if (err) {
        if (self.hasLoadedCredentials()) {
          self.extendExpirationIfExpired();
          callback();
        } else {
          callback(err);
        }
      } else {
        self.setCredentials(creds);
        self.extendExpirationIfExpired();
        callback();
      }
    });
  },

  /**
   * Whether this credential has been loaded.
   * @api private
   */
  hasLoadedCredentials: function hasLoadedCredentials() {
    return this.AccessKeyId && this.secretAccessKey;
  },

  /**
   * if expired, extend the expiration by 15 minutes base plus a jitter of 5
   * minutes range.
   * @api private
   */
  extendExpirationIfExpired: function extendExpirationIfExpired() {
    if (this.needsRefresh()) {
      this.originalExpiration = this.originalExpiration || this.expireTime;
      this.expired = false;
      var nextTimeout = 15 * 60 + Math.floor(Math.random() * 5 * 60);
      var currentTime = AWS.util.date.getDate().getTime();
      this.expireTime = new Date(currentTime + nextTimeout * 1000);
      // TODO: add doc link;
      this.logger.warn('Attempting credential expiration extension due to a '
          + 'credential service availability issue. A refresh of these '
          + 'credentials will be attempted again at ' + this.expireTime
          + '\nFor more information, please visit: https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html');
    }
  },

  /**
   * Update the credential with new credential responded from EC2 metadata
   * service.
   * @api private
   */
  setCredentials: function setCredentials(creds) {
    var currentTime = AWS.util.date.getDate().getTime();
    var expireTime = new Date(creds.Expiration);
    this.expired = currentTime >= expireTime ? true : false;
    this.metadata = creds;
    this.accessKeyId = creds.AccessKeyId;
    this.secretAccessKey = creds.SecretAccessKey;
    this.sessionToken = creds.Token;
    this.expireTime = expireTime;
  }
});
