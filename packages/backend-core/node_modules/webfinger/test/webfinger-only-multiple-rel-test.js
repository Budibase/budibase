// webfinger-only-multiple-rel-test.js
//
// Test discovery using multiple rel parameters
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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var suite = vows.describe("RFC6415 (host-meta) interface");

suite.addBatch({
    "When we run an HTTPS app that just supports Webfinger": {
        topic: function() {
            var app = express(),
                opts,
                callback = this.callback;

            app.get("/.well-known/webfinger", function(req, res) {
                var uri = req.query.resource,
                    rel = req.query.rel,
                    parts = uri.split("@"),
                    username = parts[0],
                    hostname = parts[1],
                    result = {
                        subject: uri,
                        links: []
                    },
                    type,
                    types;
 
                if (username.substr(0, 5) == "acct:") {
                    username = username.substr(5);
                }

                types = {
                    "profile": function(username) {
                        return "https://localhost/profile/" + username;
                    },
                    "avatar": function(username) {
                        return "https://localhost/avatar/" + username + ".png";
                    },
                    "hub": function() {
                        return "https://localhost/hub";
                    }
                };

                for (type in types) {
                    if (types.hasOwnProperty(type)) {
                        if (!rel || (rel.indexOf && rel.indexOf(type) !== -1) || rel == type) {
                            result.links.push({rel: type,
                                               href: types[type](username)});
                        }
                    }
                }

                res.json(result);
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
        "and we get multiple Webfinger rels": {
            topic: function() {
                wf.webfinger("alice@localhost", ["profile", "avatar"], this.callback);
            },
            "it works": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
            },
            "it has the links": function(err, jrd) {
                var profiles, avatars;
                assert.ifError(err);
                assert.isObject(jrd);
                assert.include(jrd, "links");
                assert.isArray(jrd.links);
                assert.lengthOf(jrd.links, 2);

                profiles = jrd.links.filter(function(item) { return item.rel == "profile"; });

                assert.lengthOf(profiles, 1);
                assert.isObject(profiles[0]);
                assert.include(profiles[0], "rel");
                assert.equal(profiles[0].rel, "profile");
                assert.include(profiles[0], "href");
                assert.equal(profiles[0].href, "https://localhost/profile/alice");

                avatars = jrd.links.filter(function(item) { return item.rel == "avatar"; });

                assert.lengthOf(avatars, 1);
                assert.isObject(avatars[0]);
                assert.include(avatars[0], "rel");
                assert.equal(avatars[0].rel, "avatar");
                assert.include(avatars[0], "href");
                assert.equal(avatars[0].href, "https://localhost/avatar/alice.png");
            }
        }
    }
});

suite["export"](module);
