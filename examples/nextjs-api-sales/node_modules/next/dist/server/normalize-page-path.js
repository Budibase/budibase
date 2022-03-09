"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathSep", {
    enumerable: true,
    get: function() {
        return _denormalizePagePath.normalizePathSep;
    }
});
Object.defineProperty(exports, "denormalizePagePath", {
    enumerable: true,
    get: function() {
        return _denormalizePagePath.denormalizePagePath;
    }
});
exports.normalizePagePath = normalizePagePath;
var _path = require("path");
var _utils = require("../shared/lib/router/utils");
var _denormalizePagePath = require("./denormalize-page-path");
function normalizePagePath(page) {
    // If the page is `/` we need to append `/index`, otherwise the returned directory root will be bundles instead of pages
    if (page === '/') {
        page = '/index';
    } else if (/^\/index(\/|$)/.test(page) && !(0, _utils).isDynamicRoute(page)) {
        page = `/index${page}`;
    }
    // Resolve on anything that doesn't start with `/`
    if (!page.startsWith('/')) {
        page = `/${page}`;
    }
    // Throw when using ../ etc in the pathname
    const resolvedPage = _path.posix.normalize(page);
    if (page !== resolvedPage) {
        throw new Error(`Requested and resolved page mismatch: ${page} ${resolvedPage}`);
    }
    return page;
}

//# sourceMappingURL=normalize-page-path.js.map