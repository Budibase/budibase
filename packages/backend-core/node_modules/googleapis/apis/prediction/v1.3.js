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
 * Prediction API
 *
 * Lets you access a cloud hosted machine learning service that makes it easy to build smart apps
 *
 * @example
 * var google = require('googleapis');
 * var prediction = google.prediction('v1.3');
 *
 * @namespace prediction
 * @type {Function}
 * @version v1.3
 * @variation v1.3
 * @param {object=} options Options for Prediction
 */
function Prediction(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.hostedmodels = {

    /**
     * prediction.hostedmodels.predict
     *
     * @desc Submit input and request an output against a hosted model
     *
     * @alias prediction.hostedmodels.predict
     * @memberOf! prediction(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.hostedModelName The name of a hosted model
     * @param {prediction(v1.3).Input} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    predict: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/prediction/v1.3/hostedmodels/{hostedModelName}/predict',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['hostedModelName'],
        pathParams: ['hostedModelName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.training = {

    /**
     * prediction.training.delete
     *
     * @desc Delete a trained model
     *
     * @alias prediction.training.delete
     * @memberOf! prediction(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.data mybucket/mydata resource in Google Storage
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
          url: 'https://www.googleapis.com/prediction/v1.3/training/{data}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['data'],
        pathParams: ['data'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.training.get
     *
     * @desc Check training status of your model
     *
     * @alias prediction.training.get
     * @memberOf! prediction(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.data mybucket/mydata resource in Google Storage
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
          url: 'https://www.googleapis.com/prediction/v1.3/training/{data}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['data'],
        pathParams: ['data'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.training.insert
     *
     * @desc Begin training your model
     *
     * @alias prediction.training.insert
     * @memberOf! prediction(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {prediction(v1.3).Training} params.resource Request body data
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
          url: 'https://www.googleapis.com/prediction/v1.3/training',
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
     * prediction.training.predict
     *
     * @desc Submit data and request a prediction
     *
     * @alias prediction.training.predict
     * @memberOf! prediction(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.data mybucket/mydata resource in Google Storage
     * @param {prediction(v1.3).Input} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    predict: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/prediction/v1.3/training/{data}/predict',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['data'],
        pathParams: ['data'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.training.update
     *
     * @desc Add new data to a trained model
     *
     * @alias prediction.training.update
     * @memberOf! prediction(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.data mybucket/mydata resource in Google Storage
     * @param {prediction(v1.3).Update} params.resource Request body data
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
          url: 'https://www.googleapis.com/prediction/v1.3/training/{data}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['data'],
        pathParams: ['data'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Input
 * @memberOf! prediction(v1.3)
 * @type object
 * @property {object} input Input to the model for a prediction
 */
/**
 * @typedef Output
 * @memberOf! prediction(v1.3)
 * @type object
 * @property {string} id The unique name for the predictive model.
 * @property {string} kind What kind of resource this is.
 * @property {string} outputLabel The most likely class [Categorical models only].
 * @property {object[]} outputMulti A list of classes with their estimated probabilities [Categorical models only].
 * @property {number} outputValue The estimated regression value [Regression models only].
 * @property {string} selfLink A URL to re-request this resource.
 */
/**
 * @typedef Training
 * @memberOf! prediction(v1.3)
 * @type object
 * @property {string} id The unique name for the predictive model.
 * @property {string} kind What kind of resource this is.
 * @property {object} modelInfo Model metadata.
 * @property {string} selfLink A URL to re-request this resource.
 * @property {string} trainingStatus The current status of the training job. This can be one of following: RUNNING; DONE; ERROR; ERROR: TRAINING JOB NOT FOUND
 * @property {object[]} utility A class weighting function, which allows the importance weights for classes to be specified [Categorical models only].
 */
/**
 * @typedef Update
 * @memberOf! prediction(v1.3)
 * @type object
 * @property {string} classLabel The true class label of this instance
 * @property {any[]} csvInstance The input features for this instance
 */
module.exports = Prediction;
