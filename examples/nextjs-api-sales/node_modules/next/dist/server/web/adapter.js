"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.adapter = adapter;
var _error = require("./error");
var _utils = require("./utils");
var _fetchEvent = require("./spec-extension/fetch-event");
var _request = require("./spec-extension/request");
var _response = require("./spec-extension/response");
var _fetchEvent1 = require("./spec-compliant/fetch-event");
async function adapter(params) {
    const request = new NextRequestHint({
        page: params.page,
        input: params.request.url,
        init: {
            geo: params.request.geo,
            headers: (0, _utils).fromNodeHeaders(params.request.headers),
            ip: params.request.ip,
            method: params.request.method,
            nextConfig: params.request.nextConfig,
            page: params.request.page
        }
    });
    const event = new _fetchEvent.NextFetchEvent({
        request,
        page: params.page
    });
    const original = await params.handler(request, event);
    return {
        response: original || _response.NextResponse.next(),
        waitUntil: Promise.all(event[_fetchEvent1.waitUntilSymbol])
    };
}
class NextRequestHint extends _request.NextRequest {
    constructor(params){
        super(params.input, params.init);
        this.sourcePage = params.page;
    }
    get request() {
        throw new _error.DeprecationError({
            page: this.sourcePage
        });
    }
    respondWith() {
        throw new _error.DeprecationError({
            page: this.sourcePage
        });
    }
    waitUntil() {
        throw new _error.DeprecationError({
            page: this.sourcePage
        });
    }
}

//# sourceMappingURL=adapter.js.map