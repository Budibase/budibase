// Copyright 2014-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var utils = require('./utils.js');
var DefaultTransporter = require('./transporters.js');
var stream = require('stream');
var parseString = require('string-template');

function isReadableStream (obj) {
  return obj instanceof stream.Stream &&
    typeof obj._read === 'function' &&
    typeof obj._readableState === 'object';
}

function logError (err) {
  if (err) {
    console.error(err);
  }
}

function createCallback (callback) {
  return typeof callback === 'function' ? callback : logError;
}

function getMissingParams (params, required) {
  var missing = [];

  required.forEach(function (param) {
    // Is the required param in the params object?
    if (!params[param]) {
      missing.push(param);
    }
  });

  // If there are any required params missing, return their names in array, otherwise return null
  return missing.length > 0 ? missing : null;
}

/**
 * Create and send request to Google API
 * @param  {object}   parameters Parameters used to form request
 * @param  {Function} callback   Callback when request finished or error found
 * @return {Request}             Returns Request object or null
 */
function createAPIRequest (parameters, callback) {
  var req, body, missingParams;
  var params = parameters.params;
  var options = utils.extend({}, parameters.options);

  // If the params are not present, and callback was passed instead,
  // use params as the callback and create empty params.
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  // Create a new params object so it can no longer be modified from outside code
  // Also support global and per-client params, but allow them to be overriden per-request
  params = utils.extend(
    {}, // New base object
    parameters.context.google._options.params, // Global params
    parameters.context._options.params, // Per-client params
    params // API call params
  );

  var media = params.media || {};
  var resource = params.resource;
  var authClient = params.auth ||
    parameters.context._options.auth ||
    parameters.context.google._options.auth;

  var defaultMime = typeof media.body === 'string' ? 'text/plain' : 'application/octet-stream';
  delete params.media;
  delete params.resource;
  delete params.auth;

  // Grab headers from user provided options
  var headers = params.headers || {};
  delete params.headers;

  // Un-alias parameters that were modified due to conflicts with reserved names
  Object.keys(params).forEach(function (key) {
    if (key.slice(-1) === '_') {
      var newKey = key.slice(0, -1);
      params[newKey] = params[key];
      delete params[key];
    }
  });

  // Normalize callback
  callback = createCallback(callback);

  // Check for missing required parameters in the API request
  missingParams = getMissingParams(params, parameters.requiredParams);
  if (missingParams) {
    // Some params are missing - stop further operations and inform the developer which required
    // params are not included in the request
    callback(new Error('Missing required parameters: ' + missingParams.join(', ')));

    return null;
  }

  // Parse urls
  if (options.url) {
    options.url = parseString(options.url, params);
  }
  if (parameters.mediaUrl) {
    parameters.mediaUrl = parseString(parameters.mediaUrl, params);
  }

  // delete path parameters from the params object so they do not end up in query
  parameters.pathParams.forEach(function (param) {
    delete params[param];
  });

  // if authClient is actually a string, use it as an API KEY
  if (typeof authClient === 'string') {
    params.key = params.key || authClient;
    authClient = null;
  }

  if (parameters.mediaUrl && media.body) {
    options.url = parameters.mediaUrl;
    if (resource) {
      params.uploadType = 'multipart';
      options.multipart = [
        {
          'Content-Type': 'application/json',
          body: JSON.stringify(resource)
        },
        {
          'Content-Type': media.mimeType || resource && resource.mimeType || defaultMime,
          body: media.body // can be a readable stream or raw string!
        }
      ];
    } else {
      params.uploadType = 'media';
      utils.extend(headers, {
        'Content-Type': media.mimeType || defaultMime
      });

      if (isReadableStream(media.body)) {
        body = media.body;
      } else {
        options.body = media.body;
      }
    }
  } else {
    options.json = resource || (
      (options.method === 'GET' || options.method === 'DELETE') ? true : {}
    );
  }

  options.headers = headers;
  options.qs = params;
  options.useQuerystring = true;

  options = utils.extend({},
    parameters.context.google._options,
    parameters.context._options,
    options
  );
  delete options.auth; // is overridden by our auth code
  delete options.params; // We handle params ourselves and Request does not recognise 'params'

  // create request (using authClient or otherwise and return request obj)
  if (authClient) {
    req = authClient.request(options, callback);
  } else {
    req = new DefaultTransporter().request(options, callback);
  }

  if (body) {
    body.pipe(req);
  }
  return req;
}

/**
 * Exports createAPIRequest
 * @type {Function}
 */
module.exports = createAPIRequest;
