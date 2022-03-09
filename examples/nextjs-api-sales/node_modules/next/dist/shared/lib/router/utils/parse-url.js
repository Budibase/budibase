"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseUrl = parseUrl;
var _querystring = require("./querystring");
var _parseRelativeUrl = require("./parse-relative-url");
function parseUrl(url) {
    if (url.startsWith('/')) {
        return (0, _parseRelativeUrl).parseRelativeUrl(url);
    }
    const parsedURL = new URL(url);
    return {
        hash: parsedURL.hash,
        hostname: parsedURL.hostname,
        href: parsedURL.href,
        pathname: parsedURL.pathname,
        port: parsedURL.port,
        protocol: parsedURL.protocol,
        query: (0, _querystring).searchParamsToUrlQuery(parsedURL.searchParams),
        search: parsedURL.search
    };
}

//# sourceMappingURL=parse-url.js.map