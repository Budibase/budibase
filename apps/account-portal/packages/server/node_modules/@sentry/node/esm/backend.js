import { __assign, __extends } from "tslib";
import { BaseBackend, getEnvelopeEndpointWithUrlEncodedAuth, initAPIDetails } from '@sentry/core';
import { Severity } from '@sentry/types';
import { makeDsn, resolvedSyncPromise } from '@sentry/utils';
import { eventFromMessage, eventFromUnknownInput } from './eventbuilder';
import { HTTPSTransport, HTTPTransport, makeNodeTransport } from './transports';
/**
 * The Sentry Node SDK Backend.
 * @hidden
 */
var NodeBackend = /** @class */ (function (_super) {
    __extends(NodeBackend, _super);
    function NodeBackend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    NodeBackend.prototype.eventFromException = function (exception, hint) {
        return resolvedSyncPromise(eventFromUnknownInput(exception, hint));
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype.eventFromMessage = function (message, level, hint) {
        if (level === void 0) { level = Severity.Info; }
        return resolvedSyncPromise(eventFromMessage(message, level, hint, this._options.attachStacktrace));
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype._setupTransport = function () {
        if (!this._options.dsn) {
            // We return the noop transport here in case there is no Dsn.
            return _super.prototype._setupTransport.call(this);
        }
        var dsn = makeDsn(this._options.dsn);
        var transportOptions = __assign(__assign(__assign(__assign(__assign({}, this._options.transportOptions), (this._options.httpProxy && { httpProxy: this._options.httpProxy })), (this._options.httpsProxy && { httpsProxy: this._options.httpsProxy })), (this._options.caCerts && { caCerts: this._options.caCerts })), { dsn: this._options.dsn, tunnel: this._options.tunnel, _metadata: this._options._metadata });
        if (this._options.transport) {
            return new this._options.transport(transportOptions);
        }
        var api = initAPIDetails(transportOptions.dsn, transportOptions._metadata, transportOptions.tunnel);
        var url = getEnvelopeEndpointWithUrlEncodedAuth(api.dsn, api.tunnel);
        this._newTransport = makeNodeTransport({
            url: url,
            headers: transportOptions.headers,
            proxy: transportOptions.httpProxy,
            caCerts: transportOptions.caCerts,
        });
        if (dsn.protocol === 'http') {
            return new HTTPTransport(transportOptions);
        }
        return new HTTPSTransport(transportOptions);
    };
    return NodeBackend;
}(BaseBackend));
export { NodeBackend };
//# sourceMappingURL=backend.js.map