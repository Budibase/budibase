"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseRelativeUrl = parseRelativeUrl;
var _utils = require("../../utils");
var _querystring = require("./querystring");
function parseRelativeUrl(url, base) {
    const globalBase = new URL(typeof window === 'undefined' ? 'http://n' : (0, _utils).getLocationOrigin());
    const resolvedBase = base ? new URL(base, globalBase) : globalBase;
    const { pathname , searchParams , search , hash , href , origin  } = new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw new Error(`invariant: invalid relative URL, router received ${url}`);
    }
    return {
        pathname,
        query: (0, _querystring).searchParamsToUrlQuery(searchParams),
        search,
        hash,
        href: href.slice(globalBase.origin.length)
    };
}

//# sourceMappingURL=parse-relative-url.js.map