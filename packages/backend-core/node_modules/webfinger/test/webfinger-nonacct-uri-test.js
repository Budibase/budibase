// hostmeta-test.js
//
// Test getting LRDD data for a non-acct URI
//
// Copyright 2013, E14N https://e14n.com/
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
    "When we run an HTTP app that just supports host-meta with XRD": {
        topic: function() {
            var app = express(),
                callback = this.callback;

            // parse queries
            app.use(express.query());

            app.get("/.well-known/host-meta", function(req, res) {
                res.status(200);
                res.set("Content-Type", "application/xrd+xml");
                res.end("<?xml version='1.0' encoding='UTF-8'?>\n"+
                        "<XRD xmlns='http://docs.oasis-open.org/ns/xri/xrd-1.0'>\n" +
                        "<Link rel='lrdd' type='application/xrd+xml' template='http://localhost/lrdd?uri={uri}' />"+
                        "</XRD>");
            });
            app.get("/lrdd", function(req, res) {
                var uri = req.query.uri;

                res.status(200);
                res.set("Content-Type", "application/xrd+xml");
                res.end("<?xml version='1.0' encoding='UTF-8'?>\n"+
                        "<XRD xmlns='http://docs.oasis-open.org/ns/xri/xrd-1.0'>\n" +
                        "<Subject>"+uri+"</Subject>"+
                        "<Link rel='feed' href='"+uri+"/feed' />"+
                        "</XRD>");
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
        "and we get an http URL's metadata": {
            topic: function() {
                wf.webfinger("http://localhost/profile/alice", this.callback);
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
                assert.equal(jrd.links[0].rel, "feed");
                assert.include(jrd.links[0], "href");
                assert.equal(jrd.links[0].href, "http://localhost/profile/alice/feed");
            }
        }
    }
});

suite["export"](module);
