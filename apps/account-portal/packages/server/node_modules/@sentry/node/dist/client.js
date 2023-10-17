Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var hub_1 = require("@sentry/hub");
var utils_1 = require("@sentry/utils");
var backend_1 = require("./backend");
var flags_1 = require("./flags");
/**
 * The Sentry Node SDK Client.
 *
 * @see NodeOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
var NodeClient = /** @class */ (function (_super) {
    tslib_1.__extends(NodeClient, _super);
    /**
     * Creates a new Node SDK instance.
     * @param options Configuration options for this SDK.
     */
    function NodeClient(options) {
        var _this = this;
        options._metadata = options._metadata || {};
        options._metadata.sdk = options._metadata.sdk || {
            name: 'sentry.javascript.node',
            packages: [
                {
                    name: 'npm:@sentry/node',
                    version: core_1.SDK_VERSION,
                },
            ],
            version: core_1.SDK_VERSION,
        };
        _this = _super.call(this, backend_1.NodeBackend, options) || this;
        return _this;
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    NodeClient.prototype.captureException = function (exception, hint, scope) {
        // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
        // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
        // sent to the Server only when the `requestHandler` middleware is used
        if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
            var requestSession = scope.getRequestSession();
            // Necessary checks to ensure this is code block is executed only within a request
            // Should override the status only if `requestSession.status` is `Ok`, which is its initial stage
            if (requestSession && requestSession.status === 'ok') {
                requestSession.status = 'errored';
            }
        }
        return _super.prototype.captureException.call(this, exception, hint, scope);
    };
    /**
     * @inheritDoc
     */
    NodeClient.prototype.captureEvent = function (event, hint, scope) {
        // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
        // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
        // sent to the Server only when the `requestHandler` middleware is used
        if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
            var eventType = event.type || 'exception';
            var isException = eventType === 'exception' && event.exception && event.exception.values && event.exception.values.length > 0;
            // If the event is of type Exception, then a request session should be captured
            if (isException) {
                var requestSession = scope.getRequestSession();
                // Ensure that this is happening within the bounds of a request, and make sure not to override
                // Session Status if Errored / Crashed
                if (requestSession && requestSession.status === 'ok') {
                    requestSession.status = 'errored';
                }
            }
        }
        return _super.prototype.captureEvent.call(this, event, hint, scope);
    };
    /**
     *
     * @inheritdoc
     */
    NodeClient.prototype.close = function (timeout) {
        var _a;
        (_a = this._sessionFlusher) === null || _a === void 0 ? void 0 : _a.close();
        return _super.prototype.close.call(this, timeout);
    };
    /** Method that initialises an instance of SessionFlusher on Client */
    NodeClient.prototype.initSessionFlusher = function () {
        var _a = this._options, release = _a.release, environment = _a.environment;
        if (!release) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Cannot initialise an instance of SessionFlusher if no release is provided!');
        }
        else {
            this._sessionFlusher = new hub_1.SessionFlusher(this.getTransport(), {
                release: release,
                environment: environment,
            });
        }
    };
    /**
     * @inheritDoc
     */
    NodeClient.prototype._prepareEvent = function (event, scope, hint) {
        event.platform = event.platform || 'node';
        if (this.getOptions().serverName) {
            event.server_name = this.getOptions().serverName;
        }
        return _super.prototype._prepareEvent.call(this, event, scope, hint);
    };
    /**
     * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
     * appropriate session aggregates bucket
     */
    NodeClient.prototype._captureRequestSession = function () {
        if (!this._sessionFlusher) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Discarded request mode session because autoSessionTracking option was disabled');
        }
        else {
            this._sessionFlusher.incrementSessionStatusCount();
        }
    };
    return NodeClient;
}(core_1.BaseClient));
exports.NodeClient = NodeClient;
//# sourceMappingURL=client.js.map