// hostmeta-test.js
//
// Test the module interface
//
// Copyright 2012, E14N https://e14n/
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var assert = require("assert"),
    vows = require("vows"),
    express = require("express"),
    wf = require("../lib/webfinger");

var suite = vows.describe("Test hostmeta for bad domain");

suite.addBatch({
    "When we get host-meta data for a non-existent domain": {
        topic: function() {
            var callback = this.callback;
            wf.hostmeta("non-existent.invalid", function(err, jrd) {
                if (err) {
                    callback(null);
                } else {
                    callback(new Error("Unexpected success!"));
                }
            });
        },
        "it works": function(err, jrd) {
            assert.ifError(err);
        }
    }
});

suite["export"](module);
