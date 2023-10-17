Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var http = require("http");
var base_1 = require("./base");
/** Node http module transport */
var HTTPTransport = /** @class */ (function (_super) {
    tslib_1.__extends(HTTPTransport, _super);
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
        return this._send(core_1.eventToSentryRequest(event, this._api), event);
    };
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendSession = function (session) {
        return this._send(core_1.sessionToSentryRequest(session, this._api), session);
    };
    return HTTPTransport;
}(base_1.BaseTransport));
exports.HTTPTransport = HTTPTransport;
//# sourceMappingURL=http.js.map