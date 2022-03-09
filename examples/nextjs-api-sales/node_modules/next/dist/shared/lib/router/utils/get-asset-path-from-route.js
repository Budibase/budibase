"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getAssetPathFromRoute;
function getAssetPathFromRoute(route, ext = '') {
    const path = route === '/' ? '/index' : /^\/index(\/|$)/.test(route) ? `/index${route}` : `${route}`;
    return path + ext;
}

//# sourceMappingURL=get-asset-path-from-route.js.map