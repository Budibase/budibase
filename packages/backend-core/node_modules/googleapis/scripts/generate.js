/**
 * Copyright 2014 Google Inc. All Rights Reserved.
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

'use strict';

var Generator = require('../lib/generator');
var rimraf = require('rimraf');
var path = require('path');
var debug = false;

var argv = require('minimist')(process.argv.slice(2));

// constructors
var gen = new Generator({ debug: debug, includePrivate: false });

var args = argv._;

if (args.length) {
  args.forEach(function (url) {
    gen.generateAPI(url, function (err) {
      if (err) {
        throw err;
      }
      console.log('Generated API for ' + url);
    });
  });
} else {
  console.log('Removing old APIs...');
  rimraf(path.join(__dirname, '..', 'apis'), function (err) {
    if (err) {
      throw err;
    }
    console.log('Generating APIs...');
    gen.generateAllAPIs(function (err) {
      if (err) {
        throw err;
      }
      console.log('Finished generating APIs!');
    });
  });
}
