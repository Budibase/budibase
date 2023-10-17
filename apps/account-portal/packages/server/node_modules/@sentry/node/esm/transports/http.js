import { __extends } from "tslib";
import { eventToSentryRequest, sessionToSentryRequest } from '@sentry/core';
import * as http from 'http';
import { BaseTransport } from './base';
/** Node http module transport */
var HTTPTransport = /** @class */ (function (_super) {
    __extends(HTTPTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        var proxy = _this._getProxy('http');
        _this.module = http;
        _this.client = proxy
            ? new (require('https-proxy-agent'))(proxy)
            : new http.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendEvent = function (event) {
        return this._send(eventToSentryRequest(event, this._api), event);
    };
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendSession = function (session) {
        return this._send(sessionToSentryRequest(session, this._api), session);
    };
    return HTTPTransport;
}(BaseTransport));
export { HTTPTransport };
//# sourceMappingURL=http.js.map