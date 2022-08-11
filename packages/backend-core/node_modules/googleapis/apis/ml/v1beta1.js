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
 * Google Cloud Machine Learning
 *
 * An API to enable creating and using machine learning models.
 *
 * @example
 * var google = require('googleapis');
 * var ml = google.ml('v1beta1');
 *
 * @namespace ml
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Ml
 */
function Ml(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    /**
     * ml.projects.predict
     *
     * @desc Performs prediction on the data in the request.  Responses are very similar to requests. There are two top-level fields, each of which are JSON lists:  <dl>   <dt>predictions</dt>   <dd>The list of predictions, one per instance in the request.</dd>   <dt>error</dt>   <dd>An error message returned instead of a prediction list if any       instance produced an error.</dd> </dl>  If the call is successful, the response body will contain one prediction entry per instance in the request body. If prediction fails for any instance, the response body will contain no predictions and will contian a single error entry instead.  Even though there is one prediction per instance, the format of a prediction is not directly related to the format of an instance. Predictions take whatever format is specified in the outputs collection defined in the model. The collection of predictions is returned in a JSON list. Each member of the list can be a simple value, a list, or a JSON object of any complexity. If your model has more than one output tensor, each prediction will be a JSON object containing a name/value pair for each output. The names identify the output aliases in the graph.  The following examples show some possible responses:  A simple set of predictions for three input instances, where each prediction is an integer value: <pre> {"predictions": [5, 4, 3]} </pre> A more complex set of predictions, each containing two named values that correspond to output tensors, named **label** and **scores** respectively. The value of **label** is the predicted category ("car" or "beach") and **scores** contains a list of probabilities for that instance across the possible categories. <pre> {"predictions": [{"label": "beach", "scores": [0.1, 0.9]},                  {"label": "car", "scores": [0.75, 0.25]}]} </pre> A response when there is an error processing an input instance: <pre> {"error": "Divide by zero"} </pre>
     *
     * @alias ml.projects.predict
     * @memberOf! ml(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name Required. The resource name of a model or a version.  Authorization: requires `Viewer` role on the parent project.
     * @param {ml(v1beta1).GoogleCloudMlV1beta1__PredictRequest} params.resource Request body data
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
          url: 'https://ml.googleapis.com/v1beta1/{name}:predict',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * ml.projects.getConfig
     *
     * @desc Get the service account information associated with your project. You need this information in order to grant the service account persmissions for the Google Cloud Storage location where you put your model training code for training the model with Google Cloud Machine Learning.
     *
     * @alias ml.projects.getConfig
     * @memberOf! ml(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name Required. The project name.  Authorization: requires `Viewer` role on the specified project.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://ml.googleapis.com/v1beta1/{name}:getConfig',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    models: {

      /**
       * ml.projects.models.create
       *
       * @desc Creates a model which will later contain one or more versions.  You must add at least one version before you can request predictions from the model. Add versions by calling [projects.models.versions.create](/ml/reference/rest/v1beta1/projects.models.versions/create).
       *
       * @alias ml.projects.models.create
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.parent Required. The project name.  Authorization: requires `Editor` role on the specified project.
       * @param {ml(v1beta1).GoogleCloudMlV1beta1__Model} params.resource Request body data
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
            url: 'https://ml.googleapis.com/v1beta1/{parent}/models',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.models.get
       *
       * @desc Gets information about a model, including its name, the description (if set), and the default version (if at least one version of the model has been deployed).
       *
       * @alias ml.projects.models.get
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Required. The name of the model.  Authorization: requires `Viewer` role on the parent project.
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
            url: 'https://ml.googleapis.com/v1beta1/{name}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.models.list
       *
       * @desc Lists the models in a project.  Each project can contain multiple models, and each model can have multiple versions.
       *
       * @alias ml.projects.models.list
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The number of models to retrieve per "page" of results. If there are more remaining results than this number, the response message will contain a valid value in the `next_page_token` field.  The default value is 20, and the maximum page size is 100.
       * @param {string} params.parent Required. The name of the project whose models are to be listed.  Authorization: requires `Viewer` role on the specified project.
       * @param {string=} params.pageToken Optional. A page token to request the next page of results.  You get the token from the `next_page_token` field of the response from the previous call.
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
            url: 'https://ml.googleapis.com/v1beta1/{parent}/models',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.models.delete
       *
       * @desc Deletes a model.  You can only delete a model if there are no versions in it. You can delete versions by calling [projects.models.versions.delete](/ml/reference/rest/v1beta1/projects.models.versions/delete).
       *
       * @alias ml.projects.models.delete
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Required. The name of the model.  Authorization: requires `Editor` role on the parent project.
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
            url: 'https://ml.googleapis.com/v1beta1/{name}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      versions: {

        /**
         * ml.projects.models.versions.create
         *
         * @desc Creates a new version of a model from a trained TensorFlow model.  If the version created in the cloud by this call is the first deployed version of the specified model, it will be made the default version of the model. When you add a version to a model that already has one or more versions, the default version does not automatically change. If you want a new version to be the default, you must call [projects.models.versions.setDefault](/ml/reference/rest/v1beta1/projects.models.versions/setDefault).
         *
         * @alias ml.projects.models.versions.create
         * @memberOf! ml(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.parent Required. The name of the model.  Authorization: requires `Editor` role on the parent project.
         * @param {ml(v1beta1).GoogleCloudMlV1beta1__Version} params.resource Request body data
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
              url: 'https://ml.googleapis.com/v1beta1/{parent}/versions',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * ml.projects.models.versions.get
         *
         * @desc Gets information about a model version.  Models can have multiple versions. You can call [projects.models.versions.list](/ml/reference/rest/v1beta1/projects.models.versions/list) to get the same information that this method returns for all of the versions of a model.
         *
         * @alias ml.projects.models.versions.get
         * @memberOf! ml(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. The name of the version.  Authorization: requires `Viewer` role on the parent project.
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
              url: 'https://ml.googleapis.com/v1beta1/{name}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * ml.projects.models.versions.setDefault
         *
         * @desc Designates a version to be the default for the model.  The default version is used for prediction requests made against the model that don't specify a version.  The first version to be created for a model is automatically set as the default. You must make any subsequent changes to the default version setting manually using this method.
         *
         * @alias ml.projects.models.versions.setDefault
         * @memberOf! ml(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. The name of the version to make the default for the model. You can get the names of all the versions of a model by calling [projects.models.versions.list](/ml/reference/rest/v1beta1/projects.models.versions/list).  Authorization: requires `Editor` role on the parent project.
         * @param {ml(v1beta1).GoogleCloudMlV1beta1__SetDefaultVersionRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        setDefault: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://ml.googleapis.com/v1beta1/{name}:setDefault',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * ml.projects.models.versions.list
         *
         * @desc Gets basic information about all the versions of a model.  If you expect that a model has a lot of versions, or if you need to handle only a limited number of results at a time, you can request that the list be retrieved in batches (called pages):
         *
         * @alias ml.projects.models.versions.list
         * @memberOf! ml(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.pageSize Optional. The number of versions to retrieve per "page" of results. If there are more remaining results than this number, the response message will contain a valid value in the `next_page_token` field.  The default value is 20, and the maximum page size is 100.
         * @param {string} params.parent Required. The name of the model for which to list the version.  Authorization: requires `Viewer` role on the parent project.
         * @param {string=} params.pageToken Optional. A page token to request the next page of results.  You get the token from the `next_page_token` field of the response from the previous call.
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
              url: 'https://ml.googleapis.com/v1beta1/{parent}/versions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * ml.projects.models.versions.delete
         *
         * @desc Deletes a model version.  Each model can have multiple versions deployed and in use at any given time. Use this method to remove a single version.  Note: You cannot delete the version that is set as the default version of the model unless it is the only remaining version.
         *
         * @alias ml.projects.models.versions.delete
         * @memberOf! ml(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Required. The name of the version. You can get the names of all the versions of a model by calling [projects.models.versions.list](/ml/reference/rest/v1beta1/projects.models.versions/list).  Authorization: requires `Editor` role on the parent project.
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
              url: 'https://ml.googleapis.com/v1beta1/{name}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    jobs: {

      /**
       * ml.projects.jobs.create
       *
       * @desc Creates a training or a batch prediction job.
       *
       * @alias ml.projects.jobs.create
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.parent Required. The project name.  Authorization: requires `Editor` role on the specified project.
       * @param {ml(v1beta1).GoogleCloudMlV1beta1__Job} params.resource Request body data
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
            url: 'https://ml.googleapis.com/v1beta1/{parent}/jobs',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.jobs.get
       *
       * @desc Describes a job.
       *
       * @alias ml.projects.jobs.get
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Required. The name of the job to get the description of.  Authorization: requires `Viewer` role on the parent project.
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
            url: 'https://ml.googleapis.com/v1beta1/{name}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.jobs.list
       *
       * @desc Lists the jobs in the project.
       *
       * @alias ml.projects.jobs.list
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The number of jobs to retrieve per "page" of results. If there are more remaining results than this number, the response message will contain a valid value in the `next_page_token` field.  The default value is 20, and the maximum page size is 100.
       * @param {string=} params.filter Optional. Specifies the subset of jobs to retrieve.
       * @param {string} params.parent Required. The name of the project for which to list jobs.  Authorization: requires `Viewer` role on the specified project.
       * @param {string=} params.pageToken Optional. A page token to request the next page of results.  You get the token from the `next_page_token` field of the response from the previous call.
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
            url: 'https://ml.googleapis.com/v1beta1/{parent}/jobs',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.jobs.cancel
       *
       * @desc Cancels a running job.
       *
       * @alias ml.projects.jobs.cancel
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Required. The name of the job to cancel.  Authorization: requires `Editor` role on the parent project.
       * @param {ml(v1beta1).GoogleCloudMlV1beta1__CancelJobRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      cancel: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://ml.googleapis.com/v1beta1/{name}:cancel',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    operations: {

      /**
       * ml.projects.operations.get
       *
       * @desc Gets the latest state of a long-running operation.  Clients can use this method to poll the operation result at intervals as recommended by the API service.
       *
       * @alias ml.projects.operations.get
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the operation resource.
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
            url: 'https://ml.googleapis.com/v1beta1/{name}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.operations.list
       *
       * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.  NOTE: the `name` binding below allows API services to override the binding to use different resource name schemes, such as `users/x/operations`.
       *
       * @alias ml.projects.operations.list
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize The standard list page size.
       * @param {string=} params.filter The standard list filter.
       * @param {string} params.name The name of the operation collection.
       * @param {string=} params.pageToken The standard list page token.
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
            url: 'https://ml.googleapis.com/v1beta1/{name}/operations',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.operations.delete
       *
       * @desc Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
       *
       * @alias ml.projects.operations.delete
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the operation resource to be deleted.
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
            url: 'https://ml.googleapis.com/v1beta1/{name}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * ml.projects.operations.cancel
       *
       * @desc Starts asynchronous cancellation on a long-running operation.  The server makes a best effort to cancel the operation, but success is not guaranteed.  If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.  Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
       *
       * @alias ml.projects.operations.cancel
       * @memberOf! ml(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the operation resource to be cancelled.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      cancel: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://ml.googleapis.com/v1beta1/{name}:cancel',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef GoogleCloudMlV1beta1__HyperparameterOutput
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {ml(v1beta1).GoogleCloudMlV1beta1_HyperparameterOutput_HyperparameterMetric} finalMetric The final objective metric seen for this trial.
 * @property {ml(v1beta1).GoogleCloudMlV1beta1_HyperparameterOutput_HyperparameterMetric[]} allMetrics All recorded object metrics for this trial.
 * @property {string} trialId The trial id for these results.
 * @property {object} hyperparameters The hyperparameters given to this trial.
 */
/**
 * @typedef GoogleCloudMlV1beta1__GetConfigResponse
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {string} serviceAccount The service account Cloud ML uses to access resources in the project.
 * @property {string} serviceAccountProject The project number for `service_account`.
 */
/**
 * @typedef GoogleCloudMlV1beta1__ListVersionsResponse
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string} nextPageToken Optional. Pass this token as the `page_token` field of the request for a
subsequent call.
* @property {ml(v1beta1).GoogleCloudMlV1beta1__Version[]} versions The list of versions.
*/
/**
 * @typedef GoogleApi__HttpBody
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {string} data HTTP body binary data.
 * @property {string} contentType The HTTP Content-Type string representing the content type of the body.
 */
/**
 * @typedef GoogleCloudMlV1beta1__Job
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {ml(v1beta1).GoogleCloudMlV1beta1__PredictionInput} predictionInput Input parameters to create a prediction job.
 * @property {string} state Output only. The detailed state of a job.
 * @property {string} endTime Output only. When the job processing was completed.
 * @property {string} createTime Output only. When the job was created.
 * @property {string} errorMessage Output only. The details of a failure or a cancellation.
 * @property {ml(v1beta1).GoogleCloudMlV1beta1__TrainingOutput} trainingOutput The current training job result.
 * @property {string} startTime Output only. When the job processing was started.
 * @property {ml(v1beta1).GoogleCloudMlV1beta1__TrainingInput} trainingInput Input parameters to create a training job.
 * @property {string} jobId Required. The user-specified id of the job.
 * @property {ml(v1beta1).GoogleCloudMlV1beta1__PredictionOutput} predictionOutput The current prediction job result.
 */
/**
 * @typedef GoogleCloudMlV1beta1_HyperparameterOutput_HyperparameterMetric
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {number} objectiveValue The objective value at this training step.
 * @property {string} trainingStep The global training step for this metric.
 */
/**
 * @typedef GoogleLongrunning__Operation
 * @memberOf! ml(v1beta1)
 * @type object
* @property {ml(v1beta1).GoogleRpc__Status} error The error result of the operation in case of failure or cancellation.
* @property {boolean} done If the value is `false`, it means the operation is still in progress.
If true, the operation is completed, and either `error` or `response` is
available.
* @property {object} metadata Service-specific metadata associated with the operation.  It typically
contains progress information and common metadata such as create time.
Some services might not provide such metadata.  Any method that returns a
long-running operation should document the metadata type, if any.
* @property {object} response The normal response of the operation in case of success.  If the original
method returns no data on success, such as `Delete`, the response is
`google.protobuf.Empty`.  If the original method is standard
`Get`/`Create`/`Update`, the response should be the resource.  For other
methods, the response should have the type `XxxResponse`, where `Xxx`
is the original method name.  For example, if the original method name
is `TakeSnapshot()`, the inferred response type is
`TakeSnapshotResponse`.
* @property {string} name The server-assigned name, which is only unique within the same service that
originally returns it. If you use the default HTTP mapping, the
`name` should have the format of `operations/some/unique/name`.
*/
/**
 * @typedef GoogleCloudMlV1beta1__PredictRequest
 * @memberOf! ml(v1beta1)
 * @type object
* @property {ml(v1beta1).GoogleApi__HttpBody} httpBody 
Required. The prediction request body.
*/
/**
 * @typedef GoogleRpc__Status
 * @memberOf! ml(v1beta1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef GoogleCloudMlV1beta1__CancelJobRequest
 * @memberOf! ml(v1beta1)
 * @type object
 */
/**
 * @typedef GoogleCloudMlV1beta1__TrainingOutput
 * @memberOf! ml(v1beta1)
 * @type object
* @property {number} consumedMLUnits The amount of ML units consumed by the job.
* @property {string} completedTrialCount The number of hyperparameter tuning trials that completed successfully.
Only set for hyperparameter tuning jobs.
* @property {boolean} isHyperparameterTuningJob Whether this job is a hyperparameter tuning job.
* @property {ml(v1beta1).GoogleCloudMlV1beta1__HyperparameterOutput[]} trials Results for individual Hyperparameter trials.
Only set for hyperparameter tuning jobs.
*/
/**
 * @typedef GoogleLongrunning__ListOperationsResponse
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {string} nextPageToken The standard List next-page token.
 * @property {ml(v1beta1).GoogleLongrunning__Operation[]} operations A list of operations that matches the specified filter in the request.
 */
/**
 * @typedef GoogleCloudMlV1beta1__PredictionOutput
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {string} errorCount The number of data instances which resulted in errors.
 * @property {number} nodeHours Node hours used by the batch prediction job.
 * @property {string} predictionCount The number of generated predictions.
 * @property {string} outputPath The output Google Cloud Storage location provided at the job creation time.
 */
/**
 * @typedef GoogleCloudMlV1beta1__HyperparameterSpec
 * @memberOf! ml(v1beta1)
 * @type object
* @property {integer} maxParallelTrials Optional. The number of training trials to run concurrently.
You can reduce the time it takes to perform hyperparameter tuning by adding
trials in parallel. However, each trail only benefits from the information
gained in completed trials. That means that a trial does not get access to
the results of trials running at the same time, which could reduce the
quality of the overall optimization.

Each trial will use the same scale tier and machine types.

Defaults to one.
* @property {integer} maxTrials Optional. How many training trials should be attempted to optimize
the specified hyperparameters.

Defaults to one.
* @property {string} goal Required. The type of goal to use for tuning. Available types are
`MAXIMIZE` and `MINIMIZE`.

Defaults to `MAXIMIZE`.
* @property {ml(v1beta1).GoogleCloudMlV1beta1__ParameterSpec[]} params Required. The set of parameters to tune.
*/
/**
 * @typedef GoogleProtobuf__Empty
 * @memberOf! ml(v1beta1)
 * @type object
 */
/**
 * @typedef GoogleCloudMlV1beta1__PredictionInput
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string} modelName Use this field if you want to use the default version for the specified
model. The string must use the following format:

`&quot;projects/&lt;var&gt;[YOUR_PROJECT]&lt;/var&gt;/models/&lt;var&gt;[YOUR_MODEL]&lt;/var&gt;&quot;`
* @property {string} outputPath Required. The output Google Cloud Storage location.
* @property {string[]} inputPaths Required. The Google Cloud Storage location of the input data files.
May contain wildcards.
* @property {string} dataFormat Required. The format of the input data files.
* @property {string} maxWorkerCount Optional. The maximum number of workers to be used for parallel processing.
Defaults to 10 if not specified.
* @property {string} versionName Use this field if you want to specify a version of the model to use. The
string is formatted the same way as `model_version`, with the addition
of the version information:

`&quot;projects/&lt;var&gt;[YOUR_PROJECT]&lt;/var&gt;/models/&lt;var&gt;YOUR_MODEL/versions/&lt;var&gt;[YOUR_VERSION]&lt;/var&gt;&quot;`
* @property {string} region Required. The Google Compute Engine region to run the prediction job in.
*/
/**
 * @typedef GoogleCloudMlV1beta1__ListJobsResponse
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string} nextPageToken Optional. Pass this token as the `page_token` field of the request for a
subsequent call.
* @property {ml(v1beta1).GoogleCloudMlV1beta1__Job[]} jobs The list of jobs.
*/
/**
 * @typedef GoogleCloudMlV1beta1__SetDefaultVersionRequest
 * @memberOf! ml(v1beta1)
 * @type object
 */
/**
 * @typedef GoogleCloudMlV1beta1__TrainingInput
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string[]} args Optional. Command line arguments to pass to the program.
* @property {string} workerType Optional. Specifies the type of virtual machine to use for your training
job&#39;s worker nodes.

The supported values are the same as those described in the entry for
`masterType`.

This value must be present when `scaleTier` is set to `CUSTOM` and
`workerCount` is greater than zero.
* @property {string} workerCount Optional. The number of worker replicas to use for the training job. Each
replica in the cluster will be of the type specified in `worker_type`.

This value can only be used when `scale_tier` is set to `CUSTOM`. If you
set this value, you must also set `worker_type`.
* @property {string[]} packageUris Required. The Google Cloud Storage location of the packages with
the training program and any additional dependencies.
* @property {ml(v1beta1).GoogleCloudMlV1beta1__HyperparameterSpec} hyperparameters Optional. The set of Hyperparameters to tune.
* @property {string} masterType Optional. Specifies the type of virtual machine to use for your training
job&#39;s master worker.

The following types are supported:

&lt;dl&gt;
  &lt;dt&gt;standard&lt;/dt&gt;
  &lt;dd&gt;
  A basic machine configuration suitable for training simple models with
  small to moderate datasets.
  &lt;/dd&gt;
  &lt;dt&gt;large_model&lt;/dt&gt;
  &lt;dd&gt;
  A machine with a lot of memory, specially suited for parameter servers
  when your model is large (having many hidden layers or layers with very
  large numbers of nodes).
  &lt;/dd&gt;
  &lt;dt&gt;complex_model_s&lt;/dt&gt;
  &lt;dd&gt;
  A machine suitable for the master and workers of the cluster when your
  model requires more computation than the standard machine can handle
  satisfactorily.
  &lt;/dd&gt;
  &lt;dt&gt;complex_model_m&lt;/dt&gt;
  &lt;dd&gt;
  A machine with roughly twice the number of cores and roughly double the
  memory of &lt;code suppresswarning=&quot;true&quot;&gt;complex_model_s&lt;/code&gt;.
  &lt;/dd&gt;
  &lt;dt&gt;complex_model_l&lt;/dt&gt;
  &lt;dd&gt;
  A machine with roughly twice the number of cores and roughly double the
  memory of &lt;code suppresswarning=&quot;true&quot;&gt;complex_model_m&lt;/code&gt;.
  &lt;/dd&gt;
&lt;/dl&gt;

You must set this value when `scaleTier` is set to `CUSTOM`.
* @property {string} parameterServerCount Optional. The number of parameter server replicas to use for the training
job. Each replica in the cluster will be of the type specified in
`parameter_server_type`.

This value can only be used when `scale_tier` is set to `CUSTOM`.If you
set this value, you must also set `parameter_server_type`.
* @property {string} region Required. The Google Compute Engine region to run the training job in.
* @property {string} parameterServerType Optional. Specifies the type of virtual machine to use for your training
job&#39;s parameter server.

The supported values are the same as those described in the entry for
`master_type`.

This value must be present when `scaleTier` is set to `CUSTOM` and
`parameter_server_count` is greater than zero.
* @property {string} scaleTier Required. Specifies the machine types, the number of replicas for workers
and parameter servers.
* @property {string} pythonModule Required. The Python module name to run after installing the packages.
*/
/**
 * @typedef GoogleCloudMlV1beta1__Version
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string} description Optional. The description specified for the version when it was created.
* @property {string} deploymentUri Required. The Google Cloud Storage location of the trained model used to
create the version. See the
[overview of model deployment](/ml/docs/concepts/deployment-overview) for
more informaiton.

When passing Version to
[projects.models.versions.create](/ml/reference/rest/v1beta1/projects.models.versions/create)
the model service uses the specified location as the source of the model.
Once deployed, the model version is hosted by the prediction service, so
this location is useful only as a historical record.
* @property {boolean} onlinePredictionLogging Optional. If true, enables StackDriver Logging for online prediction.
Default is false.
* @property {string} createTime Output only. The time the version was created.
* @property {string} lastUseTime Output only. The time the version was last used for prediction.
* @property {string} name Required.The name specified for the version when it was created.

The version name must be unique within the model it is created in.
* @property {boolean} isDefault Output only. If true, this version will be used to handle prediction
requests that do not specify a version.

You can change the default version by calling
[projects.methods.versions.setDefault](/ml/reference/rest/v1beta1/projects.models.versions/setDefault).
*/
/**
 * @typedef GoogleCloudMlV1beta1__ListModelsResponse
 * @memberOf! ml(v1beta1)
 * @type object
* @property {ml(v1beta1).GoogleCloudMlV1beta1__Model[]} models The list of models.
* @property {string} nextPageToken Optional. Pass this token as the `page_token` field of the request for a
subsequent call.
*/
/**
 * @typedef GoogleCloudMlV1beta1__OperationMetadata
 * @memberOf! ml(v1beta1)
 * @type object
 * @property {string} modelName Contains the name of the model associated with the operation.
 * @property {boolean} isCancellationRequested Indicates whether a request to cancel this operation has been made.
 * @property {string} endTime The time operation processing completed.
 * @property {string} createTime The time the operation was submitted.
 * @property {string} startTime The time operation processing started.
 * @property {ml(v1beta1).GoogleCloudMlV1beta1__Version} version Contains the version associated with the operation.
 * @property {string} operationType The operation type.
 */
/**
 * @typedef GoogleCloudMlV1beta1__ParameterSpec
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string} parameterName Required. The parameter name must be unique amongst all ParameterConfigs in
a HyperparameterSpec message. E.g., &quot;learning_rate&quot;.
* @property {number} maxValue Required if typeis `DOUBLE` or `INTEGER`. This field
should be unset if type is `CATEGORICAL`. This value should be integers if
type is `INTEGER`.
* @property {string[]} categoricalValues Required if type is `CATEGORICAL`. The list of possible categories.
* @property {number} minValue Required if type is `DOUBLE` or `INTEGER`. This field
should be unset if type is `CATEGORICAL`. This value should be integers if
type is INTEGER.
* @property {string} scaleType Optional. How the parameter should be scaled to the hypercube.
Leave unset for categorical parameters.
Some kind of scaling is strongly recommended for real or integral
parameters (e.g., `UNIT_LINEAR_SCALE`).
* @property {number[]} discreteValues Required if type is `DISCRETE`.
A list of feasible points.
The list should be in strictly increasing order. For instance, this
parameter might have possible settings of 1.5, 2.5, and 4.0. This list
should not contain more than 1,000 values.
* @property {string} type Required. The type of the parameter.
*/
/**
 * @typedef GoogleCloudMlV1beta1__Model
 * @memberOf! ml(v1beta1)
 * @type object
* @property {string} description Optional. The description specified for the model when it was created.
* @property {ml(v1beta1).GoogleCloudMlV1beta1__Version} defaultVersion Output only. The default version of the model. This version will be used to
handle prediction requests that do not specify a version.

You can change the default version by calling
[projects.methods.versions.setDefault](/ml/reference/rest/v1beta1/projects.models.versions/setDefault).
* @property {string} name Required. The name specified for the model when it was created.

The model name must be unique within the project it is created in.
*/
module.exports = Ml;
