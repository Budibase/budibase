// hostmeta-json-test.js
//
// Test host-meta.json support 
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

var suite = vows.describe("RFC6415 (host-meta) interface");

suite.addBatch({
    "When we run an HTTP app that just supports host-meta with JRD": {
        topic: function() {
            var app = express(),
                callback = this.callback;
            app.get("/.well-known/host-meta.json", function(req, res) {
                res.json({
                    links: [
                        {
                            rel: "lrdd",
                            type: "application/json",
                            template: "http://localhost/lrdd.json?uri={uri}"
                        }
                    ]
                });
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
                wf.hostmeta("localhost", this.callback);
            },
            "it works": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
            },
            "it has the link": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
                assert.include(jrd, "links");
                assert.isArray(jrd.links);
                assert.lengthOf(jrd.links, 1);
                assert.isObject(jrd.links[0]);
                assert.include(jrd.links[0], "rel");
                assert.equal(jrd.links[0].rel, "lrdd");
                assert.include(jrd.links[0], "type");
                assert.equal(jrd.links[0].type, "application/json");
                assert.include(jrd.links[0], "template");
                assert.equal(jrd.links[0].template, "http://localhost/lrdd.json?uri={uri}");
            }
        }
    }
});

suite["export"](module);
