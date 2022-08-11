// webfinger-https-no-redirect-test.js
//
// Test that requests for Webfinger won't redirect to HTTP for redirect
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
    assert = require("assert"),
    vows = require("vows"),
    express = require("express"),
    https = require("https"),
    wf = require("../lib/webfinger"),
    fs = require("fs"),
    path = require("path");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var suite = vows.describe("Webfinger should not redirect to HTTP");

suite.addBatch({
    "When we run an HTTPS app that redirects to HTTP for Webfinger": {
        topic: function() {
            var app = express(),
                sapp = express(),
                opts,
                callback = this.callback;

            // Secure app redirects to insecure

            sapp.get("/.well-known/webfinger", function(req, res) {
                var host = req.header('Host');
                res.redirect(303, 'http://'+host+req.url);
            });

            app.get("/.well-known/webfinger", function(req, res) {
                var uri = req.query.resource,
                    parts = uri.split("@"),
                    username = parts[0],
                    hostname = parts[1];

                res.json({
                    subject: uri,
                    links: [
                        {
                            rel: "profile",
                            href: "https://localhost/profile/" + username
                        }
                    ]
                });
            });

            app.on("error", function(err) {
                callback(err, null);
            });

            opts = {key: fs.readFileSync(path.join(__dirname, "data", "localhost.key")),
                    cert: fs.readFileSync(path.join(__dirname, "data", "localhost.crt"))};
            
            Step(
                function() {
                    https.createServer(opts, sapp).listen(443, this.parallel());
                    app.listen(80, this.parallel());
                },
                function(err) {
                    callback(null, app, sapp);
                }
            );
        },
        "it works": function(err, app, sapp) {
            assert.ifError(err);
            assert.isFunction(app);
            assert.isFunction(sapp);
        },
        teardown: function(app, sapp) {
            if (app && app.close) {
                app.close();
            }
            if (sapp && sapp.close) {
                sapp.close();
            }
        },
        "and we get a Webfinger": {
            topic: function() {
                var callback = this.callback;
                wf.webfinger("alice@localhost", function(err, jrd) {
                    if (err) {
                        callback(null);
                    } else {
                        callback(new Error("Unexpected success"));
                    }
                });
            },
            "it fails correctly": function(err) {
                assert.ifError(err);
            }
        }
    }
});

suite["export"](module);
