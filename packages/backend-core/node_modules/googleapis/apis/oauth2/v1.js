/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint maxlen: false */

'use strict';

var createAPIRequest = require('../../lib/apirequest');
var utils = require('../../lib/utils');

/**
 * Google OAuth2 API
 *
 * Obtains end-user authorization grants for use with other Google APIs.
 *
 * @example
 * var google = require('googleapis');
 * var oauth2 = google.oauth2('v1');
 *
 * @namespace oauth2
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Oauth2
 */
function Oauth2(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  /**
   * oauth2.getCertForOpenIdConnect
   *
   * 
   *
   * @alias oauth2.getCertForOpenIdConnect
   * @memberOf! oauth2(v1)
   *
   * @param {object=} params Parameters for request
   * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
   * @param {callback} callback The callback that handles the response.
   * @return {object} Request object
   */
  this.getCertForOpenIdConnect = function (params, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});

    var parameters = {
      options: utils.extend({
        url: 'https://www.googleapis.com/oauth2/v1/certs',
        method: 'GET'
      }, options),
      params: params,
      requiredParams: [],
      pathParams: [],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

  /**
   * oauth2.getCertForOpenIdConnectRaw
   *
   * 
   *
   * @alias oauth2.getCertForOpenIdConnectRaw
   * @memberOf! oauth2(v1)
   *
   * @param {object=} params Parameters for request
   * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
   * @param {callback} callback The callback that handles the response.
   * @return {object} Request object
   */
  this.getCertForOpenIdConnectRaw = function (params, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});

    var parameters = {
      options: utils.extend({
        url: 'https://www.googleapis.com/oauth2/v1/raw_public_keys',
        method: 'GET'
      }, options),
      params: params,
      requiredParams: [],
      pathParams: [],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

  /**
   * oauth2.getRobotJwk
   *
   * 
   *
   * @alias oauth2.getRobotJwk
   * @memberOf! oauth2(v1)
   *
   * @param {object} params Parameters for request
   * @param {string} params.robotEmail The email of robot account.
   * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
   * @param {callback} callback The callback that handles the response.
   * @return {object} Request object
   */
  this.getRobotJwk = function (params, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});

    var parameters = {
      options: utils.extend({
        url: 'https://www.googleapis.com/service_accounts/v1/jwk/{robotEmail}',
        method: 'GET'
      }, options),
      params: params,
      requiredParams: ['robotEmail'],
      pathParams: ['robotEmail'],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

  /**
   * oauth2.getRobotMetadataRaw
   *
   * 
   *
   * @alias oauth2.getRobotMetadataRaw
   * @memberOf! oauth2(v1)
   *
   * @param {object} params Parameters for request
   * @param {string} params.robotEmail The email of robot account.
   * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
   * @param {callback} callback The callback that handles the response.
   * @return {object} Request object
   */
  this.getRobotMetadataRaw = function (params, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});

    var parameters = {
      options: utils.extend({
        url: 'https://www.googleapis.com/service_accounts/v1/metadata/raw/{robotEmail}',
        method: 'GET'
      }, options),
      params: params,
      requiredParams: ['robotEmail'],
      pathParams: ['robotEmail'],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

  /**
   * oauth2.getRobotMetadataX509
   *
   * 
   *
   * @alias oauth2.getRobotMetadataX509
   * @memberOf! oauth2(v1)
   *
   * @param {object} params Parameters for request
   * @param {string} params.robotEmail The email of robot account.
   * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
   * @param {callback} callback The callback that handles the response.
   * @return {object} Request object
   */
  this.getRobotMetadataX509 = function (params, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});

    var parameters = {
      options: utils.extend({
        url: 'https://www.googleapis.com/service_accounts/v1/metadata/x509/{robotEmail}',
        method: 'GET'
      }, options),
      params: params,
      requiredParams: ['robotEmail'],
      pathParams: ['robotEmail'],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

  /**
   * oauth2.tokeninfo
   *
   * @desc Get token info
   *
   * @alias oauth2.tokeninfo
   * @memberOf! oauth2(v1)
   *
   * @param {object=} params Parameters for request
   * @param {string=} params.access_token The oauth2 access token
   * @param {string=} params.id_token The ID token
   * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
   * @param {callback} callback The callback that handles the response.
   * @return {object} Request object
   */
  this.tokeninfo = function (params, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});

    var parameters = {
      options: utils.extend({
        url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
        method: 'POST'
      }, options),
      params: params,
      requiredParams: [],
      pathParams: [],
      context: self
    };

    return createAPIRequest(parameters, callback);
  };

  self.userinfo = {

    /**
     * oauth2.userinfo.get
     *
     * @desc Get user info
     *
     * @alias oauth2.userinfo.get
     * @memberOf! oauth2(v1)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/oauth2/v1/userinfo',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    v2: {

      me: {

        /**
         * oauth2.userinfo.v2.me.get
         *
         * @desc Get user info
         *
         * @alias oauth2.userinfo.v2.me.get
         * @memberOf! oauth2(v1)
         *
         * @param {object=} params Parameters for request
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://www.googleapis.com/userinfo/v2/me',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: [],
            pathParams: [],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };
}

/**
 * @typedef Jwk
 * @memberOf! oauth2(v1)
 * @type object
 * @property {object[]} keys 
 */
/**
 * @typedef Raw
 * @memberOf! oauth2(v1)
 * @type object
 * @property {object[]} keyvalues 
 */
/**
 * @typedef Tokeninfo
 * @memberOf! oauth2(v1)
 * @type object
 * @property {string} access_type The access type granted with this token. It can be offline or online.
 * @property {string} audience Who is the intended audience for this token. In general the same as issued_to.
 * @property {string} email The email address of the user. Present only if the email scope is present in the request.
 * @property {boolean} email_verified Boolean flag which is true if the email address is verified. Present only if the email scope is present in the request.
 * @property {integer} expires_in The expiry time of the token, as number of seconds left until expiry.
 * @property {integer} issued_at The issue time of the token, as number of seconds.
 * @property {string} issued_to To whom was the token issued to. In general the same as audience.
 * @property {string} issuer Who issued the token.
 * @property {string} nonce Nonce of the id token.
 * @property {string} scope The space separated list of scopes granted to this token.
 * @property {string} user_id The obfuscated user id.
 * @property {boolean} verified_email Boolean flag which is true if the email address is verified. Present only if the email scope is present in the request.
 */
/**
 * @typedef Userinfoplus
 * @memberOf! oauth2(v1)
 * @type object
 * @property {string} email The user&#39;s email address.
 * @property {string} family_name The user&#39;s last name.
 * @property {string} gender The user&#39;s gender.
 * @property {string} given_name The user&#39;s first name.
 * @property {string} hd The hosted domain e.g. example.com if the user is Google apps user.
 * @property {string} id The obfuscated ID of the user.
 * @property {string} link URL of the profile page.
 * @property {string} locale The user&#39;s preferred locale.
 * @property {string} name The user&#39;s full name.
 * @property {string} picture URL of the user&#39;s picture image.
 * @property {boolean} verified_email Boolean flag which is true if the email address is verified. Always verified because we only return the user&#39;s primary email address.
 */
/**
 * @typedef X509
 * @memberOf! oauth2(v1)
 * @type object
 */
module.exports = Oauth2;
