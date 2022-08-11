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

var generatorUtils = require('./generator_utils');
var DefaultTransporter = generatorUtils.DefaultTransporter;
var buildurl = generatorUtils.buildurl;
var handleError = generatorUtils.handleError;
var async = require('async');
var swig = require('swig');
var beautify = require('js-beautify').js_beautify;
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var url = require('url');
var argv = require('minimist')(process.argv.slice(2));
var args = argv._;

var DISCOVERY_URL = argv['discovery-url'] ? argv['discovery-url'] : (
  args.length ? args[0] : 'https://www.googleapis.com/discovery/v1/apis/'
);
var FRAGMENT_URL = 'https://storage.googleapis.com/apisnippets-staging/public/';

var API_TEMPLATE = './templates/api-endpoint.js';
var BEAUTIFY_OPTIONS = {
  'indent_size': 2,
  'indent_char': ' ',
  'eol': '\n',
  'indent_level': 0,
  'indent_with_tabs': false,
  'preserve_newlines': true,
  'max_preserve_newlines': 2,
  'jslint_happy': false,
  'space_after_anon_function': true,
  'brace_style': 'collapse',
  'keep_array_indentation': false,
  'keep_function_indentation': true,
  'space_before_conditional': true,
  'break_chained_methods': false,
  'eval_code': false,
  'unescape_strings': false,
  'wrap_line_length': 0,
  'wrap_attributes': 'auto',
  'wrap_attributes_indent_size': 4,
  'end_with_newline': true
};
var RESERVED_PARAMS = ['resource', 'media', 'auth'];
var templateContents = fs.readFileSync(API_TEMPLATE, { encoding: 'utf8' });
var transporter = new DefaultTransporter();

/**
 * A multi-line string is turned into one line.
 *
 * @private
 * @param  {string} str String to process
 * @return {string}     Single line string processed
 */
function oneLine (str) {
  return str.replace(/\n/g, ' ');
}

/**
 * Clean a string of comment tags.
 *
 * @private
 * @param  {string} str String to process
 * @return {string}     Single line string processed
 */
function cleanComments (str) {
  // Convert /* into /x and */ into x/
  return str.replace(/\*\//g, 'x/').replace(/\/\*/g, '/x');
}

/**
 * Returns the list of names of APIS
 *
 * @private
 * @param  {object} items Object of api endpoints
 * @return {array}        Array of api names
 */
function getAPIs (items) {
  var apis = [];
  for (var i in items) {
    apis.push(items[i].name);
  }
  return apis;
}

function getPathParams (params) {
  var pathParams = [];
  if (typeof params !== 'object') {
    params = {};
  }
  Object.keys(params).forEach(function (key) {
    if (params[key].location === 'path') {
      pathParams.push(key);
    }
  });
  return pathParams;
}

function getSafeParamName (param) {
  if (RESERVED_PARAMS.indexOf(param) !== -1) {
    return param + '_';
  }
  return param;
}

/**
 * Disable auto-escaping its output
 * @type {Boolean}
 */
swig.setFilter('buildurl', buildurl);
swig.setFilter('getAPIs', getAPIs);
swig.setFilter('oneLine', oneLine);
swig.setFilter('cleanComments', cleanComments);
swig.setFilter('getPathParams', getPathParams);
swig.setFilter('getSafeParamName', getSafeParamName);
swig.setFilter('cleanPaths', function (str) {
  return str.replace(/\/\*\//gi, '/x/').replace(/\/\*`/gi, '/x');
});
swig.setDefaults({ loader: swig.loaders.fs(path.join(__dirname, '..', 'templates')) });

/**
 * Generator for generating API endpoints
 *
 * @private
 * @param {object} options Options for generation
 * @this {Generator}
 */
function Generator (options) {
  this.options = options || {};
}

/**
 * Log output of generator
 * Works just like console.log
 */
Generator.prototype.log = function () {
  if (this.options && this.options.debug) {
    console.log.apply(this, arguments);
  }
};

/**
 * Generate all APIs and write to files.
 *
 * @param {function} callback Callback when all APIs have been generated
 * @throws {Error} If there is an error generating any of the APIs
 */
Generator.prototype.generateAllAPIs = function (callback) {
  var self = this;
  var headers = this.options.includePrivate ? {} : { 'X-User-Ip': '0.0.0.0' };
  transporter.request({
    uri: DISCOVERY_URL,
    headers: headers
  }, function (err, resp) {
    if (err) {
      return handleError(err, callback);
    }
    var apis = resp.items;

    var queue = async.queue(function (api, next) {
      self.log('Generating API for %s...', api.id);
      self.generateAPI(api.discoveryRestUrl, function (err, filename) {
        if (err) {
          // Try again
          self.generateAPI(api.discoveryRestUrl, next);
        } else {
          next(err, filename);
        }
      });
    }, 10);

    apis.forEach(function (api) {
      queue.push(api);
    });

    queue.drain = callback;
  });
};

function getFragmentsForSchema (schema, path, tasks) {
  if (schema.methods) {
    for (var methodName in schema.methods) {
      var methodSchema = schema.methods[methodName];
      methodSchema.sampleUrl = path + '.' + methodName + '.frag.json';
      (function (schema) {
        tasks.push(function (cb) {
          transporter.request({
            uri: schema.sampleUrl
          }, function (err, response) {
            if (err) {
              return cb(err);
            }
            if (response && response.codeFragment && response.codeFragment['Node.js']) {
              var fragment = response.codeFragment['Node.js'].fragment;
              fragment = fragment.replace(/\/\*/gi, '/<');
              fragment = fragment.replace(/\*\//gi, '>/');
              fragment = fragment.replace(/`\*/gi, '`<');
              fragment = fragment.replace(/\*`/gi, '>`');
              var lines = fragment.split('\n');
              lines.forEach(function (_line, i) {
                if (_line) {
                  lines[i] = '* ' + lines[i];
                } else {
                  lines[i] = '*';
                }
              });
              fragment = lines.join('\n');
              schema.fragment = fragment;
            }
            cb();
          });
        });
      })(methodSchema);
    }
  }
  if (schema.resources) {
    for (var resourceName in schema.resources) {
      getFragmentsForSchema(
        schema.resources[resourceName],
        path + '.' + resourceName,
        tasks
      );
    }
  }
}

/**
 * Generate API file given discovery URL
 * @param  {String} apiDiscoveryUrl URL or filename of discovery doc for API
 * @param {function} callback Callback when successful write of API
 * @throws {Error} If there is an error generating the API.
 */
Generator.prototype.generateAPI = function (apiDiscoveryUrl, callback) {
  function _generate (err, resp) {
    if (err) {
      handleError(err, callback);
      return;
    }
    var tasks = [];
    getFragmentsForSchema(
      resp,
      FRAGMENT_URL + resp.name + '/' + resp.version + '/0/' + resp.name,
      tasks
    );

    // e.g. apis/drive/v2.js
    var exportFilename = path.join(__dirname, '../apis', resp.name, resp.version + '.js');
    var contents;

    async.waterfall([
      function (cb) {
        async.parallel(tasks, cb);
      },
      function (results, cb) {
        var result = swig.render(templateContents, { locals: resp });
        contents = beautify(result, BEAUTIFY_OPTIONS);

        mkdirp(path.dirname(exportFilename), cb);
      },
      function (dir, cb) {
        fs.writeFile(exportFilename, contents, { encoding: 'utf8' }, cb);
      }
    ], function (err) {
      if (err) {
        handleError(err, callback);
        return;
      }
      callback(null, exportFilename);
    });
  }

  var parts = url.parse(apiDiscoveryUrl);

  if (apiDiscoveryUrl && !parts.protocol) {
    this.log('Reading from file ' + apiDiscoveryUrl);
    try {
      return _generate(null, JSON.parse(fs.readFileSync(apiDiscoveryUrl, {
        encoding: 'utf-8'
      })));
    } catch (err) {
      return handleError(err, callback);
    }
  } else {
    this.log('Requesting ' + apiDiscoveryUrl);
    transporter.request({
      uri: apiDiscoveryUrl
    }, _generate);
  }
};

/**
 * Export the Generator object
 * @type {Generator}
 */
module.exports = Generator;
