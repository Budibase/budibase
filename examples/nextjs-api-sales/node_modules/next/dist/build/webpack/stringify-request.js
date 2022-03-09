"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stringifyRequest = stringifyRequest;
function stringifyRequest(loaderContext, request) {
    return JSON.stringify(loaderContext.utils.contextify(loaderContext.context || loaderContext.rootContext, request));
}

//# sourceMappingURL=stringify-request.js.map