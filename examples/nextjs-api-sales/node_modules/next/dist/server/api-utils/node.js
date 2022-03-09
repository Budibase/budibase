"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tryGetPreviewData = tryGetPreviewData;
exports.parseBody = parseBody;
exports.apiResolver = apiResolver;
var _jsonwebtoken = _interopRequireDefault(require("next/dist/compiled/jsonwebtoken"));
var _cryptoUtils = require("../crypto-utils");
var _etag = _interopRequireDefault(require("next/dist/compiled/etag"));
var _sendPayload = require("../send-payload");
var _stream = require("stream");
var _contentType = require("next/dist/compiled/content-type");
var _isError = _interopRequireDefault(require("../../lib/is-error"));
var _utils = require("../../shared/lib/utils");
var _interopDefault = require("../../lib/interop-default");
var _index = require("./index");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function tryGetPreviewData(req, res, options) {
    // Read cached preview data if present
    if (_index.SYMBOL_PREVIEW_DATA in req) {
        return req[_index.SYMBOL_PREVIEW_DATA];
    }
    const getCookies = (0, _index).getCookieParser(req.headers);
    let cookies;
    try {
        cookies = getCookies();
    } catch  {
        // TODO: warn
        return false;
    }
    const hasBypass = _index.COOKIE_NAME_PRERENDER_BYPASS in cookies;
    const hasData = _index.COOKIE_NAME_PRERENDER_DATA in cookies;
    // Case: neither cookie is set.
    if (!(hasBypass || hasData)) {
        return false;
    }
    // Case: one cookie is set, but not the other.
    if (hasBypass !== hasData) {
        (0, _index).clearPreviewData(res);
        return false;
    }
    // Case: preview session is for an old build.
    if (cookies[_index.COOKIE_NAME_PRERENDER_BYPASS] !== options.previewModeId) {
        (0, _index).clearPreviewData(res);
        return false;
    }
    const tokenPreviewData = cookies[_index.COOKIE_NAME_PRERENDER_DATA];
    let encryptedPreviewData;
    try {
        encryptedPreviewData = _jsonwebtoken.default.verify(tokenPreviewData, options.previewModeSigningKey);
    } catch  {
        // TODO: warn
        (0, _index).clearPreviewData(res);
        return false;
    }
    const decryptedPreviewData = (0, _cryptoUtils).decryptWithSecret(Buffer.from(options.previewModeEncryptionKey), encryptedPreviewData.data);
    try {
        // TODO: strict runtime type checking
        const data = JSON.parse(decryptedPreviewData);
        // Cache lookup
        Object.defineProperty(req, _index.SYMBOL_PREVIEW_DATA, {
            value: data,
            enumerable: false
        });
        return data;
    } catch  {
        return false;
    }
}
async function parseBody(req, limit) {
    let contentType;
    try {
        contentType = (0, _contentType).parse(req.headers['content-type'] || 'text/plain');
    } catch  {
        contentType = (0, _contentType).parse('text/plain');
    }
    const { type , parameters  } = contentType;
    const encoding = parameters.charset || 'utf-8';
    let buffer;
    try {
        const getRawBody = require('next/dist/compiled/raw-body');
        buffer = await getRawBody(req, {
            encoding,
            limit
        });
    } catch (e) {
        if ((0, _isError).default(e) && e.type === 'entity.too.large') {
            throw new _index.ApiError(413, `Body exceeded ${limit} limit`);
        } else {
            throw new _index.ApiError(400, 'Invalid body');
        }
    }
    const body = buffer.toString();
    if (type === 'application/json' || type === 'application/ld+json') {
        return parseJson(body);
    } else if (type === 'application/x-www-form-urlencoded') {
        const qs = require('querystring');
        return qs.decode(body);
    } else {
        return body;
    }
}
async function apiResolver(req, res, query, resolverModule, apiContext, propagateError, dev, page) {
    const apiReq = req;
    const apiRes = res;
    try {
        var ref, ref1;
        if (!resolverModule) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        const config = resolverModule.config || {
        };
        const bodyParser = ((ref = config.api) === null || ref === void 0 ? void 0 : ref.bodyParser) !== false;
        const externalResolver = ((ref1 = config.api) === null || ref1 === void 0 ? void 0 : ref1.externalResolver) || false;
        // Parsing of cookies
        (0, _index).setLazyProp({
            req: apiReq
        }, 'cookies', (0, _index).getCookieParser(req.headers));
        // Parsing query string
        apiReq.query = query;
        // Parsing preview data
        (0, _index).setLazyProp({
            req: apiReq
        }, 'previewData', ()=>tryGetPreviewData(req, res, apiContext)
        );
        // Checking if preview mode is enabled
        (0, _index).setLazyProp({
            req: apiReq
        }, 'preview', ()=>apiReq.previewData !== false ? true : undefined
        );
        // Parsing of body
        if (bodyParser && !apiReq.body) {
            apiReq.body = await parseBody(apiReq, config.api && config.api.bodyParser && config.api.bodyParser.sizeLimit ? config.api.bodyParser.sizeLimit : '1mb');
        }
        let contentLength = 0;
        const writeData = apiRes.write;
        const endResponse = apiRes.end;
        apiRes.write = (...args)=>{
            contentLength += Buffer.byteLength(args[0] || '');
            return writeData.apply(apiRes, args);
        };
        apiRes.end = (...args)=>{
            if (args.length && typeof args[0] !== 'function') {
                contentLength += Buffer.byteLength(args[0] || '');
            }
            if (contentLength >= 4 * 1024 * 1024) {
                console.warn(`API response for ${req.url} exceeds 4MB. This will cause the request to fail in a future version. https://nextjs.org/docs/messages/api-routes-body-size-limit`);
            }
            endResponse.apply(apiRes, args);
        };
        apiRes.status = (statusCode)=>(0, _index).sendStatusCode(apiRes, statusCode)
        ;
        apiRes.send = (data)=>sendData(apiReq, apiRes, data)
        ;
        apiRes.json = (data)=>sendJson(apiRes, data)
        ;
        apiRes.redirect = (statusOrUrl, url)=>(0, _index).redirect(apiRes, statusOrUrl, url)
        ;
        apiRes.setPreviewData = (data, options = {
        })=>setPreviewData(apiRes, data, Object.assign({
            }, apiContext, options))
        ;
        apiRes.clearPreviewData = ()=>(0, _index).clearPreviewData(apiRes)
        ;
        apiRes.unstable_revalidate = (urlPath)=>unstable_revalidate(urlPath, req, apiContext)
        ;
        const resolver = (0, _interopDefault).interopDefault(resolverModule);
        let wasPiped = false;
        if (process.env.NODE_ENV !== 'production') {
            // listen for pipe event and don't show resolve warning
            res.once('pipe', ()=>wasPiped = true
            );
        }
        // Call API route method
        await resolver(req, res);
        if (process.env.NODE_ENV !== 'production' && !externalResolver && !(0, _utils).isResSent(res) && !wasPiped) {
            console.warn(`API resolved without sending a response for ${req.url}, this may result in stalled requests.`);
        }
    } catch (err) {
        if (err instanceof _index.ApiError) {
            (0, _index).sendError(apiRes, err.statusCode, err.message);
        } else {
            if (dev) {
                if ((0, _isError).default(err)) {
                    err.page = page;
                }
                throw err;
            }
            console.error(err);
            if (propagateError) {
                throw err;
            }
            (0, _index).sendError(apiRes, 500, 'Internal Server Error');
        }
    }
}
async function unstable_revalidate(urlPath, req, context) {
    if (!context.trustHostHeader && (!context.hostname || !context.port)) {
        throw new Error(`"hostname" and "port" must be provided when starting next to use "unstable_revalidate". See more here https://nextjs.org/docs/advanced-features/custom-server`);
    }
    if (typeof urlPath !== 'string' || !urlPath.startsWith('/')) {
        throw new Error(`Invalid urlPath provided to revalidate(), must be a path e.g. /blog/post-1, received ${urlPath}`);
    }
    const baseUrl = context.trustHostHeader ? `https://${req.headers.host}` : `http://${context.hostname}:${context.port}`;
    const extraHeaders = {
    };
    if (context.trustHostHeader) {
        extraHeaders.cookie = req.headers.cookie;
    }
    try {
        const res = await fetch(`${baseUrl}${urlPath}`, {
            headers: {
                [_index.PRERENDER_REVALIDATE_HEADER]: context.previewModeId,
                ...extraHeaders
            }
        });
        if (!res.ok) {
            throw new Error(`Invalid response ${res.status}`);
        }
    } catch (err) {
        throw new Error(`Failed to revalidate ${urlPath}`);
    }
}
/**
 * Parse `JSON` and handles invalid `JSON` strings
 * @param str `JSON` string
 */ function parseJson(str) {
    if (str.length === 0) {
        // special-case empty json body, as it's a common client-side mistake
        return {
        };
    }
    try {
        return JSON.parse(str);
    } catch (e) {
        throw new _index.ApiError(400, 'Invalid JSON');
    }
}
/**
 * Send `any` body to response
 * @param req request object
 * @param res response object
 * @param body of response
 */ function sendData(req, res, body) {
    if (body === null || body === undefined) {
        res.end();
        return;
    }
    // strip irrelevant headers/body
    if (res.statusCode === 204 || res.statusCode === 304) {
        res.removeHeader('Content-Type');
        res.removeHeader('Content-Length');
        res.removeHeader('Transfer-Encoding');
        if (process.env.NODE_ENV === 'development' && body) {
            console.warn(`A body was attempted to be set with a 204 statusCode for ${req.url}, this is invalid and the body was ignored.\n` + `See more info here https://nextjs.org/docs/messages/invalid-api-status-body`);
        }
        res.end();
        return;
    }
    const contentType = res.getHeader('Content-Type');
    if (body instanceof _stream.Stream) {
        if (!contentType) {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        body.pipe(res);
        return;
    }
    const isJSONLike = [
        'object',
        'number',
        'boolean'
    ].includes(typeof body);
    const stringifiedBody = isJSONLike ? JSON.stringify(body) : body;
    const etag = (0, _etag).default(stringifiedBody);
    if ((0, _sendPayload).sendEtagResponse(req, res, etag)) {
        return;
    }
    if (Buffer.isBuffer(body)) {
        if (!contentType) {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        res.setHeader('Content-Length', body.length);
        res.end(body);
        return;
    }
    if (isJSONLike) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.setHeader('Content-Length', Buffer.byteLength(stringifiedBody));
    res.end(stringifiedBody);
}
/**
 * Send `JSON` object
 * @param res response object
 * @param jsonBody of data
 */ function sendJson(res, jsonBody) {
    // Set header to application/json
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    // Use send to handle request
    res.send(jsonBody);
}
function isNotValidData(str) {
    return typeof str !== 'string' || str.length < 16;
}
function setPreviewData(res, data, options) {
    if (isNotValidData(options.previewModeId)) {
        throw new Error('invariant: invalid previewModeId');
    }
    if (isNotValidData(options.previewModeEncryptionKey)) {
        throw new Error('invariant: invalid previewModeEncryptionKey');
    }
    if (isNotValidData(options.previewModeSigningKey)) {
        throw new Error('invariant: invalid previewModeSigningKey');
    }
    const payload = _jsonwebtoken.default.sign({
        data: (0, _cryptoUtils).encryptWithSecret(Buffer.from(options.previewModeEncryptionKey), JSON.stringify(data))
    }, options.previewModeSigningKey, {
        algorithm: 'HS256',
        ...options.maxAge !== undefined ? {
            expiresIn: options.maxAge
        } : undefined
    });
    // limit preview mode cookie to 2KB since we shouldn't store too much
    // data here and browsers drop cookies over 4KB
    if (payload.length > 2048) {
        throw new Error(`Preview data is limited to 2KB currently, reduce how much data you are storing as preview data to continue`);
    }
    const { serialize  } = require('next/dist/compiled/cookie');
    const previous = res.getHeader('Set-Cookie');
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === 'string' ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(_index.COOKIE_NAME_PRERENDER_BYPASS, options.previewModeId, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
            secure: process.env.NODE_ENV !== 'development',
            path: '/',
            ...options.maxAge !== undefined ? {
                maxAge: options.maxAge
            } : undefined
        }),
        serialize(_index.COOKIE_NAME_PRERENDER_DATA, payload, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
            secure: process.env.NODE_ENV !== 'development',
            path: '/',
            ...options.maxAge !== undefined ? {
                maxAge: options.maxAge
            } : undefined
        }), 
    ]);
    return res;
}

//# sourceMappingURL=node.js.map