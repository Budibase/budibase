"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removePathTrailingSlash = removePathTrailingSlash;
exports.normalizePathTrailingSlash = void 0;
function removePathTrailingSlash(path) {
    return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}
const normalizePathTrailingSlash = process.env.__NEXT_TRAILING_SLASH ? (path)=>{
    if (/\.[^/]+\/?$/.test(path)) {
        return removePathTrailingSlash(path);
    } else if (path.endsWith('/')) {
        return path;
    } else {
        return path + '/';
    }
} : removePathTrailingSlash;
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;

//# sourceMappingURL=normalize-trailing-slash.js.map