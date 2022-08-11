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
 * Google Partners API
 *
 * Lets advertisers search certified companies and create contact leads with them, and also audits the usage of clients.
 *
 * @example
 * var google = require('googleapis');
 * var partners = google.partners('v2');
 *
 * @namespace partners
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Partners
 */
function Partners(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.userEvents = {

    /**
     * partners.userEvents.log
     *
     * @desc Logs a user event.
     *
     * @alias partners.userEvents.log
     * @memberOf! partners(v2)
     *
     * @param {object} params Parameters for request
     * @param {partners(v2).LogUserEventRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    log: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://partners.googleapis.com/v2/userEvents:log',
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

  self.clientMessages = {

    /**
     * partners.clientMessages.log
     *
     * @desc Logs a generic message from the client, such as `Failed to render component`, `Profile page is running slow`, `More than 500 users have accessed this result.`, etc.
     *
     * @alias partners.clientMessages.log
     * @memberOf! partners(v2)
     *
     * @param {object} params Parameters for request
     * @param {partners(v2).LogMessageRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    log: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://partners.googleapis.com/v2/clientMessages:log',
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

  self.userStates = {

    /**
     * partners.userStates.list
     *
     * @desc Lists states for current user.
     *
     * @alias partners.userStates.list
     * @memberOf! partners(v2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.requestMetadata.userOverrides.ipAddress IP address to use instead of the user's geo-located IP address.
     * @param {string=} params.requestMetadata.userOverrides.userId Logged-in user ID to impersonate instead of the user's ID.
     * @param {string=} params.requestMetadata.locale Locale to use for the current request.
     * @param {string=} params.requestMetadata.partnersSessionId Google Partners session ID.
     * @param {string=} params.requestMetadata.experimentIds Experiment IDs the current request belongs to.
     * @param {string=} params.requestMetadata.trafficSource.trafficSourceId Identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
     * @param {string=} params.requestMetadata.trafficSource.trafficSubId Second level identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
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
          url: 'https://partners.googleapis.com/v2/userStates',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.companies = {

    /**
     * partners.companies.get
     *
     * @desc Gets a company.
     *
     * @alias partners.companies.get
     * @memberOf! partners(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.companyId The ID of the company to retrieve.
     * @param {string=} params.requestMetadata.userOverrides.ipAddress IP address to use instead of the user's geo-located IP address.
     * @param {string=} params.requestMetadata.userOverrides.userId Logged-in user ID to impersonate instead of the user's ID.
     * @param {string=} params.requestMetadata.locale Locale to use for the current request.
     * @param {string=} params.requestMetadata.partnersSessionId Google Partners session ID.
     * @param {string=} params.requestMetadata.experimentIds Experiment IDs the current request belongs to.
     * @param {string=} params.requestMetadata.trafficSource.trafficSourceId Identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
     * @param {string=} params.requestMetadata.trafficSource.trafficSubId Second level identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
     * @param {string=} params.view The view of `Company` resource to be returned. This must not be `COMPANY_VIEW_UNSPECIFIED`.
     * @param {string=} params.orderBy How to order addresses within the returned company. Currently, only `address` and `address desc` is supported which will sorted by closest to farthest in distance from given address and farthest to closest distance from given address respectively.
     * @param {string=} params.currencyCode If the company's budget is in a different currency code than this one, then the converted budget is converted to this currency code.
     * @param {string=} params.address The address to use for sorting the company's addresses by proximity. If not given, the geo-located address of the request is used. Used when order_by is set.
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
          url: 'https://partners.googleapis.com/v2/companies/{companyId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['companyId'],
        pathParams: ['companyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * partners.companies.list
     *
     * @desc Lists companies.
     *
     * @alias partners.companies.list
     * @memberOf! partners(v2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.requestMetadata.userOverrides.ipAddress IP address to use instead of the user's geo-located IP address.
     * @param {string=} params.requestMetadata.userOverrides.userId Logged-in user ID to impersonate instead of the user's ID.
     * @param {string=} params.requestMetadata.locale Locale to use for the current request.
     * @param {string=} params.requestMetadata.partnersSessionId Google Partners session ID.
     * @param {string=} params.requestMetadata.experimentIds Experiment IDs the current request belongs to.
     * @param {string=} params.requestMetadata.trafficSource.trafficSourceId Identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
     * @param {string=} params.requestMetadata.trafficSource.trafficSubId Second level identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
     * @param {integer=} params.pageSize Requested page size. Server may return fewer companies than requested. If unspecified, server picks an appropriate default.
     * @param {string=} params.pageToken A token identifying a page of results that the server returns. Typically, this is the value of `ListCompaniesResponse.next_page_token` returned from the previous call to ListCompanies.
     * @param {string=} params.companyName Company name to search for.
     * @param {string=} params.view The view of the `Company` resource to be returned. This must not be `COMPANY_VIEW_UNSPECIFIED`.
     * @param {string=} params.minMonthlyBudget.currencyCode The 3-letter currency code defined in ISO 4217.
     * @param {string=} params.minMonthlyBudget.units The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.
     * @param {integer=} params.minMonthlyBudget.nanos Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
     * @param {string=} params.maxMonthlyBudget.currencyCode The 3-letter currency code defined in ISO 4217.
     * @param {string=} params.maxMonthlyBudget.units The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.
     * @param {integer=} params.maxMonthlyBudget.nanos Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
     * @param {string=} params.industries List of industries the company can help with.
     * @param {string=} params.services List of services the company can help with.
     * @param {string=} params.languageCodes List of language codes that company can support. Only primary language subtags are accepted as defined by BCP 47 (IETF BCP 47, "Tags for Identifying Languages").
     * @param {string=} params.address The address to use when searching for companies. If not given, the geo-located address of the request is used.
     * @param {string=} params.orderBy How to order addresses within the returned companies. Currently, only `address` and `address desc` is supported which will sorted by closest to farthest in distance from given address and farthest to closest distance from given address respectively.
     * @param {string=} params.gpsMotivations List of reasons for using Google Partner Search to get companies.
     * @param {string=} params.websiteUrl Website URL that will help to find a better matched company. .
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
          url: 'https://partners.googleapis.com/v2/companies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    leads: {

      /**
       * partners.companies.leads.create
       *
       * @desc Creates an advertiser lead for the given company ID.
       *
       * @alias partners.companies.leads.create
       * @memberOf! partners(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.companyId The ID of the company to contact.
       * @param {partners(v2).CreateLeadRequest} params.resource Request body data
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
            url: 'https://partners.googleapis.com/v2/companies/{companyId}/leads',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['companyId'],
          pathParams: ['companyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef LogUserEventRequest
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).RequestMetadata} requestMetadata Current request metadata.
 * @property {string} eventAction The action that occurred.
 * @property {string} eventCategory The category the action belongs to.
 * @property {string} eventScope The scope of the event.
 * @property {partners(v2).EventData[]} eventDatas List of event data for the event.
 * @property {string} url The URL where the event occurred.
 * @property {partners(v2).Lead} lead Advertiser lead information.
 */
/**
 * @typedef RequestMetadata
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).UserOverrides} userOverrides Values to use instead of the user&#39;s respective defaults for the current request. These are only honored by whitelisted products.
 * @property {string} locale Locale to use for the current request.
 * @property {string} partnersSessionId Google Partners session ID.
 * @property {string[]} experimentIds Experiment IDs the current request belongs to.
 * @property {partners(v2).TrafficSource} trafficSource Source of traffic for the current request.
 */
/**
 * @typedef UserOverrides
 * @memberOf! partners(v2)
 * @type object
 * @property {string} ipAddress IP address to use instead of the user&#39;s geo-located IP address.
 * @property {string} userId Logged-in user ID to impersonate instead of the user&#39;s ID.
 */
/**
 * @typedef TrafficSource
 * @memberOf! partners(v2)
 * @type object
 * @property {string} trafficSourceId Identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
 * @property {string} trafficSubId Second level identifier to indicate where the traffic comes from. An identifier has multiple letters created by a team which redirected the traffic to us.
 */
/**
 * @typedef EventData
 * @memberOf! partners(v2)
 * @type object
 * @property {string} key Data type.
 * @property {string[]} values Data values.
 */
/**
 * @typedef Lead
 * @memberOf! partners(v2)
 * @type object
 * @property {string} id ID of the lead.
 * @property {string} type Type of lead.
 * @property {string} email Email address of lead source.
 * @property {string} givenName First name of lead source.
 * @property {string} familyName Last name of lead source.
 * @property {string} websiteUrl Website URL of lead source.
 * @property {string} phoneNumber Phone number of lead source.
 * @property {string} comments Comments lead source gave.
 * @property {string[]} gpsMotivations List of reasons for using Google Partner Search and creating a lead.
 * @property {partners(v2).Money} minMonthlyBudget The minimum monthly budget lead source is willing to spend.
 */
/**
 * @typedef Money
 * @memberOf! partners(v2)
 * @type object
 * @property {string} currencyCode The 3-letter currency code defined in ISO 4217.
 * @property {string} units The whole units of the amount. For example if `currencyCode` is `&quot;USD&quot;`, then 1 unit is one US dollar.
 * @property {integer} nanos Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
 */
/**
 * @typedef LogUserEventResponse
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).ResponseMetadata} responseMetadata Current response metadata.
 */
/**
 * @typedef ResponseMetadata
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).DebugInfo} debugInfo Debug information about this request.
 */
/**
 * @typedef DebugInfo
 * @memberOf! partners(v2)
 * @type object
 * @property {string} serverInfo Info about the server that serviced this request.
 * @property {string} serviceUrl URL of the service that handled this request.
 * @property {string} serverTraceInfo Server-side debug stack trace.
 */
/**
 * @typedef LogMessageRequest
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).RequestMetadata} requestMetadata Current request metadata.
 * @property {string} level Message level of client message.
 * @property {string} details Details about the client message.
 * @property {object} clientInfo Map of client info, such as URL, browser navigator, browser platform, etc.
 */
/**
 * @typedef LogMessageResponse
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).ResponseMetadata} responseMetadata Current response metadata.
 */
/**
 * @typedef ListUserStatesResponse
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).ResponseMetadata} responseMetadata Current response metadata.
 * @property {string[]} userStates User&#39;s states.
 */
/**
 * @typedef GetCompanyResponse
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).ResponseMetadata} responseMetadata Current response metadata.
 * @property {partners(v2).Company} company The company.
 */
/**
 * @typedef Company
 * @memberOf! partners(v2)
 * @type object
 * @property {string} id The ID of the company.
 * @property {string} name The name of the company.
 * @property {partners(v2).LocalizedCompanyInfo[]} localizedInfos The list of localized info for the company.
 * @property {partners(v2).Location[]} locations The list of company locations.
 * @property {partners(v2).Money} convertedMinMonthlyBudget The minimum monthly budget that the company accepts for partner business, converted to the requested currency code.
 * @property {partners(v2).Money} originalMinMonthlyBudget The unconverted minimum monthly budget that the company accepts for partner business.
 * @property {partners(v2).PublicProfile} publicProfile Basic information from the company&#39;s public profile.
 * @property {partners(v2).CertificationStatus[]} certificationStatuses The list of Google Partners certification statuses for the company.
 * @property {partners(v2).Rank[]} ranks Information related to the ranking of the company within the list of companies.
 * @property {string} websiteUrl URL of the company&#39;s website.
 * @property {string[]} industries Industries the company can help with.
 * @property {string[]} services Services the company can help with.
 */
/**
 * @typedef LocalizedCompanyInfo
 * @memberOf! partners(v2)
 * @type object
 * @property {string} languageCode Language code of the localized company info, as defined by BCP 47 (IETF BCP 47, &quot;Tags for Identifying Languages&quot;).
 * @property {string} displayName Localized display name.
 * @property {string} overview Localized brief description that the company uses to advertise themselves.
 * @property {string[]} countryCodes List of country codes for the localized company info.
 */
/**
 * @typedef Location
 * @memberOf! partners(v2)
 * @type object
 * @property {string} address The complete address of the location.
 * @property {partners(v2).LatLng} latLng The latitude and longitude of the location, in degrees.
 */
/**
 * @typedef LatLng
 * @memberOf! partners(v2)
 * @type object
 * @property {number} latitude The latitude in degrees. It must be in the range [-90.0, +90.0].
 * @property {number} longitude The longitude in degrees. It must be in the range [-180.0, +180.0].
 */
/**
 * @typedef PublicProfile
 * @memberOf! partners(v2)
 * @type object
 * @property {string} id The ID which can be used to retrieve more details about the public profile.
 * @property {string} displayName The display name of the public profile.
 * @property {string} url The URL of the public profile.
 * @property {string} displayImageUrl The URL to the main display image of the public profile.
 */
/**
 * @typedef CertificationStatus
 * @memberOf! partners(v2)
 * @type object
 * @property {string} type The type of the certification.
 * @property {partners(v2).CertificationExamStatus[]} examStatuses List of certification exam statuses.
 * @property {boolean} isCertified Whether certification is passing.
 */
/**
 * @typedef CertificationExamStatus
 * @memberOf! partners(v2)
 * @type object
 * @property {string} type The type of certification exam.
 * @property {integer} numberUsersPass The number of people who have passed the certification exam.
 */
/**
 * @typedef Rank
 * @memberOf! partners(v2)
 * @type object
 * @property {string} type The type of rank.
 * @property {number} value The numerical value of the rank.
 */
/**
 * @typedef ListCompaniesResponse
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).ResponseMetadata} responseMetadata Current response metadata.
 * @property {partners(v2).Company[]} companies The list of companies.
 * @property {string} nextPageToken A token to retrieve next page of results. Pass this value in the `ListCompaniesRequest.page_token` field in the subsequent call to ListCompanies to retrieve the next page of results.
 */
/**
 * @typedef CreateLeadRequest
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).RequestMetadata} requestMetadata Current request metadata.
 * @property {partners(v2).Lead} lead The lead resource. The `LeadType` must not be `LEAD_TYPE_UNSPECIFIED` and either `email` or `phone_number` must be provided.
 * @property {partners(v2).RecaptchaChallenge} recaptchaChallenge reCaptcha challenge info.
 */
/**
 * @typedef RecaptchaChallenge
 * @memberOf! partners(v2)
 * @type object
 * @property {string} id The ID of the reCaptcha challenge.
 * @property {string} response The response to the reCaptcha challenge.
 */
/**
 * @typedef CreateLeadResponse
 * @memberOf! partners(v2)
 * @type object
 * @property {partners(v2).ResponseMetadata} responseMetadata Current response metadata.
 * @property {partners(v2).Lead} lead Lead that was created depending on the outcome of reCaptcha validation.
 * @property {string} recaptchaStatus The outcome of reCaptcha validation.
 */
module.exports = Partners;
