"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _router = require("../shared/lib/router/router");
var _getAssetPathFromRoute = _interopRequireDefault(require("../shared/lib/router/utils/get-asset-path-from-route"));
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _parseRelativeUrl = require("../shared/lib/router/utils/parse-relative-url");
var _normalizeTrailingSlash = require("./normalize-trailing-slash");
var _routeLoader = require("./route-loader");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function normalizeRoute(route) {
    if (route[0] !== '/') {
        throw new Error(`Route name should start with a "/", got "${route}"`);
    }
    if (route === '/') return route;
    return route.replace(/\/$/, '');
}
class PageLoader {
    getPageList() {
        if (process.env.NODE_ENV === 'production') {
            return (0, _routeLoader).getClientBuildManifest().then((manifest)=>manifest.sortedPages
            );
        } else {
            if (window.__DEV_PAGES_MANIFEST) {
                return window.__DEV_PAGES_MANIFEST.pages;
            } else {
                if (!this.promisedDevPagesManifest) {
                    // TODO: Decide what should happen when fetching fails instead of asserting
                    // @ts-ignore
                    this.promisedDevPagesManifest = fetch(`${this.assetPrefix}/_next/static/development/_devPagesManifest.json`).then((res)=>res.json()
                    ).then((manifest)=>{
                        window.__DEV_PAGES_MANIFEST = manifest;
                        return manifest.pages;
                    }).catch((err)=>{
                        console.log(`Failed to fetch devPagesManifest`, err);
                    });
                }
                // TODO Remove this assertion as this could be undefined
                return this.promisedDevPagesManifest;
            }
        }
    }
    getMiddlewareList() {
        if (process.env.NODE_ENV === 'production') {
            return (0, _routeLoader).getMiddlewareManifest();
        } else {
            if (window.__DEV_MIDDLEWARE_MANIFEST) {
                return window.__DEV_MIDDLEWARE_MANIFEST;
            } else {
                if (!this.promisedMiddlewareManifest) {
                    // TODO: Decide what should happen when fetching fails instead of asserting
                    // @ts-ignore
                    this.promisedMiddlewareManifest = fetch(`${this.assetPrefix}/_next/static/${this.buildId}/_devMiddlewareManifest.json`).then((res)=>res.json()
                    ).then((manifest)=>{
                        window.__DEV_MIDDLEWARE_MANIFEST = manifest;
                        return manifest;
                    }).catch((err)=>{
                        console.log(`Failed to fetch _devMiddlewareManifest`, err);
                    });
                }
                // TODO Remove this assertion as this could be undefined
                return this.promisedMiddlewareManifest;
            }
        }
    }
    /**
   * @param {string} href the route href (file-system path)
   * @param {string} asPath the URL as shown in browser (virtual path); used for dynamic routes
   * @returns {string}
   */ getDataHref({ href , asPath , ssg , rsc , locale  }) {
        const { pathname: hrefPathname , query , search  } = (0, _parseRelativeUrl).parseRelativeUrl(href);
        const { pathname: asPathname  } = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
        const route = normalizeRoute(hrefPathname);
        const getHrefForSlug = (path)=>{
            if (rsc) {
                return path + search + (search ? `&` : '?') + '__flight__=1';
            }
            const dataRoute = (0, _getAssetPathFromRoute).default((0, _normalizeTrailingSlash).removePathTrailingSlash((0, _router).addLocale(path, locale)), '.json');
            return (0, _router).addBasePath(`/_next/data/${this.buildId}${dataRoute}${ssg ? '' : search}`);
        };
        const isDynamic = (0, _isDynamic).isDynamicRoute(route);
        const interpolatedRoute = isDynamic ? (0, _router).interpolateAs(hrefPathname, asPathname, query).result : '';
        return isDynamic ? interpolatedRoute && getHrefForSlug(interpolatedRoute) : getHrefForSlug(route);
    }
    /**
   * @param {string} route - the route (file-system path)
   */ _isSsg(route) {
        return this.promisedSsgManifest.then((manifest)=>manifest.has(route)
        );
    }
    loadPage(route) {
        return this.routeLoader.loadRoute(route).then((res)=>{
            if ('component' in res) {
                return {
                    page: res.component,
                    mod: res.exports,
                    styleSheets: res.styles.map((o)=>({
                            href: o.href,
                            text: o.content
                        })
                    )
                };
            }
            throw res.error;
        });
    }
    prefetch(route) {
        return this.routeLoader.prefetch(route);
    }
    constructor(buildId, assetPrefix){
        this.routeLoader = (0, _routeLoader).createRouteLoader(assetPrefix);
        this.buildId = buildId;
        this.assetPrefix = assetPrefix;
        this.promisedSsgManifest = new Promise((resolve)=>{
            if (window.__SSG_MANIFEST) {
                resolve(window.__SSG_MANIFEST);
            } else {
                window.__SSG_MANIFEST_CB = ()=>{
                    resolve(window.__SSG_MANIFEST);
                };
            }
        });
    }
}
exports.default = PageLoader;

//# sourceMappingURL=page-loader.js.map