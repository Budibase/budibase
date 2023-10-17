Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var https = require("https");
var base_1 = require("./base");
/** Node https module transport */
var HTTPSTransport = /** @class */ (function (_super) {
    tslib_1.__extends(HTTPSTransport, _super);
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
        return this._send(core_1.eventToSentryRequest(event, this._api), event);
    };
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendSession = function (session) {
        return this._send(core_1.sessionToSentryRequest(session, this._api), session);
    };
    return HTTPSTransport;
}(base_1.BaseTransport));
exports.HTTPSTransport = HTTPSTransport;
//# sourceMappingURL=https.js.map