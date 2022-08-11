// hostmeta-404-test.js
//
// Test webfinger when the hostmeta endpoint is missing
//
// Copyright 2012, E14N https://e14n.com/
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

var suite = vows.describe("Test missing hostmeta endpoint");

suite.addBatch({
    "When we run an HTTP app that does not support host-meta": {
        topic: function() {
            var app = express(),
                callback = this.callback;
            app.get("/.well-known/host-meta", function(req, res) {
                res.send(404, 'No such resource');
            });
            app.on("error", function(err) {
                callback(err, null);
            });
            app.listen(80, function() {
                callback(null, app);
            });
        },
        "it works": function(err, app) {
            assert.ifError(err);
        },
        teardown: function(app) {
            if (app && app.close) {
                app.close();
            }
        },
        "and we get its host-meta data": {
            topic: function() {
                var callback = this.callback;
                wf.hostmeta("localhost", function(err, jrd) {
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
    }
});

suite["export"](module);
