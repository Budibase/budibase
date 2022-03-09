"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isError;
exports.getProperError = getProperError;
var _isPlainObject = require("../shared/lib/is-plain-object");
function isError(err) {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if (process.env.NODE_ENV === 'development') {
        // provide better error for case where `throw undefined`
        // is called in development
        if (typeof err === 'undefined') {
            return new Error('An undefined error was thrown, ' + 'see here for more info: https://nextjs.org/docs/messages/threw-undefined');
        }
        if (err === null) {
            return new Error('A null error was thrown, ' + 'see here for more info: https://nextjs.org/docs/messages/threw-undefined');
        }
    }
    return new Error((0, _isPlainObject).isPlainObject(err) ? JSON.stringify(err) : err + '');
}

//# sourceMappingURL=is-error.js.map