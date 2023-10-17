import { __assign, __awaiter, __generator, __read, __spread, __values } from "tslib";
import { getRequestHeaders, initAPIDetails, SDK_VERSION } from '@sentry/core';
import { eventStatusFromHttpCode, logger, makePromiseBuffer, parseRetryAfterHeader, SentryError, } from '@sentry/utils';
import * as fs from 'fs';
import { URL } from 'url';
import { IS_DEBUG_BUILD } from '../../flags';
import { SDK_NAME } from '../../version';
var CATEGORY_MAPPING = {
    event: 'error',
    transaction: 'transaction',
    session: 'session',
    attachment: 'attachment',
};
/** Base Transport class implementation */
var BaseTransport = /** @class */ (function () {
    /** Create instance and set this.dsn */
    function BaseTransport(options) {
        this.options = options;
        /** A simple buffer holding all requests. */
        this._buffer = makePromiseBuffer(30);
        /** Locks transport after receiving rate limits in a response */
        this._rateLimits = {};
        /** Default function used to parse URLs */
        this.urlParser = function (url) { return new URL(url); };
        // eslint-disable-next-line deprecation/deprecation
        this._api = initAPIDetails(options.dsn, options._metadata, options.tunnel);
    }
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.sendEvent = function (_) {
        throw new SentryError('Transport Class has to implement `sendEvent` method.');
    };
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.close = function (timeout) {
        return this._buffer.drain(timeout);
    };
    /**
     * Extracts proxy settings from client options and env variables.
     *
     * Honors `no_proxy` env variable with the highest priority to allow for hosts exclusion.
     *
     * An order of priority for available protocols is:
     * `http`  => `options.httpProxy` | `process.env.http_proxy`
     * `https` => `options.httpsProxy` | `options.httpProxy` | `process.env.https_proxy` | `process.env.http_proxy`
     */
    BaseTransport.prototype._getProxy = function (protocol) {
        var e_1, _a;
        var _b = process.env, no_proxy = _b.no_proxy, http_proxy = _b.http_proxy, https_proxy = _b.https_proxy;
        var _c = this.options, httpProxy = _c.httpProxy, httpsProxy = _c.httpsProxy;
        var proxy = protocol === 'http' ? httpProxy || http_proxy : httpsProxy || httpProxy || https_proxy || http_proxy;
        if (!no_proxy) {
            return proxy;
        }
        var _d = this._api.dsn, host = _d.host, port = _d.port;
        try {
            for (var _e = __values(no_proxy.split(',')), _f = _e.next(); !_f.done; _f = _e.next()) {
                var np = _f.value;
                if (host.endsWith(np) || (host + ":" + port).endsWith(np)) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return proxy;
    };
    /** Returns a build request option object used by request */
    BaseTransport.prototype._getRequestOptions = function (urlParts) {
        var headers = __assign(__assign({}, getRequestHeaders(this._api.dsn, SDK_NAME, SDK_VERSION)), this.options.headers);
        var hostname = urlParts.hostname, pathname = urlParts.pathname, port = urlParts.port, protocol = urlParts.protocol;
        // See https://github.com/nodejs/node/blob/38146e717fed2fabe3aacb6540d839475e0ce1c6/lib/internal/url.js#L1268-L1290
        // We ignore the query string on purpose
        var path = "" + pathname;
        return __assign({ agent: this.client, headers: headers,
            hostname: hostname, method: 'POST', path: path,
            port: port,
            protocol: protocol }, (this.options.caCerts && {
            ca: fs.readFileSync(this.options.caCerts),
        }));
    };
    /**
     * Gets the time that given category is disabled until for rate limiting
     */
    BaseTransport.prototype._disabledUntil = function (requestType) {
        var category = CATEGORY_MAPPING[requestType];
        return this._rateLimits[category] || this._rateLimits.all;
    };
    /**
     * Checks if a category is rate limited
     */
    BaseTransport.prototype._isRateLimited = function (requestType) {
        return this._disabledUntil(requestType) > new Date(Date.now());
    };
    /**
     * Sets internal _rateLimits from incoming headers. Returns true if headers contains a non-empty rate limiting header.
     */
    BaseTransport.prototype._handleRateLimit = function (headers) {
        var e_2, _a, e_3, _b;
        var now = Date.now();
        var rlHeader = headers['x-sentry-rate-limits'];
        var raHeader = headers['retry-after'];
        if (rlHeader) {
            try {
                // rate limit headers are of the form
                //     <header>,<header>,..
                // where each <header> is of the form
                //     <retry_after>: <categories>: <scope>: <reason_code>
                // where
                //     <retry_after> is a delay in ms
                //     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
                //         <category>;<category>;...
                //     <scope> is what's being limited (org, project, or key) - ignored by SDK
                //     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
                for (var _c = __values(rlHeader.trim().split(',')), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var limit = _d.value;
                    var parameters = limit.split(':', 2);
                    var headerDelay = parseInt(parameters[0], 10);
                    var delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
                    try {
                        for (var _e = (e_3 = void 0, __values((parameters[1] && parameters[1].split(';')) || ['all'])), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var category = _f.value;
                            // categoriesAllowed is added here to ensure we are only storing rate limits for categories we support in this
                            // sdk and any categories that are not supported will not be added redundantly to the rateLimits object
                            var categoriesAllowed = __spread(Object.keys(CATEGORY_MAPPING).map(function (k) { return CATEGORY_MAPPING[k]; }), [
                                'all',
                            ]);
                            if (categoriesAllowed.includes(category))
                                this._rateLimits[category] = new Date(now + delay);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        }
        else if (raHeader) {
            this._rateLimits.all = new Date(now + parseRetryAfterHeader(raHeader, now));
            return true;
        }
        return false;
    };
    /** JSDoc */
    BaseTransport.prototype._send = function (sentryRequest, originalPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.module) {
                    throw new SentryError('No module available');
                }
                if (originalPayload && this._isRateLimited(sentryRequest.type)) {
                    return [2 /*return*/, Promise.reject({
                            payload: originalPayload,
                            type: sentryRequest.type,
                            reason: "Transport for " + sentryRequest.type + " requests locked till " + this._disabledUntil(sentryRequest.type) + " due to too many requests.",
                            status: 429,
                        })];
                }
                return [2 /*return*/, this._buffer.add(function () {
                        return new Promise(function (resolve, reject) {
                            if (!_this.module) {
                                throw new SentryError('No module available');
                            }
                            var options = _this._getRequestOptions(_this.urlParser(sentryRequest.url));
                            var req = _this.module.request(options, function (res) {
                                var statusCode = res.statusCode || 500;
                                var status = eventStatusFromHttpCode(statusCode);
                                res.setEncoding('utf8');
                                /**
                                 * "Key-value pairs of header names and values. Header names are lower-cased."
                                 * https://nodejs.org/api/http.html#http_message_headers
                                 */
                                var retryAfterHeader = res.headers ? res.headers['retry-after'] : '';
                                retryAfterHeader = (Array.isArray(retryAfterHeader) ? retryAfterHeader[0] : retryAfterHeader);
                                var rlHeader = res.headers ? res.headers['x-sentry-rate-limits'] : '';
                                rlHeader = (Array.isArray(rlHeader) ? rlHeader[0] : rlHeader);
                                var headers = {
                                    'x-sentry-rate-limits': rlHeader,
                                    'retry-after': retryAfterHeader,
                                };
                                var limited = _this._handleRateLimit(headers);
                                if (limited)
                                    IS_DEBUG_BUILD &&
                                        logger.warn("Too many " + sentryRequest.type + " requests, backing off until: " + _this._disabledUntil(sentryRequest.type));
                                if (status === 'success') {
                                    resolve({ status: status });
                                }
                                else {
                                    var rejectionMessage = "HTTP Error (" + statusCode + ")";
                                    if (res.headers && res.headers['x-sentry-error']) {
                                        rejectionMessage += ": " + res.headers['x-sentry-error'];
                                    }
                                    reject(new SentryError(rejectionMessage));
                                }
                                // Force the socket to drain
                                res.on('data', function () {
                                    // Drain
                                });
                                res.on('end', function () {
                                    // Drain
                                });
                            });
                            req.on('error', reject);
                            req.end(sentryRequest.body);
                        });
                    })];
            });
        });
    };
    return BaseTransport;
}());
export { BaseTransport };
//# sourceMappingURL=index.js.map