"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = escapePathDelimiters;
function escapePathDelimiters(segment, escapeEncoded) {
    return segment.replace(new RegExp(`([/#?]${escapeEncoded ? '|%(2f|23|3f)' : ''})`, 'gi'), (char)=>encodeURIComponent(char)
    );
}

//# sourceMappingURL=escape-path-delimiters.js.map