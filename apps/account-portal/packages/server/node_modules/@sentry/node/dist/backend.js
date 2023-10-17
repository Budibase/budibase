Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var types_1 = require("@sentry/types");
var utils_1 = require("@sentry/utils");
var eventbuilder_1 = require("./eventbuilder");
var transports_1 = require("./transports");
/**
 * The Sentry Node SDK Backend.
 * @hidden
 */
var NodeBackend = /** @class */ (function (_super) {
    tslib_1.__extends(NodeBackend, _super);
    function NodeBackend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    NodeBackend.prototype.eventFromException = function (exception, hint) {
        return utils_1.resolvedSyncPromise(eventbuilder_1.eventFromUnknownInput(exception, hint));
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype.eventFromMessage = function (message, level, hint) {
        if (level === void 0) { level = types_1.Severity.Info; }
        return utils_1.resolvedSyncPromise(eventbuilder_1.eventFromMessage(message, level, hint, this._options.attachStacktrace));
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype._setupTransport = function () {
        if (!this._options.dsn) {
            // We return the noop transport here in case there is no Dsn.
            return _super.prototype._setupTransport.call(this);
        }
        var dsn = utils_1.makeDsn(this._options.dsn);
        var transportOptions = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, this._options.transportOptions), (this._options.httpProxy && { httpProxy: this._options.httpProxy })), (this._options.httpsProxy && { httpsProxy: this._options.httpsProxy })), (this._options.caCerts && { caCerts: this._options.caCerts })), { dsn: this._options.dsn, tunnel: this._options.tunnel, _metadata: this._options._metadata });
        if (this._options.transport) {
            return new this._options.transport(transportOptions);
        }
        var api = core_1.initAPIDetails(transportOptions.dsn, transportOptions._metadata, transportOptions.tunnel);
        var url = core_1.getEnvelopeEndpointWithUrlEncodedAuth(api.dsn, api.tunnel);
        this._newTransport = transports_1.makeNodeTransport({
            url: url,
            headers: transportOptions.headers,
            proxy: transportOptions.httpProxy,
            caCerts: transportOptions.caCerts,
        });
        if (dsn.protocol === 'http') {
            return new transports_1.HTTPTransport(transportOptions);
        }
        return new transports_1.HTTPSTransport(transportOptions);
    };
    return NodeBackend;
}(core_1.BaseBackend));
exports.NodeBackend = NodeBackend;
//# sourceMappingURL=backend.js.map