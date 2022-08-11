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
 * var prediction = google.prediction('v1.5');
 *
 * @namespace prediction
 * @type {Function}
 * @version v1.5
 * @variation v1.5
 * @param {object=} options Options for Prediction
 */
function Prediction(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.hostedmodels = {

    /**
     * prediction.hostedmodels.predict
     *
     * @desc Submit input and request an output against a hosted model.
     *
     * @alias prediction.hostedmodels.predict
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.hostedModelName The name of a hosted model.
     * @param {prediction(v1.5).Input} params.resource Request body data
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
          url: 'https://www.googleapis.com/prediction/v1.5/hostedmodels/{hostedModelName}/predict',
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

  self.trainedmodels = {

    /**
     * prediction.trainedmodels.analyze
     *
     * @desc Get analysis of the model and the data the model was trained on.
     *
     * @alias prediction.trainedmodels.analyze
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The unique name for the predictive model.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    analyze: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels/{id}/analyze',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.trainedmodels.delete
     *
     * @desc Delete a trained model.
     *
     * @alias prediction.trainedmodels.delete
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The unique name for the predictive model.
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
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.trainedmodels.get
     *
     * @desc Check training status of your model.
     *
     * @alias prediction.trainedmodels.get
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The unique name for the predictive model.
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
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.trainedmodels.insert
     *
     * @desc Begin training your model.
     *
     * @alias prediction.trainedmodels.insert
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {prediction(v1.5).Training} params.resource Request body data
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
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels',
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
     * prediction.trainedmodels.list
     *
     * @desc List available models.
     *
     * @alias prediction.trainedmodels.list
     * @memberOf! prediction(v1.5)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken Pagination token
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
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels/list',
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
     * prediction.trainedmodels.predict
     *
     * @desc Submit model id and request a prediction.
     *
     * @alias prediction.trainedmodels.predict
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The unique name for the predictive model.
     * @param {prediction(v1.5).Input} params.resource Request body data
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
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels/{id}/predict',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * prediction.trainedmodels.update
     *
     * @desc Add new data to a trained model.
     *
     * @alias prediction.trainedmodels.update
     * @memberOf! prediction(v1.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The unique name for the predictive model.
     * @param {prediction(v1.5).Update} params.resource Request body data
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
          url: 'https://www.googleapis.com/prediction/v1.5/trainedmodels/{id}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Analyze
 * @memberOf! prediction(v1.5)
 * @type object
 * @property {object} dataDescription Description of the data the model was trained on.
 * @property {object[]} errors List of errors with the data.
 * @property {string} id The unique name for the predictive model.
 * @property {string} kind What kind of resource this is.
 * @property {object} modelDescription Description of the model.
 * @property {string} selfLink A URL to re-request this resource.
 */
/**
 * @typedef Input
 * @memberOf! prediction(v1.5)
 * @type object
 * @property {object} input Input to the model for a prediction
 */
/**
 * @typedef List
 * @memberOf! prediction(v1.5)
 * @type object
 * @property {prediction(v1.5).Training[]} items List of models.
 * @property {string} kind What kind of resource this is.
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 * @property {string} selfLink A URL to re-request this resource.
 */
/**
 * @typedef Output
 * @memberOf! prediction(v1.5)
 * @type object
 * @property {string} id The unique name for the predictive model.
 * @property {string} kind What kind of resource this is.
 * @property {string} outputLabel The most likely class label [Categorical models only].
 * @property {object[]} outputMulti A list of class labels with their estimated probabilities [Categorical models only].
 * @property {number} outputValue The estimated regression value [Regression models only].
 * @property {string} selfLink A URL to re-request this resource.
 */
/**
 * @typedef Training
 * @memberOf! prediction(v1.5)
 * @type object
 * @property {string} created Insert time of the model (as a RFC 3339 timestamp).
 * @property {string} id The unique name for the predictive model.
 * @property {string} kind What kind of resource this is.
 * @property {object} modelInfo Model metadata.
 * @property {string} modelType Type of predictive model (classification or regression)
 * @property {string} selfLink A URL to re-request this resource.
 * @property {string} storageDataLocation Google storage location of the training data file.
 * @property {string} storagePMMLLocation Google storage location of the preprocessing pmml file.
 * @property {string} storagePMMLModelLocation Google storage location of the pmml model file.
 * @property {string} trainingComplete Training completion time (as a RFC 3339 timestamp).
 * @property {object[]} trainingInstances Instances to train model on.
 * @property {string} trainingStatus The current status of the training job. This can be one of following: RUNNING; DONE; ERROR; ERROR: TRAINING JOB NOT FOUND
 * @property {object[]} utility A class weighting function, which allows the importance weights for class labels to be specified [Categorical models only].
 */
/**
 * @typedef Update
 * @memberOf! prediction(v1.5)
 * @type object
 * @property {any[]} csvInstance The input features for this instance
 * @property {string} label The class label of this instance
 * @property {string} output The generic output value - could be regression value or class label
 */
module.exports = Prediction;
