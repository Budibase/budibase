"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _error = require("../error");
var _fetchEvent = require("../spec-compliant/fetch-event");
class NextFetchEvent extends _fetchEvent.FetchEvent {
    constructor(params){
        super(params.request);
        this.sourcePage = params.page;
    }
    // @ts-ignore
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
}
exports.NextFetchEvent = NextFetchEvent;

//# sourceMappingURL=fetch-event.js.map