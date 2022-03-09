"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.escapeStringRegexp = escapeStringRegexp;
function escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
}

//# sourceMappingURL=escape-regexp.js.map