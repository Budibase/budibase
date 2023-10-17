Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sentry/core");
var utils_1 = require("@sentry/utils");
var http = require("http");
var https = require("https");
var url_1 = require("url");
/**
 * Creates a Transport that uses native the native 'http' and 'https' modules to send events to Sentry.
 */
function makeNodeTransport(options) {
    var _a;
    var urlSegments = new url_1.URL(options.url);
    var isHttps = urlSegments.protocol === 'https:';
    // Proxy prioritization: http => `options.proxy` | `process.env.http_proxy`
    // Proxy prioritization: https => `options.proxy` | `process.env.https_proxy` | `process.env.http_proxy`
    var proxy = applyNoProxyOption(urlSegments, options.proxy || (isHttps ? process.env.https_proxy : undefined) || process.env.http_proxy);
    var nativeHttpModule = isHttps ? https : http;
    // TODO(v7): Evaluate if we can set keepAlive to true. This would involve testing for memory leaks in older node
    // versions(>= 8) as they had memory leaks when using it: #2555
    var agent = proxy
        ? new (require('https-proxy-agent'))(proxy)
        : new nativeHttpModule.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });
    var requestExecutor = createRequestExecutor(options, (_a = options.httpModule, (_a !== null && _a !== void 0 ? _a : nativeHttpModule)), agent);
    return core_1.createTransport({ bufferSize: options.bufferSize }, requestExecutor);
}
exports.makeNodeTransport = makeNodeTransport;
/**
 * Honors the `no_proxy` env variable with the highest priority to allow for hosts exclusion.
 *
 * @param transportUrl The URL the transport intends to send events to.
 * @param proxy The client configured proxy.
 * @returns A proxy the transport should use.
 */
function applyNoProxyOption(transportUrlSegments, proxy) {
    var no_proxy = process.env.no_proxy;
    var urlIsExemptFromProxy = no_proxy &&
        no_proxy
            .split(',')
            .some(function (exemption) { return transportUrlSegments.host.endsWith(exemption) || transportUrlSegments.hostname.endsWith(exemption); });
    if (urlIsExemptFromProxy) {
        return undefined;
    }
    else {
        return proxy;
    }
}
/**
 * Creates a RequestExecutor to be used with `createTransport`.
 */
function createRequestExecutor(options, httpModule, agent) {
    var _a = new url_1.URL(options.url), hostname = _a.hostname, pathname = _a.pathname, port = _a.port, protocol = _a.protocol, search = _a.search;
    return function makeRequest(request) {
        return new Promise(function (resolve, reject) {
            var req = httpModule.request({
                method: 'POST',
                agent: agent,
                headers: options.headers,
                hostname: hostname,
                path: "" + pathname + search,
                port: port,
                protocol: protocol,
                ca: options.caCerts,
            }, function (res) {
                var _a, _b, _c;
                res.on('data', function () {
                    // Drain socket
                });
                res.on('end', function () {
                    // Drain socket
                });
                var statusCode = (_a = res.statusCode, (_a !== null && _a !== void 0 ? _a : 500));
                var status = utils_1.eventStatusFromHttpCode(statusCode);
                res.setEncoding('utf8');
                // "Key-value pairs of header names and values. Header names are lower-cased."
                // https://nodejs.org/api/http.html#http_message_headers
                var retryAfterHeader = (_b = res.headers['retry-after'], (_b !== null && _b !== void 0 ? _b : null));
                var rateLimitsHeader = (_c = res.headers['x-sentry-rate-limits'], (_c !== null && _c !== void 0 ? _c : null));
                resolve({
                    headers: {
                        'retry-after': retryAfterHeader,
                        'x-sentry-rate-limits': Array.isArray(rateLimitsHeader) ? rateLimitsHeader[0] : rateLimitsHeader,
                    },
                    reason: status,
                    statusCode: statusCode,
                });
            });
            req.on('error', reject);
            req.end(request.body);
        });
    };
}
//# sourceMappingURL=new.js.map