"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _renderResult = _interopRequireDefault(require("./render-result"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class ResponseCache {
    constructor(incrementalCache){
        this.incrementalCache = incrementalCache;
        this.pendingResponses = new Map();
    }
    get(key, responseGenerator, context) {
        const pendingResponse = key ? this.pendingResponses.get(key) : null;
        if (pendingResponse) {
            return pendingResponse;
        }
        let resolver = ()=>{
        };
        let rejecter = ()=>{
        };
        const promise = new Promise((resolve, reject)=>{
            resolver = resolve;
            rejecter = reject;
        });
        if (key) {
            this.pendingResponses.set(key, promise);
        }
        let resolved = false;
        const resolve = (cacheEntry)=>{
            if (key) {
                // Ensure all reads from the cache get the latest value.
                this.pendingResponses.set(key, Promise.resolve(cacheEntry));
            }
            if (!resolved) {
                resolved = true;
                resolver(cacheEntry);
            }
        };
        (async ()=>{
            try {
                const cachedResponse = key ? await this.incrementalCache.get(key) : null;
                if (cachedResponse && !context.isManualRevalidate) {
                    var ref;
                    resolve({
                        isStale: cachedResponse.isStale,
                        revalidate: cachedResponse.curRevalidate,
                        value: ((ref = cachedResponse.value) === null || ref === void 0 ? void 0 : ref.kind) === 'PAGE' ? {
                            kind: 'PAGE',
                            html: _renderResult.default.fromStatic(cachedResponse.value.html),
                            pageData: cachedResponse.value.pageData
                        } : cachedResponse.value
                    });
                    if (!cachedResponse.isStale) {
                        // The cached value is still valid, so we don't need
                        // to update it yet.
                        return;
                    }
                }
                const cacheEntry = await responseGenerator(resolved, !!cachedResponse);
                resolve(cacheEntry === null ? null : {
                    ...cacheEntry,
                    isMiss: !cachedResponse
                });
                if (key && cacheEntry && typeof cacheEntry.revalidate !== 'undefined') {
                    var ref;
                    await this.incrementalCache.set(key, ((ref = cacheEntry.value) === null || ref === void 0 ? void 0 : ref.kind) === 'PAGE' ? {
                        kind: 'PAGE',
                        html: cacheEntry.value.html.toUnchunkedString(),
                        pageData: cacheEntry.value.pageData
                    } : cacheEntry.value, cacheEntry.revalidate);
                }
            } catch (err) {
                // while revalidating in the background we can't reject as
                // we already resolved the cache entry so log the error here
                if (resolved) {
                    console.error(err);
                } else {
                    rejecter(err);
                }
            } finally{
                if (key) {
                    this.pendingResponses.delete(key);
                }
            }
        })();
        return promise;
    }
}
exports.default = ResponseCache;

//# sourceMappingURL=response-cache.js.map