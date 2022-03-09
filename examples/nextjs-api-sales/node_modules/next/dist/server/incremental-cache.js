"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _lruCache = _interopRequireDefault(require("next/dist/compiled/lru-cache"));
var _path = _interopRequireDefault(require("path"));
var _normalizePagePath = require("./normalize-page-path");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function toRoute(pathname) {
    return pathname.replace(/\/$/, '').replace(/\/index$/, '') || '/';
}
class IncrementalCache {
    constructor({ fs , max , dev , distDir , pagesDir , flushToDisk , locales , getPrerenderManifest  }){
        this.fs = fs;
        this.incrementalOptions = {
            dev,
            distDir,
            pagesDir,
            flushToDisk: !dev && (typeof flushToDisk !== 'undefined' ? flushToDisk : true)
        };
        this.locales = locales;
        this.prerenderManifest = getPrerenderManifest();
        if (process.env.__NEXT_TEST_MAX_ISR_CACHE) {
            // Allow cache size to be overridden for testing purposes
            max = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10);
        }
        if (max) {
            this.cache = new _lruCache.default({
                max,
                length ({ value  }) {
                    if (!value) {
                        return 25;
                    } else if (value.kind === 'REDIRECT') {
                        return JSON.stringify(value.props).length;
                    } else if (value.kind === 'IMAGE') {
                        throw new Error('invariant image should not be incremental-cache');
                    }
                    // rough estimate of size of cache value
                    return value.html.length + JSON.stringify(value.pageData).length;
                }
            });
        }
    }
    getSeedPath(pathname, ext) {
        return _path.default.join(this.incrementalOptions.pagesDir, `${pathname}.${ext}`);
    }
    calculateRevalidate(pathname, fromTime) {
        pathname = toRoute(pathname);
        // in development we don't have a prerender-manifest
        // and default to always revalidating to allow easier debugging
        if (this.incrementalOptions.dev) return new Date().getTime() - 1000;
        const { initialRevalidateSeconds  } = this.prerenderManifest.routes[pathname] || {
            initialRevalidateSeconds: 1
        };
        const revalidateAfter = typeof initialRevalidateSeconds === 'number' ? initialRevalidateSeconds * 1000 + fromTime : initialRevalidateSeconds;
        return revalidateAfter;
    }
    getFallback(page) {
        page = (0, _normalizePagePath).normalizePagePath(page);
        return this.fs.readFile(this.getSeedPath(page, 'html'));
    }
    // get data from cache if available
    async get(pathname) {
        if (this.incrementalOptions.dev) return null;
        pathname = (0, _normalizePagePath).normalizePagePath(pathname);
        let data = this.cache && this.cache.get(pathname);
        // let's check the disk for seed data
        if (!data) {
            if (this.prerenderManifest.notFoundRoutes.includes(pathname)) {
                const now = Date.now();
                const revalidateAfter = this.calculateRevalidate(pathname, now);
                data = {
                    value: null,
                    revalidateAfter: revalidateAfter !== false ? now : false
                };
            }
            try {
                const htmlPath = this.getSeedPath(pathname, 'html');
                const jsonPath = this.getSeedPath(pathname, 'json');
                const html = await this.fs.readFile(htmlPath);
                const pageData = JSON.parse(await this.fs.readFile(jsonPath));
                const { mtime  } = await this.fs.stat(htmlPath);
                data = {
                    revalidateAfter: this.calculateRevalidate(pathname, mtime.getTime()),
                    value: {
                        kind: 'PAGE',
                        html,
                        pageData
                    }
                };
                if (this.cache) {
                    this.cache.set(pathname, data);
                }
            } catch (_) {
            // unable to get data from disk
            }
        }
        if (!data) {
            return null;
        }
        if (data && data.revalidateAfter !== false && data.revalidateAfter < new Date().getTime()) {
            data.isStale = true;
        }
        const manifestPath = toRoute(pathname);
        const manifestEntry = this.prerenderManifest.routes[manifestPath];
        if (data && manifestEntry) {
            data.curRevalidate = manifestEntry.initialRevalidateSeconds;
        }
        return data;
    }
    // populate the incremental cache with new data
    async set(pathname, data, revalidateSeconds) {
        if (this.incrementalOptions.dev) return;
        if (typeof revalidateSeconds !== 'undefined') {
            // TODO: Update this to not mutate the manifest from the
            // build.
            this.prerenderManifest.routes[pathname] = {
                dataRoute: _path.default.posix.join('/_next/data', `${(0, _normalizePagePath).normalizePagePath(pathname)}.json`),
                srcRoute: null,
                initialRevalidateSeconds: revalidateSeconds
            };
        }
        pathname = (0, _normalizePagePath).normalizePagePath(pathname);
        if (this.cache) {
            this.cache.set(pathname, {
                revalidateAfter: this.calculateRevalidate(pathname, new Date().getTime()),
                value: data
            });
        }
        // TODO: This option needs to cease to exist unless it stops mutating the
        // `next build` output's manifest.
        if (this.incrementalOptions.flushToDisk && (data === null || data === void 0 ? void 0 : data.kind) === 'PAGE') {
            try {
                const seedHtmlPath = this.getSeedPath(pathname, 'html');
                const seedJsonPath = this.getSeedPath(pathname, 'json');
                await this.fs.mkdir(_path.default.dirname(seedHtmlPath));
                await this.fs.writeFile(seedHtmlPath, data.html);
                await this.fs.writeFile(seedJsonPath, JSON.stringify(data.pageData));
            } catch (error) {
                // failed to flush to disk
                console.warn('Failed to update prerender files for', pathname, error);
            }
        }
    }
}
exports.IncrementalCache = IncrementalCache;

//# sourceMappingURL=incremental-cache.js.map