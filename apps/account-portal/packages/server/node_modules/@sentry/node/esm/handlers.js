import { __assign } from "tslib";
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { captureException, getCurrentHub, startTransaction, withScope } from '@sentry/core';
import { extractTraceparentData, isPlainObject, isString, logger, normalize, stripUrlQueryAndFragment, } from '@sentry/utils';
import * as cookie from 'cookie';
import * as domain from 'domain';
import * as os from 'os';
import * as url from 'url';
import { IS_DEBUG_BUILD } from './flags';
import { flush, isAutoSessionTrackingEnabled } from './sdk';
/**
 * Express-compatible tracing handler.
 * @see Exposed as `Handlers.tracingHandler`
 */
export function tracingHandler() {
    return function sentryTracingMiddleware(req, res, next) {
        // If there is a trace header set, we extract the data from it (parentSpanId, traceId, and sampling decision)
        var traceparentData;
        if (req.headers && isString(req.headers['sentry-trace'])) {
            traceparentData = extractTraceparentData(req.headers['sentry-trace']);
        }
        var transaction = startTransaction(__assign({ name: extractExpressTransactionName(req, { path: true, method: true }), op: 'http.server' }, traceparentData), 
        // extra context passed to the tracesSampler
        { request: extractRequestData(req) });
        // We put the transaction on the scope so users can attach children to it
        getCurrentHub().configureScope(function (scope) {
            scope.setSpan(transaction);
        });
        // We also set __sentry_transaction on the response so people can grab the transaction there to add
        // spans to it later.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        res.__sentry_transaction = transaction;
        res.once('finish', function () {
            // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction
            // closes
            setImmediate(function () {
                addExpressReqToTransaction(transaction, req);
                transaction.setHttpStatus(res.statusCode);
                transaction.finish();
            });
        });
        next();
    };
}
/**
 * Set parameterized as transaction name e.g.: `GET /users/:id`
 * Also adds more context data on the transaction from the request
 */
function addExpressReqToTransaction(transaction, req) {
    if (!transaction)
        return;
    transaction.name = extractExpressTransactionName(req, { path: true, method: true });
    transaction.setData('url', req.originalUrl);
    transaction.setData('baseUrl', req.baseUrl);
    transaction.setData('query', req.query);
}
/**
 * Extracts complete generalized path from the request object and uses it to construct transaction name.
 *
 * eg. GET /mountpoint/user/:id
 *
 * @param req The ExpressRequest object
 * @param options What to include in the transaction name (method, path, or both)
 *
 * @returns The fully constructed transaction name
 */
function extractExpressTransactionName(req, options) {
    if (options === void 0) { options = {}; }
    var _a;
    var method = (_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
    var path = '';
    if (req.route) {
        path = "" + (req.baseUrl || '') + req.route.path;
    }
    else if (req.originalUrl || req.url) {
        path = stripUrlQueryAndFragment(req.originalUrl || req.url || '');
    }
    var info = '';
    if (options.method && method) {
        info += method;
    }
    if (options.method && options.path) {
        info += ' ';
    }
    if (options.path && path) {
        info += path;
    }
    return info;
}
/** JSDoc */
function extractTransaction(req, type) {
    var _a;
    switch (type) {
        case 'path': {
            return extractExpressTransactionName(req, { path: true });
        }
        case 'handler': {
            return ((_a = req.route) === null || _a === void 0 ? void 0 : _a.stack[0].name) || '<anonymous>';
        }
        case 'methodPath':
        default: {
            return extractExpressTransactionName(req, { path: true, method: true });
        }
    }
}
/** Default user keys that'll be used to extract data from the request */
var DEFAULT_USER_KEYS = ['id', 'username', 'email'];
/** JSDoc */
function extractUserData(user, keys) {
    var extractedUser = {};
    var attributes = Array.isArray(keys) ? keys : DEFAULT_USER_KEYS;
    attributes.forEach(function (key) {
        if (user && key in user) {
            extractedUser[key] = user[key];
        }
    });
    return extractedUser;
}
/** Default request keys that'll be used to extract data from the request */
var DEFAULT_REQUEST_KEYS = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];
/**
 * Normalizes data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param keys An optional array of keys to include in the normalized data. Defaults to DEFAULT_REQUEST_KEYS if not
 * provided.
 * @returns An object containing normalized request data
 */
export function extractRequestData(req, keys) {
    if (keys === void 0) { keys = DEFAULT_REQUEST_KEYS; }
    var requestData = {};
    // headers:
    //   node, express, nextjs: req.headers
    //   koa: req.header
    var headers = (req.headers || req.header || {});
    // method:
    //   node, express, koa, nextjs: req.method
    var method = req.method;
    // host:
    //   express: req.hostname in > 4 and req.host in < 4
    //   koa: req.host
    //   node, nextjs: req.headers.host
    var host = req.hostname || req.host || headers.host || '<no host>';
    // protocol:
    //   node, nextjs: <n/a>
    //   express, koa: req.protocol
    var protocol = req.protocol === 'https' || req.secure || (req.socket || {}).encrypted
        ? 'https'
        : 'http';
    // url (including path and query string):
    //   node, express: req.originalUrl
    //   koa, nextjs: req.url
    var originalUrl = (req.originalUrl || req.url || '');
    // absolute url
    var absoluteUrl = protocol + "://" + host + originalUrl;
    keys.forEach(function (key) {
        switch (key) {
            case 'headers':
                requestData.headers = headers;
                break;
            case 'method':
                requestData.method = method;
                break;
            case 'url':
                requestData.url = absoluteUrl;
                break;
            case 'cookies':
                // cookies:
                //   node, express, koa: req.headers.cookie
                //   vercel, sails.js, express (w/ cookie middleware), nextjs: req.cookies
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestData.cookies = req.cookies || cookie.parse(headers.cookie || '');
                break;
            case 'query_string':
                // query string:
                //   node: req.url (raw)
                //   express, koa, nextjs: req.query
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestData.query_string = req.query || url.parse(originalUrl || '', false).query;
                break;
            case 'data':
                if (method === 'GET' || method === 'HEAD') {
                    break;
                }
                // body data:
                //   express, koa, nextjs: req.body
                //
                //   when using node by itself, you have to read the incoming stream(see
                //   https://nodejs.dev/learn/get-http-request-body-data-using-nodejs); if a user is doing that, we can't know
                //   where they're going to store the final result, so they'll have to capture this data themselves
                if (req.body !== undefined) {
                    requestData.data = isString(req.body) ? req.body : JSON.stringify(normalize(req.body));
                }
                break;
            default:
                if ({}.hasOwnProperty.call(req, key)) {
                    requestData[key] = req[key];
                }
        }
    });
    return requestData;
}
/**
 * Enriches passed event with request data.
 *
 * @param event Will be mutated and enriched with req data
 * @param req Request object
 * @param options object containing flags to enable functionality
 * @hidden
 */
export function parseRequest(event, req, options) {
    // eslint-disable-next-line no-param-reassign
    options = __assign({ ip: false, request: true, serverName: true, transaction: true, user: true, version: true }, options);
    if (options.version) {
        event.contexts = __assign(__assign({}, event.contexts), { runtime: {
                name: 'node',
                version: global.process.version,
            } });
    }
    if (options.request) {
        // if the option value is `true`, use the default set of keys by not passing anything to `extractRequestData()`
        var extractedRequestData = Array.isArray(options.request)
            ? extractRequestData(req, options.request)
            : extractRequestData(req);
        event.request = __assign(__assign({}, event.request), extractedRequestData);
    }
    if (options.serverName && !event.server_name) {
        event.server_name = global.process.env.SENTRY_NAME || os.hostname();
    }
    if (options.user) {
        var extractedUser = req.user && isPlainObject(req.user) ? extractUserData(req.user, options.user) : {};
        if (Object.keys(extractedUser)) {
            event.user = __assign(__assign({}, event.user), extractedUser);
        }
    }
    // client ip:
    //   node, nextjs: req.connection.remoteAddress
    //   express, koa: req.ip
    if (options.ip) {
        var ip = req.ip || (req.connection && req.connection.remoteAddress);
        if (ip) {
            event.user = __assign(__assign({}, event.user), { ip_address: ip });
        }
    }
    if (options.transaction && !event.transaction) {
        // TODO do we even need this anymore?
        // TODO make this work for nextjs
        event.transaction = extractTransaction(req, options.transaction);
    }
    return event;
}
/**
 * Express compatible request handler.
 * @see Exposed as `Handlers.requestHandler`
 */
export function requestHandler(options) {
    var currentHub = getCurrentHub();
    var client = currentHub.getClient();
    // Initialise an instance of SessionFlusher on the client when `autoSessionTracking` is enabled and the
    // `requestHandler` middleware is used indicating that we are running in SessionAggregates mode
    if (client && isAutoSessionTrackingEnabled(client)) {
        client.initSessionFlusher();
        // If Scope contains a Single mode Session, it is removed in favor of using Session Aggregates mode
        var scope = currentHub.getScope();
        if (scope && scope.getSession()) {
            scope.setSession();
        }
    }
    return function sentryRequestMiddleware(req, res, next) {
        if (options && options.flushTimeout && options.flushTimeout > 0) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            var _end_1 = res.end;
            res.end = function (chunk, encoding, cb) {
                var _this = this;
                void flush(options.flushTimeout)
                    .then(function () {
                    _end_1.call(_this, chunk, encoding, cb);
                })
                    .then(null, function (e) {
                    IS_DEBUG_BUILD && logger.error(e);
                    _end_1.call(_this, chunk, encoding, cb);
                });
            };
        }
        var local = domain.create();
        local.add(req);
        local.add(res);
        local.on('error', next);
        local.run(function () {
            var currentHub = getCurrentHub();
            currentHub.configureScope(function (scope) {
                scope.addEventProcessor(function (event) { return parseRequest(event, req, options); });
                var client = currentHub.getClient();
                if (isAutoSessionTrackingEnabled(client)) {
                    var scope_1 = currentHub.getScope();
                    if (scope_1) {
                        // Set `status` of `RequestSession` to Ok, at the beginning of the request
                        scope_1.setRequestSession({ status: 'ok' });
                    }
                }
            });
            res.once('finish', function () {
                var client = currentHub.getClient();
                if (isAutoSessionTrackingEnabled(client)) {
                    setImmediate(function () {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        if (client && client._captureRequestSession) {
                            // Calling _captureRequestSession to capture request session at the end of the request by incrementing
                            // the correct SessionAggregates bucket i.e. crashed, errored or exited
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            client._captureRequestSession();
                        }
                    });
                }
            });
            next();
        });
    };
}
/** JSDoc */
function getStatusCodeFromResponse(error) {
    var statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
    return statusCode ? parseInt(statusCode, 10) : 500;
}
/** Returns true if response code is internal server error */
function defaultShouldHandleError(error) {
    var status = getStatusCodeFromResponse(error);
    return status >= 500;
}
/**
 * Express compatible error handler.
 * @see Exposed as `Handlers.errorHandler`
 */
export function errorHandler(options) {
    return function sentryErrorMiddleware(error, _req, res, next) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var shouldHandleError = (options && options.shouldHandleError) || defaultShouldHandleError;
        if (shouldHandleError(error)) {
            withScope(function (_scope) {
                // For some reason we need to set the transaction on the scope again
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                var transaction = res.__sentry_transaction;
                if (transaction && _scope.getSpan() === undefined) {
                    _scope.setSpan(transaction);
                }
                var client = getCurrentHub().getClient();
                if (client && isAutoSessionTrackingEnabled(client)) {
                    // Check if the `SessionFlusher` is instantiated on the client to go into this branch that marks the
                    // `requestSession.status` as `Crashed`, and this check is necessary because the `SessionFlusher` is only
                    // instantiated when the the`requestHandler` middleware is initialised, which indicates that we should be
                    // running in SessionAggregates mode
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    var isSessionAggregatesMode = client._sessionFlusher !== undefined;
                    if (isSessionAggregatesMode) {
                        var requestSession = _scope.getRequestSession();
                        // If an error bubbles to the `errorHandler`, then this is an unhandled error, and should be reported as a
                        // Crashed session. The `_requestSession.status` is checked to ensure that this error is happening within
                        // the bounds of a request, and if so the status is updated
                        if (requestSession && requestSession.status !== undefined) {
                            requestSession.status = 'crashed';
                        }
                    }
                }
                var eventId = captureException(error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                res.sentry = eventId;
                next(error);
            });
            return;
        }
        next(error);
    };
}
//# sourceMappingURL=handlers.js.map