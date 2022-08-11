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
 * Firebase Dynamic Links API
 *
 * Firebase Dynamic Links API enables third party developers to programmatically create and manage Dynamic Links.
 *
 * @example
 * var google = require('googleapis');
 * var firebasedynamiclinks = google.firebasedynamiclinks('v1');
 *
 * @namespace firebasedynamiclinks
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Firebasedynamiclinks
 */
function Firebasedynamiclinks(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.shortLinks = {

    /**
     * firebasedynamiclinks.shortLinks.create
     *
     * @desc Creates a short Dynamic Link given either a valid long Dynamic Link or details such as Dynamic Link domain, Android and iOS app information. The created short Dynamic Link will not expire.  Repeated calls with the same long Dynamic Link or Dynamic Link information will produce the same short Dynamic Link.  The Dynamic Link domain in the request must be owned by requester's Firebase project.
     *
     * @alias firebasedynamiclinks.shortLinks.create
     * @memberOf! firebasedynamiclinks(v1)
     *
     * @param {object} params Parameters for request
     * @param {firebasedynamiclinks(v1).CreateShortDynamicLinkRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    create: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks',
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
 * @typedef DynamicLinkInfo
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
* @property {firebasedynamiclinks(v1).SocialMetaTagInfo} socialMetaTagInfo Parameters for social meta tag params.
Used to set meta tag data for link previews on social sites.
* @property {firebasedynamiclinks(v1).AnalyticsInfo} analyticsInfo Parameters used for tracking. See all tracking parameters in the
[documentation](https://firebase.google.com/docs/dynamic-links/android#create-a-dynamic-link-programmatically).
* @property {string} link The link your app will open, You can specify any URL your app can handle.
This link must be a well-formatted URL, be properly URL-encoded, and use
the HTTP or HTTPS scheme. See &#39;link&#39; parameters in the
[documentation](https://firebase.google.com/docs/dynamic-links/android#create-a-dynamic-link-programmatically).

Required.
* @property {string} dynamicLinkDomain Dynamic Links domain that the project owns, e.g. abcd.app.goo.gl
[Learn more](https://firebase.google.com/docs/dynamic-links/android#set-up-firebase-and-the-dynamic-links-sdk)
on how to set up Dynamic Link domain associated with your Firebase project.

Required.
* @property {firebasedynamiclinks(v1).IosInfo} iosInfo iOS related information. See iOS related parameters in the
[documentation](https://firebase.google.com/docs/dynamic-links/ios#create-a-dynamic-link-programmatically).
* @property {firebasedynamiclinks(v1).AndroidInfo} androidInfo Android related information. See Android related parameters in the
[documentation](https://firebase.google.com/docs/dynamic-links/android#create-a-dynamic-link-programmatically).
*/
/**
 * @typedef ITunesConnectAnalytics
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
* @property {string} mt iTune media types, including music, podcasts, audiobooks and so on.
* @property {string} at Affiliate token used to create affiliate-coded links.
* @property {string} ct Campaign text that developers can optionally add to any link in order to
track sales from a specific marketing campaign.
* @property {string} pt Provider token that enables analytics for Dynamic Links from within iTunes
Connect.
*/
/**
 * @typedef DynamicLinkWarning
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
 * @property {string} warningCode The warning code.
 * @property {string} warningMessage The warning message to help developers improve their requests.
 */
/**
 * @typedef CreateShortDynamicLinkRequest
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
* @property {firebasedynamiclinks(v1).DynamicLinkInfo} dynamicLinkInfo Information about the Dynamic Link to be shortened.
[Learn more](https://firebase.google.com/docs/dynamic-links/android#create-a-dynamic-link-programmatically).
* @property {string} longDynamicLink Full long Dynamic Link URL with desired query parameters specified.
For example,
&quot;https://sample.app.goo.gl/?link=http://www.google.com&amp;apn=com.sample&quot;,
[Learn more](https://firebase.google.com/docs/dynamic-links/android#create-a-dynamic-link-programmatically).
* @property {firebasedynamiclinks(v1).Suffix} suffix Short Dynamic Link suffix. Optional.
*/
/**
 * @typedef AnalyticsInfo
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
 * @property {firebasedynamiclinks(v1).GooglePlayAnalytics} googlePlayAnalytics Google Play Campaign Measurements.
 * @property {firebasedynamiclinks(v1).ITunesConnectAnalytics} itunesConnectAnalytics iTunes Connect App Analytics.
 */
/**
 * @typedef Suffix
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
 * @property {string} option Suffix option.
 */
/**
 * @typedef CreateShortDynamicLinkResponse
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
 * @property {string} previewLink Preivew link to show the link flow chart.
 * @property {firebasedynamiclinks(v1).DynamicLinkWarning[]} warning Information about potential warnings on link creation.
 * @property {string} shortLink Short Dynamic Link value. e.g. https://abcd.app.goo.gl/wxyz
 */
/**
 * @typedef IosInfo
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
* @property {string} iosAppStoreId iOS App Store ID.
* @property {string} iosIpadFallbackLink If specified, this overrides the ios_fallback_link value on iPads.
* @property {string} iosBundleId iOS bundle ID of the app.
* @property {string} iosFallbackLink Link to open on iOS if the app is not installed.
* @property {string} iosIpadBundleId iPad bundle ID of the app.
* @property {string} iosCustomScheme Custom (destination) scheme to use for iOS. By default, we’ll use the
bundle ID as the custom scheme. Developer can override this behavior using
this param.
*/
/**
 * @typedef AndroidInfo
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
* @property {string} androidMinPackageVersionCode Minimum version code for the Android app. If the installed app’s version
code is lower, then the user is taken to the Play Store.
* @property {string} androidLink If specified, this overrides the ‘link’ parameter on Android.
* @property {string} androidFallbackLink Link to open on Android if the app is not installed.
* @property {string} androidPackageName Android package name of the app.
*/
/**
 * @typedef SocialMetaTagInfo
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
 * @property {string} socialTitle Title to be displayed. Optional.
 * @property {string} socialDescription A short description of the link. Optional.
 * @property {string} socialImageLink An image url string. Optional.
 */
/**
 * @typedef GooglePlayAnalytics
 * @memberOf! firebasedynamiclinks(v1)
 * @type object
* @property {string} utmCampaign Campaign name; used for keyword analysis to identify a specific product
promotion or strategic campaign.
* @property {string} utmTerm Campaign term; used with paid search to supply the keywords for ads.
* @property {string} gclid [AdWords autotagging parameter](https://support.google.com/analytics/answer/1033981?hl=en);
used to measure Google AdWords ads. This value is generated dynamically
and should never be modified.
* @property {string} utmSource Campaign source; used to identify a search engine, newsletter, or other
source.
* @property {string} utmMedium Campaign medium; used to identify a medium such as email or cost-per-click.
* @property {string} utmContent Campaign content; used for A/B testing and content-targeted ads to
differentiate ads or links that point to the same URL.
*/
module.exports = Firebasedynamiclinks;
