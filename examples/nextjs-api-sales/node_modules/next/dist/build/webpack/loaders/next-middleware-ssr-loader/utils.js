"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStringifiedAbsolutePath = getStringifiedAbsolutePath;
var _stringifyRequest = require("../../stringify-request");
function getStringifiedAbsolutePath(target, path) {
    return (0, _stringifyRequest).stringifyRequest(target, target.utils.absolutify(target.rootContext, path));
}

//# sourceMappingURL=utils.js.map