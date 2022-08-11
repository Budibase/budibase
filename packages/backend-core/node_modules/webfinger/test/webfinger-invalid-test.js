// webfinger-invalid-test.js
//
// Test webfinger when the domain is invalid
//
// Copyright 2012-2013 E14N https://e14n.com/
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

var suite = vows.describe("Test webfinger for bad domain");

var badDomain = function(domain) {
    return {
        topic: function() {
            var callback = this.callback;
            wf.webfinger("user@"+domain, function(err, jrd) {
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
    };
};

suite.addBatch({
    "When we get webfinger data for a user in a .invalid domain": badDomain("webfinger.invalid"),
    "When we get webfinger data for a user in a .example domain": badDomain("webfinger.example"),
    "When we get webfinger data for a user in example.com": badDomain("example.com"),
    "When we get webfinger data for a user in example.org": badDomain("example.org"),
    "When we get webfinger data for a user in example.net": badDomain("example.net")
});

suite["export"](module);
