"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizePathSep = normalizePathSep;
exports.denormalizePagePath = denormalizePagePath;
var _utils = require("../shared/lib/router/utils");
function normalizePathSep(path) {
    return path.replace(/\\/g, '/');
}
function denormalizePagePath(page) {
    page = normalizePathSep(page);
    if (page.startsWith('/index/') && !(0, _utils).isDynamicRoute(page)) {
        page = page.slice(6);
    } else if (page === '/index') {
        page = '/';
    }
    return page;
}

//# sourceMappingURL=denormalize-page-path.js.map