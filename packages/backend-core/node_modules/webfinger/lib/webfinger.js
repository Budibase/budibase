// index.js
//
// main module for Webfinger
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
    dns = require("dns"),
    http = require("http"),
    https = require("https"),
    xml2js = require("xml2js"),
    url = require("url"),
    querystring = require("querystring");

var JSONTYPE = "application/json",
    XRDTYPE = "application/xrd+xml";

var xrd2jrd = function(str, callback) {
    var 
    getProperty = function(obj, Property) {
        var k, v;
        if (Property.hasOwnProperty("@")) {

            if (Property["@"].hasOwnProperty("type")) {
                k = Property["@"]["type"];
            }

            if (Property["@"].hasOwnProperty("xsi:nil") && Property["@"]["xsi:nil"] == "true") {
                obj[k] = null;
            } else if (Property.hasOwnProperty("#")) {
                obj[k] = Property["#"];
            } else {
                // TODO: log this
            }
        }
    },
    getTitle = function(obj, Title) {
        var k = "default";
        if (typeof(Title) == "string") {
            obj[k] = Title;
        } else {
            if (Title.hasOwnProperty("@")) {
                if (Title["@"].hasOwnProperty("xml:lang")) {
                    k = Title["@"]["xml:lang"];
                }
            }
            if (Title.hasOwnProperty("#")) {
                obj[k] = Title["#"];
            }
        }
    },
    getLink = function(Link) {
        var prop, i, l, k, v, Property, Title;
        l = {};
        if (Link.hasOwnProperty("@")) {
            for (prop in Link["@"]) {
                if (Link["@"].hasOwnProperty(prop)) {
                    l[prop] = Link["@"][prop];
                }
            }
        }
        if (Link.hasOwnProperty("Property")) { // groan
            l.properties = {};
            if (Array.isArray(Link.Property)) {
                for (i = 0; i < Link.Property.length; i++) {
                    getProperty(l.properties, Link.Property[i]);
                }
            } else {
                getProperty(l.properties, Link.Property);
            }
        }
        if (Link.hasOwnProperty("Title")) { 
            l.titles = {};
            if (Array.isArray(Link.Title)) {
                for (i = 0; i < Link.Title.length; i++) {
                    getTitle(l.titles, Link.Title[i]);
                }
            } else {
                getTitle(l.titles, Link.Title);
            }
        }
        return l;
    };
    Step(
        function() {
            var parser = new xml2js.Parser();
            parser.parseString(str, this);
        },
        function(err, doc) {
            var Link, jrd = {}, i, prop, l;
            if (err) {
                callback(err, null);
            } else {
                // XXX: Booooooo! This is bletcherous.
                if (doc.hasOwnProperty("Subject")) {
                    if (Array.isArray(doc.Subject)) {
                        jrd.subject = doc.Subject[0];
                    } else {
                        jrd.subject = doc.Subject;
                    }
                }
                if (doc.hasOwnProperty("Expires")) {
                    if (Array.isArray(doc.Expires)) {
                        jrd.expires = doc.Expires[0];
                    } else {
                        jrd.expires = doc.Expires;
                    }
                }
                if (doc.hasOwnProperty("Alias")) {
                    if (Array.isArray(doc.Alias)) {
                        jrd.aliases = doc.Alias;
                    } else {
                        jrd.aliases = [doc.Alias];
                    }
                }
                if (doc.hasOwnProperty("Property")) {
                    jrd.properties = {};
                    if (Array.isArray(doc.Property)) {
                        for (i = 0; i < doc.Property.length; i++) {
                            getProperty(jrd.properties, doc.Property[i]);
                        }
                    } else {
                        getProperty(jrd.properties, doc.Property);
                    }
                }
                if (doc.hasOwnProperty("Link")) {
                    Link = doc.Link;
                    jrd.links = [];
                    if (Array.isArray(Link)) {
                        for (i = 0; i < Link.length; i++) {
                            jrd.links.push(getLink(Link[i]));
                        }
                    } else {
                        jrd.links.push(getLink(Link));
                    }
                }
                callback(null, jrd);
            }
        }
    );
};

var jrd = function(body, callback) {
    var result;
    try {
        result = JSON.parse(body);
        callback(null, result);
    } catch (err) {
        callback(err, null);
    }
};

var request = function(module, options, parsers, callback) {

    var types = [], prop;

    for (prop in parsers) {
        if (parsers.hasOwnProperty(prop)) {
            types.push(prop);
        }
    }

    var req = module.request(options, function(res) {

        var body = "";

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            body = body + chunk;
        });

        res.on("error", function(err) {
            callback(err, null);
        });

        res.on("end", function() {

            var ct, matched, parser, newopts;

            if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {

                newopts = url.parse(res.headers.location);

                // Don't redirect if it's not allowed

                if (options.httpsOnly && newopts.protocol != "https:") {
                    callback(new Error("Refusing to redirect to non-HTTPS url: " + res.headers.location), null);
                    return;
                }

                newopts.httpsOnly = options.httpsOnly;

                request(((newopts.protocol == "https:") ? https : http), newopts, parsers, callback);
                return;

            } else if (res.statusCode !== 200) {
                callback(new Error("Bad response code: " + res.statusCode + ":" + body), null);
                return;
            }

            if (!res.headers["content-type"]) {
                callback(new Error("No Content-Type header"), null);
                return;
            }

            ct = res.headers["content-type"];

            matched = types.filter(function(type) { return (ct.substr(0, type.length) == type); });

            if (matched.length == 0) {
                callback(new Error("Content-Type '"+ct+"' does not match any expected types: "+types.join(",")), null);
                return;
            }

            parser = parsers[matched];

            parser(body, callback);
        });
    });

    req.on('error', function(err) {
        callback(err, null);
    });

    req.end();    
};

var httpHostMeta = function(address, callback) {

    var options = {
        hostname: address,
        port: 80,
        path: "/.well-known/host-meta",
        method: "GET",
        headers: {
            accept: "application/json, application/xrd+xml; q=0.5"
        }
    };

    request(http, options, {"application/json": jrd, "application/xrd+xml": xrd2jrd}, callback);
};

var httpHostMetaJSON = function(address, callback) {

    var options = {
        hostname: address,
        port: 80,
        path: "/.well-known/host-meta.json",
        method: "GET"
    };

    request(http, options, {"application/json": jrd}, callback);
};

var httpsHostMeta = function(address, httpsOnly, callback) {
    var options = {
        hostname: address,
        port: 443,
        path: "/.well-known/host-meta",
        method: "GET",
        headers: {
            accept: "application/json, application/xrd+xml; q=0.5"
        },
        httpsOnly: httpsOnly
    };

    request(https, options, {"application/json": jrd, "application/xrd+xml": xrd2jrd}, callback);
};

var httpsHostMetaJSON = function(address, httpsOnly, callback) {

    var options = {
        hostname: address,
        port: 443,
        path: "/.well-known/host-meta.json",
        method: "GET",
        httpsOnly: httpsOnly
    };

    request(https, options, {"application/json": jrd}, callback);
};

var invalidHostname = function(hostname) {
    var examples = ["example.com", "example.org", "example.net"],
        tlds = ["example", "invalid"],
        parts;

    if (examples.indexOf(hostname.toLowerCase()) != -1) {
        return true;
    }

    parts = hostname.split(".");

    if (tlds.indexOf(parts[parts.length - 1]) != -1) {
        return true;
    }

    return false;
};

var hostmeta = function(address, options, callback) {

    // options is optional

    if (!callback) {
        callback = options;
        options = {};
    }

    if (invalidHostname(address)) {
        callback(new Error("Invalid hostname: " + address), null);
        return;
    }

    Step(
        function() {
            dns.lookup(address, this);
        },
        function(err, address, family) {
            if (err) {
                callback(err, null);
                return;
            } else {
                httpsHostMetaJSON(address, options.httpsOnly, this);
            }
        },
        function(err, jrd) {
            if (!err) {
                callback(null, jrd);
            } else if (err.code == 'ECONNREFUSED') {
                // Skip this test; no use trying to connect to HTTPS again
                this(err, null);
            } else {
                httpsHostMeta(address, options.httpsOnly, this);
            }
        },
        function(err, jrd) {
            if (!err) {
                callback(null, jrd);
            } else if (options.httpsOnly) {
                callback(new Error("No HTTPS endpoint worked"), null);
            } else {
                httpHostMetaJSON(address, this);
            }
        },
        function(err, jrd) {
            if (!err) {
                callback(null, jrd);
            } else if (err.code == 'ECONNREFUSED') {
                // Skip this test; no use trying to connect to HTTP again
                this(err, null);
            } else {
                httpHostMeta(address, this);
            }
        },
        function(err, jrd) {
            if (!err) {
                callback(null, jrd);
            } else {
                callback(new Error("Unable to get host-meta or host-meta.json"), null);
            }
        }
    );
};

var httpsWebfinger = function(hostname, resource, rel, callback) {

    var params,
        qs,
        options;

    params = {
        resource: resource
    };

    if (rel) {
        params.rel = rel;
    }

    qs = querystring.stringify(params),

    options = {
        hostname: hostname,
        port: 443,
        path: "/.well-known/webfinger?" + qs,
        method: "GET",
        httpsOnly: true
    };

    request(https, options, {"application/json": jrd}, callback);
};

var template = function(tmpl, address, parsers, httpsOnly, callback) {

    Step(
        function() {
            var getme = tmpl.replace("{uri}", encodeURIComponent(address)),
                options = url.parse(getme);

            options.httpsOnly = httpsOnly;

            request(((options.protocol == "https:") ? https : http), options, parsers, this);
        },
        function(err, jrd) {
            var getme, options;

            if (!err) {
                callback(null, jrd);
                return;
            } else if (address.substr(0, 5) == "acct:") {
                // Retry with just the bare address
                getme = tmpl.replace("{uri}", encodeURIComponent(address.substr(5))),
                options = url.parse(getme);
                options.httpsOnly = httpsOnly;

                request(((options.protocol == "https:") ? https : http), options, parsers, this);
            } else {
                throw err;
            }
        },
        function(err, jrd) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, jrd);
            }
        }
    );
};

var lrdd = function(resource, options, callback) {
    var parsed,
        hostname;

    // Options parameter is optional

    if (!callback) {
        callback = options;
        options = {};
    }

    // Prefix it with acct: if it looks like a bare webfinger

    if (resource.indexOf(":") === -1) {
        if (resource.indexOf("@") !== -1) {
            resource = "acct:" + resource;
        }
    }

    parsed = url.parse(resource);
    hostname = parsed.hostname;
    
    Step(
        function() {
            hostmeta(hostname, options, this);
        },
        function(err, hm) {
            var lrdds, json, xrd;
            if (err) throw err;
            if (!hm.hasOwnProperty("links")) {
                throw new Error("No links in host-meta");
            }
            // First, get the lrdd ones
            lrdds = hm.links.filter(function(link) {
                return (link.hasOwnProperty("rel") && 
                        link.rel == "lrdd" &&
                        link.hasOwnProperty("template") && 
                        (!options.httpsOnly || link.template.substr(0, 6) == "https:"));
            });
            if (!lrdds || lrdds.length === 0) {
                throw new Error("No lrdd links with templates in host-meta");
            }
            // Try JSON ones first
            json = lrdds.filter(function(link) {
                return (link.hasOwnProperty("type") &&
                        link.type == JSONTYPE);
            });
            if (json && json.length > 0) {
                template(json[0].template, resource, {"application/json": jrd}, options.httpsOnly, this);
                return;
            }
            // Try explicitly XRD ones second
            xrd = lrdds.filter(function(link) {
                return (link.hasOwnProperty("type") &&
                        link.type == XRDTYPE);
            });
            if (xrd && xrd.length > 0) {
                template(xrd[0].template, resource, {"application/xrd+xml": xrd2jrd}, options.httpsOnly, this);
                return;
            }
            // Try implicitly XRD ones third
            xrd = lrdds.filter(function(link) {
                return (!link.hasOwnProperty("type"));
            });
            if (xrd && xrd.length > 0) {
                template(xrd[0].template, resource, {"application/xrd+xml": xrd2jrd}, options.httpsOnly, this);
                return;
            }
            // Otherwise, give up
            throw new Error("No lrdd links with templates and acceptable type in host-meta");
        },
        callback
    );
}

var webfinger = function(resource, rel, options, callback) {

    var parsed,
        hostname;

    // Options parameter is optional

    if (!callback) {
        callback = options;
        options = {};
    }

    // Rel parameter is optional

    if (!callback) {
        callback = rel;
        rel = null;
    }

    // Prefix it with acct: if it looks like a bare webfinger

    if (resource.indexOf(":") === -1) {
        if (resource.indexOf("@") !== -1) {
            resource = "acct:" + resource;
        }
    }

    parsed = url.parse(resource);

    hostname = parsed.hostname;

    if (invalidHostname(hostname)) {
        callback(new Error("Invalid hostname: " + hostname), null);
        return;
    }

    Step(
        function() {
            httpsWebfinger(hostname, resource, rel, this);
        },
        function(err, jrd) {
            if (!err) {
                // It worked; return the jrd
                callback(null, jrd);
                return;
            } else if (resource.substr(0, 5) == "acct:") {
                // Retry with bare webfinger, no acct:
                httpsWebfinger(hostname, resource.substr(5), rel, this);
            } else {
                throw err;
            }
        },
        function(err, jrd) {
            if (!err) {
                // It worked; return the jrd
                callback(null, jrd);
                return;
            }
            if (options.webfingerOnly) {
                throw new Error("Unable to find webfinger");
            }
            lrdd(resource, options, this);
        },
        callback
    );
};

var discover = function(address, callback) {
    if (address.indexOf("@") !== -1) {
        webfinger(address, callback);
    } else {
        hostmeta(address, callback);
    }
};

exports.xrd2jrd = xrd2jrd;
exports.webfinger = webfinger;
exports.lrdd = lrdd;
exports.hostmeta = hostmeta;
exports.discover = discover;
