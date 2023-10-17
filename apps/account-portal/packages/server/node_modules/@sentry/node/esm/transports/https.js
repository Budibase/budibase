import { __extends } from "tslib";
import { eventToSentryRequest, sessionToSentryRequest } from '@sentry/core';
import * as https from 'https';
import { BaseTransport } from './base';
/** Node https module transport */
var HTTPSTransport = /** @class */ (function (_super) {
    __extends(HTTPSTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPSTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        var proxy = _this._getProxy('https');
        _this.module = https;
        _this.client = proxy
            ? new (require('https-proxy-agent'))(proxy)
            : new https.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendEvent = function (event) {
        return this._send(eventToSentryRequest(event, this._api), event);
    };
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendSession = function (session) {
        return this._send(sessionToSentryRequest(session, this._api), session);
    };
    return HTTPSTransport;
}(BaseTransport));
export { HTTPSTransport };
//# sourceMappingURL=https.js.map