"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getRouteFromAssetPath;
var _isDynamic = require("./is-dynamic");
function getRouteFromAssetPath(assetPath, ext = '') {
    assetPath = assetPath.replace(/\\/g, '/');
    assetPath = ext && assetPath.endsWith(ext) ? assetPath.slice(0, -ext.length) : assetPath;
    if (assetPath.startsWith('/index/') && !(0, _isDynamic).isDynamicRoute(assetPath)) {
        assetPath = assetPath.slice(6);
    } else if (assetPath === '/index') {
        assetPath = '/';
    }
    return assetPath;
}

//# sourceMappingURL=get-route-from-asset-path.js.map