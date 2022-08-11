// module-test.js
//
// Test the module interface
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
    vows = require("vows");

var suite = vows.describe("Webfinger module interface");

suite.addBatch({
    "When we get the app module": {
        topic: function() { 
            return require("../lib/webfinger");
        },
        "there is one": function(mod) {
            assert.isObject(mod);
        },
        "it has the xrd2jrd() export": function(mod) {
            assert.isFunction(mod.xrd2jrd);
        },
        "it has the webfinger() export": function(mod) {
            assert.isFunction(mod.webfinger);
        },
        "it has the hostmeta() export": function(mod) {
            assert.isFunction(mod.hostmeta);
        },
        "it has the discover() export": function(mod) {
            assert.isFunction(mod.discover);
        }
    }
});

suite["export"](module);
