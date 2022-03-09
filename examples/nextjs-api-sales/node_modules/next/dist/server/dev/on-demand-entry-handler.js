"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onDemandEntryHandler;
exports.entries = exports.BUILT = exports.BUILDING = exports.ADDED = void 0;
var _events = require("events");
var _path = require("path");
var _normalizePagePath = require("../normalize-page-path");
var _require = require("../require");
var _findPageFile = require("../lib/find-page-file");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../get-route-from-entrypoint"));
var _constants = require("../../lib/constants");
var _output = require("../../build/output");
var _utils = require("../../build/utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ADDED = Symbol('added');
exports.ADDED = ADDED;
const BUILDING = Symbol('building');
exports.BUILDING = BUILDING;
const BUILT = Symbol('built');
exports.BUILT = BUILT;
const entries = {
};
exports.entries = entries;
function onDemandEntryHandler(watcher, multiCompiler, { pagesDir , nextConfig , maxInactiveAge , pagesBufferLength  }) {
    const { compilers  } = multiCompiler;
    const invalidator = new Invalidator(watcher, multiCompiler);
    let lastClientAccessPages = [
        ''
    ];
    let doneCallbacks = new _events.EventEmitter();
    for (const compiler of compilers){
        compiler.hooks.make.tap('NextJsOnDemandEntries', (_compilation)=>{
            invalidator.startBuilding();
        });
    }
    function getPagePathsFromEntrypoints(type, entrypoints) {
        const pagePaths = [];
        for (const entrypoint of entrypoints.values()){
            const page = (0, _getRouteFromEntrypoint).default(entrypoint.name);
            if (page) {
                pagePaths.push(`${type}${page}`);
            }
        }
        return pagePaths;
    }
    multiCompiler.hooks.done.tap('NextJsOnDemandEntries', (multiStats)=>{
        if (invalidator.rebuildAgain) {
            return invalidator.doneBuilding();
        }
        const [clientStats, serverStats, edgeServerStats] = multiStats.stats;
        const pagePaths = [
            ...getPagePathsFromEntrypoints('client', clientStats.compilation.entrypoints),
            ...getPagePathsFromEntrypoints('server', serverStats.compilation.entrypoints),
            ...edgeServerStats ? getPagePathsFromEntrypoints('edge-server', edgeServerStats.compilation.entrypoints) : [], 
        ];
        for (const page of pagePaths){
            const entry = entries[page];
            if (!entry) {
                continue;
            }
            if (entry.status !== BUILDING) {
                continue;
            }
            entry.status = BUILT;
            doneCallbacks.emit(page);
        }
        invalidator.doneBuilding();
    });
    const pingIntervalTime = Math.max(1000, Math.min(5000, maxInactiveAge));
    const disposeHandler = setInterval(function() {
        disposeInactiveEntries(watcher, lastClientAccessPages, maxInactiveAge);
    }, pingIntervalTime + 1000);
    disposeHandler.unref();
    function handlePing(pg) {
        const page = (0, _normalizePagePath).normalizePathSep(pg);
        const pageKey = `client${page}`;
        const entryInfo = entries[pageKey];
        let toSend;
        // If there's no entry, it may have been invalidated and needs to be re-built.
        if (!entryInfo) {
            // if (page !== lastEntry) client pings, but there's no entry for page
            return {
                invalid: true
            };
        }
        // 404 is an on demand entry but when a new page is added we have to refresh the page
        if (page === '/_error') {
            toSend = {
                invalid: true
            };
        } else {
            toSend = {
                success: true
            };
        }
        // We don't need to maintain active state of anything other than BUILT entries
        if (entryInfo.status !== BUILT) return;
        // If there's an entryInfo
        if (!lastClientAccessPages.includes(pageKey)) {
            lastClientAccessPages.unshift(pageKey);
            // Maintain the buffer max length
            if (lastClientAccessPages.length > pagesBufferLength) {
                lastClientAccessPages.pop();
            }
        }
        entryInfo.lastActiveTime = Date.now();
        entryInfo.dispose = false;
        return toSend;
    }
    return {
        async ensurePage (page, clientOnly) {
            let normalizedPagePath;
            try {
                normalizedPagePath = (0, _normalizePagePath).normalizePagePath(page);
            } catch (err) {
                console.error(err);
                throw (0, _require).pageNotFoundError(page);
            }
            let pagePath = await (0, _findPageFile).findPageFile(pagesDir, normalizedPagePath, nextConfig.pageExtensions);
            // Default the /_error route to the Next.js provided default page
            if (page === '/_error' && pagePath === null) {
                pagePath = 'next/dist/pages/_error';
            }
            if (pagePath === null) {
                throw (0, _require).pageNotFoundError(normalizedPagePath);
            }
            let bundlePath;
            let absolutePagePath;
            if (pagePath.startsWith('next/dist/pages/')) {
                bundlePath = page;
                absolutePagePath = require.resolve(pagePath);
            } else {
                let pageUrl = pagePath.replace(/\\/g, '/');
                pageUrl = `${pageUrl[0] !== '/' ? '/' : ''}${pageUrl.replace(new RegExp(`\\.+(?:${nextConfig.pageExtensions.join('|')})$`), '').replace(/\/index$/, '')}`;
                pageUrl = pageUrl === '' ? '/' : pageUrl;
                const bundleFile = (0, _normalizePagePath).normalizePagePath(pageUrl);
                bundlePath = _path.posix.join('pages', bundleFile);
                absolutePagePath = (0, _path).join(pagesDir, pagePath);
                page = _path.posix.normalize(pageUrl);
            }
            const normalizedPage = (0, _normalizePagePath).normalizePathSep(page);
            const isMiddleware = normalizedPage.match(_constants.MIDDLEWARE_ROUTE);
            const isApiRoute = normalizedPage.match(_constants.API_ROUTE) && !isMiddleware;
            const isEdgeServer = nextConfig.experimental.runtime === 'edge';
            const isCustomError = (0, _utils).isCustomErrorPage(page);
            let entriesChanged = false;
            const addPageEntry = (type)=>{
                return new Promise((resolve, reject)=>{
                    // Makes sure the page that is being kept in on-demand-entries matches the webpack output
                    const pageKey = `${type}${page}`;
                    const entryInfo = entries[pageKey];
                    if (entryInfo) {
                        entryInfo.lastActiveTime = Date.now();
                        entryInfo.dispose = false;
                        if (entryInfo.status === BUILT) {
                            resolve();
                            return;
                        }
                        doneCallbacks.once(pageKey, handleCallback);
                        return;
                    }
                    entriesChanged = true;
                    entries[pageKey] = {
                        bundlePath,
                        absolutePagePath,
                        status: ADDED,
                        lastActiveTime: Date.now(),
                        dispose: false
                    };
                    doneCallbacks.once(pageKey, handleCallback);
                    function handleCallback(err) {
                        if (err) return reject(err);
                        resolve();
                    }
                });
            };
            const isClientOrMiddleware = clientOnly || isMiddleware;
            const promise = isApiRoute ? addPageEntry('server') : isClientOrMiddleware ? addPageEntry('client') : Promise.all([
                addPageEntry('client'),
                addPageEntry(isEdgeServer && !isCustomError ? 'edge-server' : 'server'), 
            ]);
            if (entriesChanged) {
                (0, _output).reportTrigger(isApiRoute || isMiddleware || clientOnly ? normalizedPage : `${normalizedPage} (client and server)`);
                invalidator.invalidate();
            }
            return promise;
        },
        onHMR (client) {
            client.addEventListener('message', ({ data  })=>{
                data = typeof data !== 'string' ? data.toString() : data;
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.event === 'ping') {
                        const result = handlePing(parsedData.page);
                        client.send(JSON.stringify({
                            ...result,
                            event: 'pong'
                        }));
                    }
                } catch (_) {
                }
            });
        }
    };
}
function disposeInactiveEntries(_watcher, lastClientAccessPages, maxInactiveAge) {
    Object.keys(entries).forEach((page)=>{
        const { lastActiveTime , status , dispose  } = entries[page];
        // Skip pages already scheduled for disposing
        if (dispose) return;
        // This means this entry is currently building or just added
        // We don't need to dispose those entries.
        if (status !== BUILT) return;
        // We should not build the last accessed page even we didn't get any pings
        // Sometimes, it's possible our XHR ping to wait before completing other requests.
        // In that case, we should not dispose the current viewing page
        if (lastClientAccessPages.includes(page)) return;
        if (lastActiveTime && Date.now() - lastActiveTime > maxInactiveAge) {
            entries[page].dispose = true;
        }
    });
}
// Make sure only one invalidation happens at a time
// Otherwise, webpack hash gets changed and it'll force the client to reload.
class Invalidator {
    constructor(watcher, multiCompiler){
        this.multiCompiler = multiCompiler;
        this.watcher = watcher;
        // contains an array of types of compilers currently building
        this.building = false;
        this.rebuildAgain = false;
    }
    invalidate() {
        // If there's a current build is processing, we won't abort it by invalidating.
        // (If aborted, it'll cause a client side hard reload)
        // But let it to invalidate just after the completion.
        // So, it can re-build the queued pages at once.
        if (this.building) {
            this.rebuildAgain = true;
            return;
        }
        this.building = true;
        this.watcher.invalidate();
    }
    startBuilding() {
        this.building = true;
    }
    doneBuilding() {
        this.building = false;
        if (this.rebuildAgain) {
            this.rebuildAgain = false;
            this.invalidate();
        }
    }
}

//# sourceMappingURL=on-demand-entry-handler.js.map