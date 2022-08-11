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
 * Consumer Surveys API
 *
 * Creates and conducts surveys, lists the surveys that an authenticated user owns, and retrieves survey results and information about specified surveys.
 *
 * @example
 * var google = require('googleapis');
 * var consumersurveys = google.consumersurveys('v2');
 *
 * @namespace consumersurveys
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Consumersurveys
 */
function Consumersurveys(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.mobileapppanels = {

    /**
     * consumersurveys.mobileapppanels.get
     *
     * @desc Retrieves a MobileAppPanel that is available to the authenticated user.
     *
     * @alias consumersurveys.mobileapppanels.get
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.panelId External URL ID for the panel.
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
          url: 'https://www.googleapis.com/consumersurveys/v2/mobileAppPanels/{panelId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['panelId'],
        pathParams: ['panelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * consumersurveys.mobileapppanels.list
     *
     * @desc Lists the MobileAppPanels available to the authenticated user.
     *
     * @alias consumersurveys.mobileapppanels.list
     * @memberOf! consumersurveys(v2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
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
          url: 'https://www.googleapis.com/consumersurveys/v2/mobileAppPanels',
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
     * consumersurveys.mobileapppanels.update
     *
     * @desc Updates a MobileAppPanel. Currently the only property that can be updated is the owners property.
     *
     * @alias consumersurveys.mobileapppanels.update
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.panelId External URL ID for the panel.
     * @param {consumersurveys(v2).MobileAppPanel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/consumersurveys/v2/mobileAppPanels/{panelId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['panelId'],
        pathParams: ['panelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.results = {

    /**
     * consumersurveys.results.get
     *
     * @desc Retrieves any survey results that have been produced so far. Results are formatted as an Excel file. You must add "?alt=media" to the URL as an argument to get results.
     *
     * @alias consumersurveys.results.get
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
     * @param {consumersurveys(v2).ResultsGetRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys/{surveyUrlId}/results',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.surveys = {

    /**
     * consumersurveys.surveys.delete
     *
     * @desc Removes a survey from view in all user GET requests.
     *
     * @alias consumersurveys.surveys.delete
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys/{surveyUrlId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * consumersurveys.surveys.get
     *
     * @desc Retrieves information about the specified survey.
     *
     * @alias consumersurveys.surveys.get
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
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
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys/{surveyUrlId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * consumersurveys.surveys.insert
     *
     * @desc Creates a survey.
     *
     * @alias consumersurveys.surveys.insert
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {consumersurveys(v2).Survey} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys',
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
     * consumersurveys.surveys.list
     *
     * @desc Lists the surveys owned by the authenticated user.
     *
     * @alias consumersurveys.surveys.list
     * @memberOf! consumersurveys(v2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
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
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys',
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
     * consumersurveys.surveys.start
     *
     * @desc Begins running a survey.
     *
     * @alias consumersurveys.surveys.start
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resourceId 
     * @param {consumersurveys(v2).SurveysStartRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    start: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys/{resourceId}/start',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resourceId'],
        pathParams: ['resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * consumersurveys.surveys.stop
     *
     * @desc Stops a running survey.
     *
     * @alias consumersurveys.surveys.stop
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resourceId 
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stop: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys/{resourceId}/stop',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resourceId'],
        pathParams: ['resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * consumersurveys.surveys.update
     *
     * @desc Updates a survey. Currently the only property that can be updated is the owners property.
     *
     * @alias consumersurveys.surveys.update
     * @memberOf! consumersurveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
     * @param {consumersurveys(v2).Survey} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/consumersurveys/v2/surveys/{surveyUrlId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef FieldMask
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {consumersurveys(v2).FieldMask[]} fields 
 * @property {integer} id 
 */
/**
 * @typedef MobileAppPanel
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} country 
 * @property {boolean} isPublicPanel 
 * @property {string} language 
 * @property {string} mobileAppPanelId 
 * @property {string} name 
 * @property {string[]} owners 
 */
/**
 * @typedef MobileAppPanelsListResponse
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {consumersurveys(v2).PageInfo} pageInfo 
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {consumersurveys(v2).MobileAppPanel[]} resources An individual predefined panel of Opinion Rewards mobile users.
 * @property {consumersurveys(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef PageInfo
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {integer} resultPerPage 
 * @property {integer} startIndex 
 * @property {integer} totalResults 
 */
/**
 * @typedef ResultsGetRequest
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {consumersurveys(v2).ResultsMask} resultMask 
 */
/**
 * @typedef ResultsMask
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {consumersurveys(v2).FieldMask[]} fields 
 * @property {string} projection 
 */
/**
 * @typedef Survey
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {consumersurveys(v2).SurveyAudience} audience 
 * @property {consumersurveys(v2).SurveyCost} cost 
 * @property {string} customerData 
 * @property {string} description 
 * @property {string[]} owners 
 * @property {consumersurveys(v2).SurveyQuestion[]} questions 
 * @property {consumersurveys(v2).SurveyRejection} rejectionReason 
 * @property {string} state 
 * @property {string} surveyUrlId 
 * @property {string} title 
 * @property {integer} wantedResponseCount 
 */
/**
 * @typedef SurveyAudience
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string[]} ages 
 * @property {string} country 
 * @property {string} countrySubdivision 
 * @property {string} gender 
 * @property {string[]} languages 
 * @property {string} mobileAppPanelId 
 * @property {string} populationSource 
 */
/**
 * @typedef SurveyCost
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} costPerResponseNanos 
 * @property {string} currencyCode 
 * @property {string} maxCostPerResponseNanos 
 * @property {string} nanos 
 */
/**
 * @typedef SurveyQuestion
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} answerOrder 
 * @property {string[]} answers 
 * @property {boolean} hasOther 
 * @property {string} highValueLabel 
 * @property {consumersurveys(v2).SurveyQuestionImage[]} images 
 * @property {boolean} lastAnswerPositionPinned 
 * @property {string} lowValueLabel 
 * @property {boolean} mustPickSuggestion 
 * @property {string} numStars 
 * @property {string} openTextPlaceholder 
 * @property {string[]} openTextSuggestions 
 * @property {string} question 
 * @property {string} sentimentText 
 * @property {boolean} singleLineResponse 
 * @property {string[]} thresholdAnswers 
 * @property {string} type 
 * @property {string} unitOfMeasurementLabel 
 * @property {string} videoId 
 */
/**
 * @typedef SurveyQuestionImage
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} altText 
 * @property {string} data 
 * @property {string} url 
 */
/**
 * @typedef SurveyRejection
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} explanation 
 * @property {string} type 
 */
/**
 * @typedef SurveyResults
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} status 
 * @property {string} surveyUrlId 
 */
/**
 * @typedef SurveysDeleteResponse
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 */
/**
 * @typedef SurveysListResponse
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {consumersurveys(v2).PageInfo} pageInfo 
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {consumersurveys(v2).Survey[]} resources An individual survey resource.
 * @property {consumersurveys(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef SurveysStartRequest
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} maxCostPerResponseNanos Threshold to start a survey automically if the quoted prices is less than or equal to this value. See Survey.Cost for more details.
 */
/**
 * @typedef SurveysStartResponse
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {consumersurveys(v2).Survey} resource Survey object containing the specification of the started Survey.
 */
/**
 * @typedef SurveysStopResponse
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {consumersurveys(v2).Survey} resource Survey object containing the specification of the stopped Survey.
 */
/**
 * @typedef TokenPagination
 * @memberOf! consumersurveys(v2)
 * @type object
 * @property {string} nextPageToken 
 * @property {string} previousPageToken 
 */
module.exports = Consumersurveys;
