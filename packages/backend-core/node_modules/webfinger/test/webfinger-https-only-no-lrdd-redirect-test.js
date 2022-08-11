// webfinger-https-only-no-hostmeta-redirect-test.js
//
// Test that when httpsOnly is set, we don't follow redirects in the hostmeta endpoint
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

var Step = require("step"),
    fs = require("fs"),
    path = require("path"),
    https = require("https"),
    assert = require("assert"),
    vows = require("vows"),
    express = require("express"),
    wf = require("../lib/webfinger");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var suite = vows.describe("lrdd shouldn't redirect to http if https-only flag set");

suite.addBatch({
    "When we run an HTTPS app that redirects to an HTTP app for hostmeta": {
        topic: function() {
            var hm = express(),
                hm2 = express(),
                callback = this.callback;

            // parse queries
            hm.use(express.query());

            // secure host-meta uses secure lrdd

            hm.get("/.well-known/host-meta.json", function(req, res) {
                res.json({
                    links: [
                        {
                            rel: "lrdd",
                            type: "application/json",
                            template: "https://localhost/lrdd.json?uri={uri}"
                        }
                    ]
                });
            });

            hm.get("/lrdd.json", function(req, res) {
                var host = req.header('Host');
                res.redirect(303, 'http://'+host+req.url);
            });

            // secure lrdd redirects to insecure lrdd

            // parse queries

            hm2.use(express.query());

            hm2.get("/lrdd.json", function(req, res) {
                var uri = req.query.uri,
                    parts = uri.split("@"),
                    username = parts[0],
                    hostname = parts[1];

                if (username.substr(0, 5) == "acct:") {
                    username = username.substr(5);
                }

                res.json({
                    links: [
                        {
                            rel: "profile",
                            href: "http://localhost/profile/" + username
                        }
                    ]
                });
            });

            hm.on("error", function(err) {
                callback(err, null);
            });

            hm2.on("error", function(err) {
                callback(err, null);
            });

            Step(
                function() {
                    var opts = {key: fs.readFileSync(path.join(__dirname, "data", "localhost.key")),
                                cert: fs.readFileSync(path.join(__dirname, "data", "localhost.crt"))};

                    https.createServer(opts, hm).listen(443, this.parallel());
                    hm2.listen(80, this.parallel());
                },
                function(err) {
                    callback(null, hm, hm2);
                }
            );
        },
        "it works": function(err, hm, hm2) {
            assert.ifError(err);
            assert.isFunction(hm);
            assert.isFunction(hm2);
        },
        teardown: function(hm, hm2) {
            if (hm && hm.close) {
                hm.close();
            }
            if (hm2 && hm2.close) {
                hm2.close();
            }
        },
        "and we get webfinger data with httpsOnly flag set": {
            topic: function() {
                var callback = this.callback;
                wf.webfinger("alice@localhost", null, {httpsOnly: true}, function(err, jrd) {
                    if (err) {
                        callback(null);
                    } else {
                        callback(new Error("Unexpected success"));
                    }
                });
            },
            "it fails correctly": function(err, jrd) {
                assert.ifError(err);
            }
        }
    }
});

suite["export"](module);
