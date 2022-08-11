// webfinger-https-only-for-lrdd-test.js
//
// Test the httpsOnly flag for the webfinger function
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

var suite = vows.describe("webfinger httpsOnly flag disallows redirect to HTTP-only LRDD");

suite.addBatch({
    "When we run an HTTPS app that uses an HTTP app for LRDD": {
        topic: function() {
            var hm = express(),
                lrdd = express(),
                callback = this.callback;

            // parse queries
            hm.use(express.query());

            hm.get("/.well-known/host-meta.json", function(req, res) {
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

            // parse queries
            lrdd.use(express.query());

            lrdd.get("/lrdd.json", function(req, res) {
                var uri = req.query.uri,
                    parts = uri.split("@"),
                    username = parts[0],
                    hostname = parts[1];

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

            lrdd.on("error", function(err) {
                callback(err, null);
            });

            Step(
                function() {
                    var opts = {key: fs.readFileSync(path.join(__dirname, "data", "localhost.key")),
                                cert: fs.readFileSync(path.join(__dirname, "data", "localhost.crt"))};

                    https.createServer(opts, hm).listen(443, this.parallel());
                    lrdd.listen(80, this.parallel());
                },
                function(err) {
                    callback(null, hm, lrdd);
                }
            );
        },
        "it works": function(err, hm, lrdd) {
            assert.ifError(err);
            assert.isFunction(hm);
            assert.isFunction(lrdd);
        },
        teardown: function(hm, lrdd) {
            if (hm && hm.close) {
                hm.close();
            }
            if (lrdd && lrdd.close) {
                lrdd.close();
            }
        },
        "and we get a webfinger with https-only flag set": {
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
