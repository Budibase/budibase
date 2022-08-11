// hostmeta-https-test.js
//
// Test finding hostmeta by https
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
    https = require("https"),
    wf = require("../lib/webfinger"),
    fs = require("fs"),
    path = require("path");

var suite = vows.describe("RFC6415 (host-meta) interface over https with XRD only");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

suite.addBatch({
    "When we run an HTTPS app that just supports host-meta with XRD": {
        topic: function() {
            var app = express(),
                opts,
                callback = this.callback;

            app.get("/.well-known/host-meta", function(req, res) {
                res.status(200);
                res.set("Content-Type", "application/xrd+xml");
                res.end("<?xml version='1.0' encoding='UTF-8'?>\n"+
                        "<XRD xmlns='http://docs.oasis-open.org/ns/xri/xrd-1.0'>\n" +
                        "<Link rel='lrdd' type='application/xrd+xml' template='https://localhost/lrdd?uri={uri}' />"+
                        "</XRD>");
            });

            app.on("error", function(err) {
                callback(err, null);
            });
            
            opts = {key: fs.readFileSync(path.join(__dirname, "data", "localhost.key")),
                    cert: fs.readFileSync(path.join(__dirname, "data", "localhost.crt"))};

            https.createServer(opts, app).listen(443, function() {
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
                assert.equal(jrd.links[0].type, "application/xrd+xml");
                assert.include(jrd.links[0], "template");
                assert.equal(jrd.links[0].template, "https://localhost/lrdd?uri={uri}");
            }
        }
    }
});

suite["export"](module);
