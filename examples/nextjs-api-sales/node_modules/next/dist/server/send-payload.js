"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setRevalidateHeaders = setRevalidateHeaders;
exports.sendRenderResult = sendRenderResult;
exports.sendEtagResponse = sendEtagResponse;
var _utils = require("../shared/lib/utils");
var _etag = _interopRequireDefault(require("next/dist/compiled/etag"));
var _fresh = _interopRequireDefault(require("next/dist/compiled/fresh"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function setRevalidateHeaders(res, options) {
    if (options.private || options.stateful) {
        if (options.private || !res.hasHeader('Cache-Control')) {
            res.setHeader('Cache-Control', `private, no-cache, no-store, max-age=0, must-revalidate`);
        }
    } else if (typeof options.revalidate === 'number') {
        if (options.revalidate < 1) {
            throw new Error(`invariant: invalid Cache-Control duration provided: ${options.revalidate} < 1`);
        }
        res.setHeader('Cache-Control', `s-maxage=${options.revalidate}, stale-while-revalidate`);
    } else if (options.revalidate === false) {
        res.setHeader('Cache-Control', `s-maxage=31536000, stale-while-revalidate`);
    }
}
async function sendRenderResult({ req , res , result , type , generateEtags , poweredByHeader , options  }) {
    if ((0, _utils).isResSent(res)) {
        return;
    }
    if (poweredByHeader && type === 'html') {
        res.setHeader('X-Powered-By', 'Next.js');
    }
    const payload = result.isDynamic() ? null : await result.toUnchunkedString();
    if (payload) {
        const etag = generateEtags ? (0, _etag).default(payload) : undefined;
        if (sendEtagResponse(req, res, etag)) {
            return;
        }
    }
    if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', type === 'json' ? 'application/json' : 'text/html; charset=utf-8');
    }
    if (payload) {
        res.setHeader('Content-Length', Buffer.byteLength(payload));
    }
    if (options != null) {
        setRevalidateHeaders(res, options);
    }
    if (req.method === 'HEAD') {
        res.end(null);
    } else if (payload) {
        res.end(payload);
    } else {
        await result.pipe(res);
    }
}
function sendEtagResponse(req, res, etag) {
    if (etag) {
        /**
     * The server generating a 304 response MUST generate any of the
     * following header fields that would have been sent in a 200 (OK)
     * response to the same request: Cache-Control, Content-Location, Date,
     * ETag, Expires, and Vary. https://tools.ietf.org/html/rfc7232#section-4.1
     */ res.setHeader('ETag', etag);
    }
    if ((0, _fresh).default(req.headers, {
        etag
    })) {
        res.statusCode = 304;
        res.end();
        return true;
    }
    return false;
}

//# sourceMappingURL=send-payload.js.map