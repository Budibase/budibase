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
 * Manufacturer Center API
 *
 * Public API for managing Manufacturer Center related data.
 *
 * @example
 * var google = require('googleapis');
 * var manufacturers = google.manufacturers('v1');
 *
 * @namespace manufacturers
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Manufacturers
 */
function Manufacturers(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    products: {

      /**
       * manufacturers.accounts.products.get
       *
       * @desc Gets the product from a Manufacturer Center account, including product issues.
       *
       * @alias manufacturers.accounts.products.get
       * @memberOf! manufacturers(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.parent Parent ID in the format `accounts/{account_id}`.  `account_id` - The ID of the Manufacturer Center account.
       * @param {string} params.name Name in the format `{target_country}:{content_language}:{product_id}`.  `target_country`   - The target country of the product as a CLDR territory                      code (for example, US).  `content_language` - The content language of the product as a two-letter                      ISO 639-1 language code (for example, en).  `product_id`     -   The ID of the product. For more information, see                      https://support.google.com/manufacturers/answer/6124116#id.
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
            url: 'https://manufacturers.googleapis.com/v1/{parent}/products/{name}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['parent', 'name'],
          pathParams: ['parent', 'name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * manufacturers.accounts.products.list
       *
       * @desc Lists all the products in a Manufacturer Center account.
       *
       * @alias manufacturers.accounts.products.list
       * @memberOf! manufacturers(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Maximum number of product statuses to return in the response, used for paging.
       * @param {string} params.parent Parent ID in the format `accounts/{account_id}`.  `account_id` - The ID of the Manufacturer Center account.
       * @param {string=} params.pageToken The token returned by the previous request.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      list: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://manufacturers.googleapis.com/v1/{parent}/products',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef ListProductsResponse
 * @memberOf! manufacturers(v1)
 * @type object
 * @property {string} nextPageToken The token for the retrieval of the next page of product statuses.
 * @property {manufacturers(v1).Product[]} products List of the products.
 */
/**
 * @typedef Issue
 * @memberOf! manufacturers(v1)
 * @type object
* @property {string} severity The severity of the issue.
* @property {string} description Description of the issue.
* @property {string} attribute If present, the attribute that triggered the issue. For more information
about attributes, see
https://support.google.com/manufacturers/answer/6124116.
* @property {string} type The server-generated type of the issue, for example,
“INCORRECT_TEXT_FORMATTING”, “IMAGE_NOT_SERVEABLE”, etc.
*/
/**
 * @typedef Attributes
 * @memberOf! manufacturers(v1)
 * @type object
* @property {string} productPageUrl The URL of the manufacturer&#39;s detail page of the product. For more
information, see
https://support.google.com/manufacturers/answer/6124116#productpage.
* @property {string} mpn The Manufacturer Part Number (MPN) of the product. For more information,
see https://support.google.com/manufacturers/answer/6124116#mpn.
* @property {string} title The title of the product. For more information, see
https://support.google.com/manufacturers/answer/6124116#title.
* @property {string} productLine The name of the group of products related to the product. For more
information, see
https://support.google.com/manufacturers/answer/6124116#productline.
* @property {string} productName The canonical name of the product. For more information, see
https://support.google.com/manufacturers/answer/6124116#productname.
* @property {string} brand The brand name of the product. For more information, see
https://support.google.com/manufacturers/answer/6124116#brand.
* @property {string[]} productType The manufacturer&#39;s category of the product. For more information, see
https://support.google.com/manufacturers/answer/6124116#producttype.
* @property {string[]} gtin The Global Trade Item Number (GTIN) of the product. For more information,
see https://support.google.com/manufacturers/answer/6124116#gtin.
*/
/**
 * @typedef Product
 * @memberOf! manufacturers(v1)
 * @type object
* @property {string} parent Parent ID in the format `accounts/{account_id}`.

`account_id` - The ID of the Manufacturer Center account.
@OutputOnly
* @property {string} targetCountry The target country of the product as a CLDR territory code (for example,
US).
@OutputOnly
* @property {string} contentLanguage The content language of the product as a two-letter ISO 639-1 language code
(for example, en).
@OutputOnly
* @property {string[]} manuallyDeletedAttributes Names of the attributes of the product deleted manually via the
Manufacturer Center UI.
@OutputOnly
* @property {string} productId The ID of the product. For more information, see
https://support.google.com/manufacturers/answer/6124116#id.
@OutputOnly
* @property {manufacturers(v1).Attributes} finalAttributes Final attributes of the product. The final attributes are obtained by
overriding the uploaded attributes with the manually provided and deleted
attributes. Google systems only process, evaluate, review, and/or use final
attributes.
@OutputOnly
* @property {manufacturers(v1).Issue[]} issues A server-generated list of issues associated with the product.
@OutputOnly
* @property {string} name Name in the format `{target_country}:{content_language}:{product_id}`.

`target_country`   - The target country of the product as a CLDR territory
                     code (for example, US).

`content_language` - The content language of the product as a two-letter
                     ISO 639-1 language code (for example, en).

`product_id`     -   The ID of the product. For more information, see
                     https://support.google.com/manufacturers/answer/6124116#id.
@OutputOnly
* @property {manufacturers(v1).Attributes} uploadedAttributes Attributes of the product uploaded via the Manufacturer Center API or via
feeds.
* @property {manufacturers(v1).Attributes} manuallyProvidedAttributes Attributes of the product provided manually via the Manufacturer Center UI.
@OutputOnly
*/
module.exports = Manufacturers;
