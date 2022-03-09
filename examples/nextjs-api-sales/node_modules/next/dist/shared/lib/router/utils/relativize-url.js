"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.relativizeURL = relativizeURL;
function relativizeURL(url, base) {
    const baseURL = typeof base === 'string' ? new URL(base) : base;
    const relative = new URL(url, base);
    const origin = `${baseURL.protocol}//${baseURL.host}`;
    return `${relative.protocol}//${relative.host}` === origin ? relative.toString().replace(origin, '') : relative.toString();
}

//# sourceMappingURL=relativize-url.js.map