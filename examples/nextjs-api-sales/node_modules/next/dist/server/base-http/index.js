"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _constants = require("../../shared/lib/constants");
var _apiUtils = require("../api-utils");
class BaseNextRequest {
    constructor(method, url, body){
        this.method = method;
        this.url = url;
        this.body = body;
    }
    // Utils implemented using the abstract methods above
    get cookies() {
        if (this._cookies) return this._cookies;
        return this._cookies = (0, _apiUtils).getCookieParser(this.headers)();
    }
}
exports.BaseNextRequest = BaseNextRequest;
class BaseNextResponse {
    constructor(destination){
        this.destination = destination;
    }
    // Utils implemented using the abstract methods above
    redirect(destination, statusCode) {
        this.setHeader('Location', destination);
        this.statusCode = statusCode;
        // Since IE11 doesn't support the 308 header add backwards
        // compatibility using refresh header
        if (statusCode === _constants.PERMANENT_REDIRECT_STATUS) {
            this.setHeader('Refresh', `0;url=${destination}`);
        }
        return this;
    }
}
exports.BaseNextResponse = BaseNextResponse;

//# sourceMappingURL=index.js.map