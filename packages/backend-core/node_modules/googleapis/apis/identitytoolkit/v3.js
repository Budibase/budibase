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
 * Google Identity Toolkit API
 *
 * Help the third party sites to implement federated login.
 *
 * @example
 * var google = require('googleapis');
 * var identitytoolkit = google.identitytoolkit('v3');
 *
 * @namespace identitytoolkit
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Identitytoolkit
 */
function Identitytoolkit(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.relyingparty = {

    /**
     * identitytoolkit.relyingparty.createAuthUri
     *
     * @desc Creates the URI used by the IdP to authenticate the user.
     *
     * @alias identitytoolkit.relyingparty.createAuthUri
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyCreateAuthUriRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createAuthUri: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.deleteAccount
     *
     * @desc Delete user account.
     *
     * @alias identitytoolkit.relyingparty.deleteAccount
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyDeleteAccountRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.downloadAccount
     *
     * @desc Batch download user accounts.
     *
     * @alias identitytoolkit.relyingparty.downloadAccount
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyDownloadAccountRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    downloadAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/downloadAccount',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.getAccountInfo
     *
     * @desc Returns the account info.
     *
     * @alias identitytoolkit.relyingparty.getAccountInfo
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyGetAccountInfoRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getAccountInfo: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.getOobConfirmationCode
     *
     * @desc Get a code for user action confirmation.
     *
     * @alias identitytoolkit.relyingparty.getOobConfirmationCode
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).Relyingparty} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getOobConfirmationCode: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.getProjectConfig
     *
     * @desc Get project configuration.
     *
     * @alias identitytoolkit.relyingparty.getProjectConfig
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.delegatedProjectNumber Delegated GCP project number of the request.
     * @param {string=} params.projectNumber GCP project number of the request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getProjectConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.getPublicKeys
     *
     * @desc Get token signing public key.
     *
     * @alias identitytoolkit.relyingparty.getPublicKeys
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getPublicKeys: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.getRecaptchaParam
     *
     * @desc Get recaptcha secure param.
     *
     * @alias identitytoolkit.relyingparty.getRecaptchaParam
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getRecaptchaParam: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getRecaptchaParam',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.resetPassword
     *
     * @desc Reset password for a user.
     *
     * @alias identitytoolkit.relyingparty.resetPassword
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyResetPasswordRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetPassword: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.setAccountInfo
     *
     * @desc Set account info for a user.
     *
     * @alias identitytoolkit.relyingparty.setAccountInfo
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartySetAccountInfoRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setAccountInfo: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.setProjectConfig
     *
     * @desc Set project configuration.
     *
     * @alias identitytoolkit.relyingparty.setProjectConfig
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartySetProjectConfigRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setProjectConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/setProjectConfig',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.signOutUser
     *
     * @desc Sign out user.
     *
     * @alias identitytoolkit.relyingparty.signOutUser
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartySignOutUserRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    signOutUser: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signOutUser',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.signupNewUser
     *
     * @desc Signup new user.
     *
     * @alias identitytoolkit.relyingparty.signupNewUser
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartySignupNewUserRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    signupNewUser: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.uploadAccount
     *
     * @desc Batch upload existing user accounts.
     *
     * @alias identitytoolkit.relyingparty.uploadAccount
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyUploadAccountRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    uploadAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/uploadAccount',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.verifyAssertion
     *
     * @desc Verifies the assertion returned by the IdP.
     *
     * @alias identitytoolkit.relyingparty.verifyAssertion
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyVerifyAssertionRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    verifyAssertion: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyAssertion',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.verifyCustomToken
     *
     * @desc Verifies the developer asserted ID token.
     *
     * @alias identitytoolkit.relyingparty.verifyCustomToken
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyVerifyCustomTokenRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    verifyCustomToken: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * identitytoolkit.relyingparty.verifyPassword
     *
     * @desc Verifies the user entered password.
     *
     * @alias identitytoolkit.relyingparty.verifyPassword
     * @memberOf! identitytoolkit(v3)
     *
     * @param {object} params Parameters for request
     * @param {identitytoolkit(v3).IdentitytoolkitRelyingpartyVerifyPasswordRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    verifyPassword: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef CreateAuthUriResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string[]} allProviders all providers the user has once used to do federated login
 * @property {string} authUri The URI used by the IDP to authenticate the user.
 * @property {boolean} captchaRequired True if captcha is required.
 * @property {boolean} forExistingProvider True if the authUri is for user&#39;s existing provider.
 * @property {string} kind The fixed string identitytoolkit#CreateAuthUriResponse&quot;.
 * @property {string} providerId The provider ID of the auth URI.
 * @property {boolean} registered Whether the user is registered if the identifier is an email.
 * @property {string} sessionId Session ID which should be passed in the following verifyAssertion request.
 */
/**
 * @typedef DeleteAccountResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} kind The fixed string &quot;identitytoolkit#DeleteAccountResponse&quot;.
 */
/**
 * @typedef DownloadAccountResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} kind The fixed string &quot;identitytoolkit#DownloadAccountResponse&quot;.
 * @property {string} nextPageToken The next page token. To be used in a subsequent request to return the next page of results.
 * @property {identitytoolkit(v3).UserInfo[]} users The user accounts data.
 */
/**
 * @typedef EmailTemplate
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} body Email body.
 * @property {string} format Email body format.
 * @property {string} from From address of the email.
 * @property {string} fromDisplayName From display name.
 * @property {string} replyTo Reply-to address.
 * @property {string} subject Subject of the email.
 */
/**
 * @typedef GetAccountInfoResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} kind The fixed string &quot;identitytoolkit#GetAccountInfoResponse&quot;.
 * @property {identitytoolkit(v3).UserInfo[]} users The info of the users.
 */
/**
 * @typedef GetOobConfirmationCodeResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} email The email address that the email is sent to.
 * @property {string} kind The fixed string &quot;identitytoolkit#GetOobConfirmationCodeResponse&quot;.
 * @property {string} oobCode The code to be send to the user.
 */
/**
 * @typedef GetRecaptchaParamResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} kind The fixed string &quot;identitytoolkit#GetRecaptchaParamResponse&quot;.
 * @property {string} recaptchaSiteKey Site key registered at recaptcha.
 * @property {string} recaptchaStoken The stoken field for the recaptcha widget, used to request captcha challenge.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyCreateAuthUriRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} appId The app ID of the mobile app, base64(CERT_SHA1):PACKAGE_NAME for Android, BUNDLE_ID for iOS.
 * @property {string} authFlowType Explicitly specify the auth flow type. Currently only support &quot;CODE_FLOW&quot; type. The field is only used for Google provider.
 * @property {string} clientId The relying party OAuth client ID.
 * @property {string} context The opaque value used by the client to maintain context info between the authentication request and the IDP callback.
 * @property {string} continueUri The URI to which the IDP redirects the user after the federated login flow.
 * @property {object} customParameter The query parameter that client can customize by themselves in auth url. The following parameters are reserved for server so that they cannot be customized by clients: client_id, response_type, scope, redirect_uri, state, oauth_token.
 * @property {string} hostedDomain The hosted domain to restrict sign-in to accounts at that domain for Google Apps hosted accounts.
 * @property {string} identifier The email or federated ID of the user.
 * @property {string} oauthConsumerKey The developer&#39;s consumer key for OpenId OAuth Extension
 * @property {string} oauthScope Additional oauth scopes, beyond the basid user profile, that the user would be prompted to grant
 * @property {string} openidRealm Optional realm for OpenID protocol. The sub string &quot;scheme://domain:port&quot; of the param &quot;continueUri&quot; is used if this is not set.
 * @property {string} otaApp The native app package for OTA installation.
 * @property {string} providerId The IdP ID. For white listed IdPs it&#39;s a short domain name e.g. google.com, aol.com, live.net and yahoo.com. For other OpenID IdPs it&#39;s the OP identifier.
 * @property {string} sessionId The session_id passed by client.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyDeleteAccountRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string} idToken The GITKit token or STS id token of the authenticated user.
 * @property {string} localId The local ID of the user.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyDownloadAccountRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {integer} maxResults The max number of results to return in the response.
 * @property {string} nextPageToken The token for the next page. This should be taken from the previous response.
 * @property {string} targetProjectId Specify which project (field value is actually project id) to operate. Only used when provided credential.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyGetAccountInfoRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string[]} email The list of emails of the users to inquiry.
 * @property {string} idToken The GITKit token of the authenticated user.
 * @property {string[]} localId The list of local ID&#39;s of the users to inquiry.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyGetProjectConfigResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {boolean} allowPasswordUser Whether to allow password user sign in or sign up.
 * @property {string} apiKey Browser API key, needed when making http request to Apiary.
 * @property {string[]} authorizedDomains Authorized domains.
 * @property {identitytoolkit(v3).EmailTemplate} changeEmailTemplate Change email template.
 * @property {string} dynamicLinksDomain 
 * @property {boolean} enableAnonymousUser Whether anonymous user is enabled.
 * @property {identitytoolkit(v3).IdpConfig[]} idpConfig OAuth2 provider configuration.
 * @property {identitytoolkit(v3).EmailTemplate} legacyResetPasswordTemplate Legacy reset password email template.
 * @property {string} projectId Project ID of the relying party.
 * @property {identitytoolkit(v3).EmailTemplate} resetPasswordTemplate Reset password email template.
 * @property {boolean} useEmailSending Whether to use email sending provided by Firebear.
 * @property {identitytoolkit(v3).EmailTemplate} verifyEmailTemplate Verify email template.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyGetPublicKeysResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 */
/**
 * @typedef IdentitytoolkitRelyingpartyResetPasswordRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} email The email address of the user.
 * @property {string} newPassword The new password inputted by the user.
 * @property {string} oldPassword The old password inputted by the user.
 * @property {string} oobCode The confirmation code.
 */
/**
 * @typedef IdentitytoolkitRelyingpartySetAccountInfoRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} captchaChallenge The captcha challenge.
 * @property {string} captchaResponse Response to the captcha.
 * @property {string} createdAt The timestamp when the account is created.
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string[]} deleteAttribute The attributes users request to delete.
 * @property {string[]} deleteProvider The IDPs the user request to delete.
 * @property {boolean} disableUser Whether to disable the user.
 * @property {string} displayName The name of the user.
 * @property {string} email The email of the user.
 * @property {boolean} emailVerified Mark the email as verified or not.
 * @property {string} idToken The GITKit token of the authenticated user.
 * @property {string} instanceId Instance id token of the app.
 * @property {string} lastLoginAt Last login timestamp.
 * @property {string} localId The local ID of the user.
 * @property {string} oobCode The out-of-band code of the change email request.
 * @property {string} password The new password of the user.
 * @property {string} photoUrl The photo url of the user.
 * @property {string[]} provider The associated IDPs of the user.
 * @property {boolean} returnSecureToken Whether return sts id token and refresh token instead of gitkit token.
 * @property {boolean} upgradeToFederatedLogin Mark the user to upgrade to federated login.
 * @property {string} validSince Timestamp in seconds for valid login token.
 */
/**
 * @typedef IdentitytoolkitRelyingpartySetProjectConfigRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {boolean} allowPasswordUser Whether to allow password user sign in or sign up.
 * @property {string} apiKey Browser API key, needed when making http request to Apiary.
 * @property {string[]} authorizedDomains Authorized domains for widget redirect.
 * @property {identitytoolkit(v3).EmailTemplate} changeEmailTemplate Change email template.
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {boolean} enableAnonymousUser Whether to enable anonymous user.
 * @property {identitytoolkit(v3).IdpConfig[]} idpConfig Oauth2 provider configuration.
 * @property {identitytoolkit(v3).EmailTemplate} legacyResetPasswordTemplate Legacy reset password email template.
 * @property {identitytoolkit(v3).EmailTemplate} resetPasswordTemplate Reset password email template.
 * @property {boolean} useEmailSending Whether to use email sending provided by Firebear.
 * @property {identitytoolkit(v3).EmailTemplate} verifyEmailTemplate Verify email template.
 */
/**
 * @typedef IdentitytoolkitRelyingpartySetProjectConfigResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} projectId Project ID of the relying party.
 */
/**
 * @typedef IdentitytoolkitRelyingpartySignOutUserRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} instanceId Instance id token of the app.
 * @property {string} localId The local ID of the user.
 */
/**
 * @typedef IdentitytoolkitRelyingpartySignOutUserResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} localId The local ID of the user.
 */
/**
 * @typedef IdentitytoolkitRelyingpartySignupNewUserRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} captchaChallenge The captcha challenge.
 * @property {string} captchaResponse Response to the captcha.
 * @property {boolean} disabled Whether to disable the user. Only can be used by service account.
 * @property {string} displayName The name of the user.
 * @property {string} email The email of the user.
 * @property {boolean} emailVerified Mark the email as verified or not. Only can be used by service account.
 * @property {string} idToken The GITKit token of the authenticated user.
 * @property {string} instanceId Instance id token of the app.
 * @property {string} password The new password of the user.
 * @property {string} photoUrl The photo url of the user.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyUploadAccountRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {boolean} allowOverwrite Whether allow overwrite existing account when user local_id exists.
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string} hashAlgorithm The password hash algorithm.
 * @property {integer} memoryCost Memory cost for hash calculation. Used by scrypt similar algorithms.
 * @property {integer} rounds Rounds for hash calculation. Used by scrypt and similar algorithms.
 * @property {string} saltSeparator The salt separator.
 * @property {boolean} sanityCheck If true, backend will do sanity check(including duplicate email and federated id) when uploading account.
 * @property {string} signerKey The key for to hash the password.
 * @property {string} targetProjectId Specify which project (field value is actually project id) to operate. Only used when provided credential.
 * @property {identitytoolkit(v3).UserInfo[]} users The account info to be stored.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyVerifyAssertionRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string} idToken The GITKit token of the authenticated user.
 * @property {string} instanceId Instance id token of the app.
 * @property {string} pendingIdToken The GITKit token for the non-trusted IDP pending to be confirmed by the user.
 * @property {string} postBody The post body if the request is a HTTP POST.
 * @property {string} requestUri The URI to which the IDP redirects the user back. It may contain federated login result params added by the IDP.
 * @property {boolean} returnIdpCredential Whether return 200 and IDP credential rather than throw exception when federated id is already linked.
 * @property {boolean} returnRefreshToken Whether to return refresh tokens.
 * @property {boolean} returnSecureToken Whether return sts id token and refresh token instead of gitkit token.
 * @property {string} sessionId Session ID, which should match the one in previous createAuthUri request.
 */
/**
 * @typedef IdentitytoolkitRelyingpartyVerifyCustomTokenRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string} instanceId Instance id token of the app.
 * @property {boolean} returnSecureToken Whether return sts id token and refresh token instead of gitkit token.
 * @property {string} token The custom token to verify
 */
/**
 * @typedef IdentitytoolkitRelyingpartyVerifyPasswordRequest
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} captchaChallenge The captcha challenge.
 * @property {string} captchaResponse Response to the captcha.
 * @property {string} delegatedProjectNumber GCP project number of the requesting delegated app. Currently only intended for Firebase V1 migration.
 * @property {string} email The email of the user.
 * @property {string} idToken The GITKit token of the authenticated user.
 * @property {string} instanceId Instance id token of the app.
 * @property {string} password The password inputed by the user.
 * @property {string} pendingIdToken The GITKit token for the non-trusted IDP, which is to be confirmed by the user.
 * @property {boolean} returnSecureToken Whether return sts id token and refresh token instead of gitkit token.
 */
/**
 * @typedef IdpConfig
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} clientId OAuth2 client ID.
 * @property {boolean} enabled Whether this IDP is enabled.
 * @property {integer} experimentPercent Percent of users who will be prompted/redirected federated login for this IDP.
 * @property {string} provider OAuth2 provider.
 * @property {string} secret OAuth2 client secret.
 * @property {string[]} whitelistedAudiences Whitelisted client IDs for audience check.
 */
/**
 * @typedef Relyingparty
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} captchaResp The recaptcha response from the user.
 * @property {string} challenge The recaptcha challenge presented to the user.
 * @property {string} email The email of the user.
 * @property {string} idToken The user&#39;s Gitkit login token for email change.
 * @property {string} kind The fixed string &quot;identitytoolkit#relyingparty&quot;.
 * @property {string} newEmail The new email if the code is for email change.
 * @property {string} requestType The request type.
 * @property {string} userIp The IP address of the user.
 */
/**
 * @typedef ResetPasswordResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} email The user&#39;s email. If the out-of-band code is for email recovery, the user&#39;s original email.
 * @property {string} kind The fixed string &quot;identitytoolkit#ResetPasswordResponse&quot;.
 * @property {string} newEmail If the out-of-band code is for email recovery, the user&#39;s new email.
 * @property {string} requestType The request type.
 */
/**
 * @typedef SetAccountInfoResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} displayName The name of the user.
 * @property {string} email The email of the user.
 * @property {string} expiresIn If idToken is STS id token, then this field will be expiration time of STS id token in seconds.
 * @property {string} idToken The Gitkit id token to login the newly sign up user.
 * @property {string} kind The fixed string &quot;identitytoolkit#SetAccountInfoResponse&quot;.
 * @property {string} localId The local ID of the user.
 * @property {string} newEmail The new email the user attempts to change to.
 * @property {string} passwordHash The user&#39;s hashed password.
 * @property {string} photoUrl The photo url of the user.
 * @property {object[]} providerUserInfo The user&#39;s profiles at the associated IdPs.
 * @property {string} refreshToken If idToken is STS id token, then this field will be refresh token.
 */
/**
 * @typedef SignupNewUserResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} displayName The name of the user.
 * @property {string} email The email of the user.
 * @property {string} expiresIn If idToken is STS id token, then this field will be expiration time of STS id token in seconds.
 * @property {string} idToken The Gitkit id token to login the newly sign up user.
 * @property {string} kind The fixed string &quot;identitytoolkit#SignupNewUserResponse&quot;.
 * @property {string} localId The RP local ID of the user.
 * @property {string} refreshToken If idToken is STS id token, then this field will be refresh token.
 */
/**
 * @typedef UploadAccountResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {object[]} error The error encountered while processing the account info.
 * @property {string} kind The fixed string &quot;identitytoolkit#UploadAccountResponse&quot;.
 */
/**
 * @typedef UserInfo
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} createdAt User creation timestamp.
 * @property {boolean} customAuth Whether the user is authenticated by the developer.
 * @property {boolean} disabled Whether the user is disabled.
 * @property {string} displayName The name of the user.
 * @property {string} email The email of the user.
 * @property {boolean} emailVerified Whether the email has been verified.
 * @property {string} lastLoginAt last login timestamp.
 * @property {string} localId The local ID of the user.
 * @property {string} passwordHash The user&#39;s hashed password.
 * @property {number} passwordUpdatedAt The timestamp when the password was last updated.
 * @property {string} photoUrl The URL of the user profile photo.
 * @property {object[]} providerUserInfo The IDP of the user.
 * @property {string} rawPassword The user&#39;s plain text password.
 * @property {string} salt The user&#39;s password salt.
 * @property {string} screenName User&#39;s screen name at Twitter or login name at Github.
 * @property {string} validSince Timestamp in seconds for valid login token.
 * @property {integer} version Version of the user&#39;s password.
 */
/**
 * @typedef VerifyAssertionResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} action The action code.
 * @property {string} appInstallationUrl URL for OTA app installation.
 * @property {string} appScheme The custom scheme used by mobile app.
 * @property {string} context The opaque value used by the client to maintain context info between the authentication request and the IDP callback.
 * @property {string} dateOfBirth The birth date of the IdP account.
 * @property {string} displayName The display name of the user.
 * @property {string} email The email returned by the IdP. NOTE: The federated login user may not own the email.
 * @property {boolean} emailRecycled It&#39;s true if the email is recycled.
 * @property {boolean} emailVerified The value is true if the IDP is also the email provider. It means the user owns the email.
 * @property {string} errorMessage Client error code.
 * @property {string} expiresIn If idToken is STS id token, then this field will be expiration time of STS id token in seconds.
 * @property {string} federatedId The unique ID identifies the IdP account.
 * @property {string} firstName The first name of the user.
 * @property {string} fullName The full name of the user.
 * @property {string} idToken The ID token.
 * @property {string} inputEmail It&#39;s the identifier param in the createAuthUri request if the identifier is an email. It can be used to check whether the user input email is different from the asserted email.
 * @property {string} kind The fixed string &quot;identitytoolkit#VerifyAssertionResponse&quot;.
 * @property {string} language The language preference of the user.
 * @property {string} lastName The last name of the user.
 * @property {string} localId The RP local ID if it&#39;s already been mapped to the IdP account identified by the federated ID.
 * @property {boolean} needConfirmation Whether the assertion is from a non-trusted IDP and need account linking confirmation.
 * @property {boolean} needEmail Whether need client to supply email to complete the federated login flow.
 * @property {string} nickName The nick name of the user.
 * @property {string} oauthAccessToken The OAuth2 access token.
 * @property {string} oauthAuthorizationCode The OAuth2 authorization code.
 * @property {integer} oauthExpireIn The lifetime in seconds of the OAuth2 access token.
 * @property {string} oauthIdToken The OIDC id token.
 * @property {string} oauthRequestToken The user approved request token for the OpenID OAuth extension.
 * @property {string} oauthScope The scope for the OpenID OAuth extension.
 * @property {string} oauthTokenSecret The OAuth1 access token secret.
 * @property {string} originalEmail The original email stored in the mapping storage. It&#39;s returned when the federated ID is associated to a different email.
 * @property {string} photoUrl The URI of the public accessible profiel picture.
 * @property {string} providerId The IdP ID. For white listed IdPs it&#39;s a short domain name e.g. google.com, aol.com, live.net and yahoo.com. If the &quot;providerId&quot; param is set to OpenID OP identifer other than the whilte listed IdPs the OP identifier is returned. If the &quot;identifier&quot; param is federated ID in the createAuthUri request. The domain part of the federated ID is returned.
 * @property {string} rawUserInfo Raw IDP-returned user info.
 * @property {string} refreshToken If idToken is STS id token, then this field will be refresh token.
 * @property {string} screenName The screen_name of a Twitter user or the login name at Github.
 * @property {string} timeZone The timezone of the user.
 * @property {string[]} verifiedProvider When action is &#39;map&#39;, contains the idps which can be used for confirmation.
 */
/**
 * @typedef VerifyCustomTokenResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} expiresIn If idToken is STS id token, then this field will be expiration time of STS id token in seconds.
 * @property {string} idToken The GITKit token for authenticated user.
 * @property {string} kind The fixed string &quot;identitytoolkit#VerifyCustomTokenResponse&quot;.
 * @property {string} refreshToken If idToken is STS id token, then this field will be refresh token.
 */
/**
 * @typedef VerifyPasswordResponse
 * @memberOf! identitytoolkit(v3)
 * @type object
 * @property {string} displayName The name of the user.
 * @property {string} email The email returned by the IdP. NOTE: The federated login user may not own the email.
 * @property {string} expiresIn If idToken is STS id token, then this field will be expiration time of STS id token in seconds.
 * @property {string} idToken The GITKit token for authenticated user.
 * @property {string} kind The fixed string &quot;identitytoolkit#VerifyPasswordResponse&quot;.
 * @property {string} localId The RP local ID if it&#39;s already been mapped to the IdP account identified by the federated ID.
 * @property {string} oauthAccessToken The OAuth2 access token.
 * @property {string} oauthAuthorizationCode The OAuth2 authorization code.
 * @property {integer} oauthExpireIn The lifetime in seconds of the OAuth2 access token.
 * @property {string} photoUrl The URI of the user&#39;s photo at IdP
 * @property {string} refreshToken If idToken is STS id token, then this field will be refresh token.
 * @property {boolean} registered Whether the email is registered.
 */
module.exports = Identitytoolkit;
