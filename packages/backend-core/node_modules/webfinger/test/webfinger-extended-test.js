// webfinger-extended-test.js
//
// Test extended properties in XRD output
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
                var uri = req.query.uri,
                    parts = uri.split("@"),
                    username = parts[0],
                    hostname = parts[1];

                if (username.substr(0, 5) == "acct:") {
                    username = username.substr(5);
                }

                res.status(200);
                res.set("Content-Type", "application/xrd+xml");
                res.end("<?xml version='1.0' encoding='UTF-8'?>\n"+
                        "<XRD xmlns='http://docs.oasis-open.org/ns/xri/xrd-1.0'>\n" +
                        "<Subject>"+uri+"</Subject>\n"+
                        "<Alias>http://localhost/profile/"+username+"</Alias>\n"+
                        "<Alias>http://localhost/user/1</Alias>\n"+
                        "<Link rel='profile' href='http://localhost/profile/"+username+"' />\n"+
                        "<Link rel='http://apinamespace.org/atom' type='application/atomsvc+xml'"+
                        "href='http://localhost/app/"+username+".atom'>"+
                         "<Property type='http://apinamespace.org/atom/username'>"+username+"</Property></Link>"+
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
        "and we get a webfinger's metadata": {
            topic: function() {
                wf.webfinger("alice@localhost", this.callback);
            },
            "it works": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
            },
            "it has the links": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
                assert.include(jrd, "links");
                assert.isArray(jrd.links);
                assert.lengthOf(jrd.links, 2);
                assert.isObject(jrd.links[0]);
                assert.include(jrd.links[0], "rel");
                assert.equal(jrd.links[0].rel, "profile");
                assert.include(jrd.links[0], "href");
                assert.equal(jrd.links[0].href, "http://localhost/profile/alice");
                assert.isObject(jrd.links[1]);
                assert.include(jrd.links[1], "rel");
                assert.equal(jrd.links[1].rel, "http://apinamespace.org/atom");
                assert.include(jrd.links[1], "type");
                assert.equal(jrd.links[1].type, "application/atomsvc+xml");
                assert.include(jrd.links[1], "href");
                assert.equal(jrd.links[1].href, "http://localhost/app/alice.atom");
                assert.include(jrd.links[1], "properties");
                assert.isObject(jrd.links[1].properties);
                assert.include(jrd.links[1].properties, "http://apinamespace.org/atom/username");
                assert.equal(jrd.links[1].properties["http://apinamespace.org/atom/username"], "alice");
            },
            "it has the subject": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
                assert.include(jrd, "subject");
                assert.isString(jrd.subject);
                assert.equal(jrd.subject, "acct:alice@localhost");
            },
            "it has the alias": function(err, jrd) {
                assert.ifError(err);
                assert.isObject(jrd);
                assert.include(jrd, "aliases");
                assert.isArray(jrd.aliases);
                assert.lengthOf(jrd.aliases, 2);
                assert.isString(jrd.aliases[0]);
                assert.equal(jrd.aliases[0], "http://localhost/profile/alice");
                assert.isString(jrd.aliases[1]);
                assert.equal(jrd.aliases[1], "http://localhost/user/1");
            }
        }
    }
});

suite["export"](module);
