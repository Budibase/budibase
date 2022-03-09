"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasBasePath = hasBasePath;
exports.replaceBasePath = replaceBasePath;
exports.default = exports.route = void 0;
var _requestMeta = require("./request-meta");
var _pathMatch = _interopRequireDefault(require("../shared/lib/router/utils/path-match"));
var _normalizeTrailingSlash = require("../client/normalize-trailing-slash");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _prepareDestination = require("../shared/lib/router/utils/prepare-destination");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const route = (0, _pathMatch).default();
exports.route = route;
const customRouteTypes = new Set([
    'rewrite',
    'redirect',
    'header'
]);
function hasBasePath(pathname, basePath) {
    return typeof pathname === 'string' && (pathname === basePath || pathname.startsWith(basePath + '/'));
}
function replaceBasePath(pathname, basePath) {
    // ensure basePath is only stripped if it matches exactly
    // and doesn't contain extra chars e.g. basePath /docs
    // should replace for /docs, /docs/, /docs/a but not /docsss
    if (hasBasePath(pathname, basePath)) {
        pathname = pathname.substr(basePath.length);
        if (!pathname.startsWith('/')) pathname = `/${pathname}`;
    }
    return pathname;
}
class Router {
    constructor({ basePath ='' , headers =[] , fsRoutes =[] , rewrites ={
        beforeFiles: [],
        afterFiles: [],
        fallback: []
    } , redirects =[] , catchAllRoute , catchAllMiddleware , dynamicRoutes =[] , pageChecker , useFileSystemPublicRoutes , locales =[]  }){
        this.basePath = basePath;
        this.headers = headers;
        this.fsRoutes = fsRoutes;
        this.rewrites = rewrites;
        this.redirects = redirects;
        this.pageChecker = pageChecker;
        this.catchAllRoute = catchAllRoute;
        this.catchAllMiddleware = catchAllMiddleware;
        this.dynamicRoutes = dynamicRoutes;
        this.useFileSystemPublicRoutes = useFileSystemPublicRoutes;
        this.locales = locales;
        this.seenRequests = new Set();
    }
    setDynamicRoutes(routes = []) {
        this.dynamicRoutes = routes;
    }
    addFsRoute(fsRoute) {
        this.fsRoutes.unshift(fsRoute);
    }
    async execute(req, res, parsedUrl) {
        if (this.seenRequests.has(req)) {
            throw new Error(`Invariant: request has already been processed: ${req.url}, this is an internal error please open an issue.`);
        }
        this.seenRequests.add(req);
        // memoize page check calls so we don't duplicate checks for pages
        const pageChecks = {
        };
        const memoizedPageChecker = async (p)=>{
            p = (0, _normalizeLocalePath).normalizeLocalePath(p, this.locales).pathname;
            if (pageChecks[p] !== undefined) {
                return pageChecks[p];
            }
            const result = this.pageChecker(p);
            pageChecks[p] = result;
            return result;
        };
        let parsedUrlUpdated = parsedUrl;
        const applyCheckTrue = async (checkParsedUrl)=>{
            const originalFsPathname = checkParsedUrl.pathname;
            const fsPathname = replaceBasePath(originalFsPathname, this.basePath);
            for (const fsRoute of this.fsRoutes){
                const fsParams = fsRoute.match(fsPathname);
                if (fsParams) {
                    checkParsedUrl.pathname = fsPathname;
                    const fsResult = await fsRoute.fn(req, res, fsParams, checkParsedUrl);
                    if (fsResult.finished) {
                        return true;
                    }
                    checkParsedUrl.pathname = originalFsPathname;
                }
            }
            let matchedPage = await memoizedPageChecker(fsPathname);
            // If we didn't match a page check dynamic routes
            if (!matchedPage) {
                const normalizedFsPathname = (0, _normalizeLocalePath).normalizeLocalePath(fsPathname, this.locales).pathname;
                for (const dynamicRoute of this.dynamicRoutes){
                    if (dynamicRoute.match(normalizedFsPathname)) {
                        matchedPage = true;
                    }
                }
            }
            // Matched a page or dynamic route so render it using catchAllRoute
            if (matchedPage) {
                const pageParams = this.catchAllRoute.match(checkParsedUrl.pathname);
                checkParsedUrl.pathname = fsPathname;
                checkParsedUrl.query._nextBubbleNoFallback = '1';
                const result = await this.catchAllRoute.fn(req, res, pageParams, checkParsedUrl);
                return result.finished;
            }
        };
        /*
      Desired routes order
      - headers
      - redirects
      - Check filesystem (including pages), if nothing found continue
      - User rewrites (checking filesystem and pages each match)
    */ const allRoutes = [
            ...this.headers,
            ...this.redirects,
            ...this.rewrites.beforeFiles,
            ...this.useFileSystemPublicRoutes && this.catchAllMiddleware ? [
                this.catchAllMiddleware
            ] : [],
            ...this.fsRoutes,
            // We only check the catch-all route if public page routes hasn't been
            // disabled
            ...this.useFileSystemPublicRoutes ? [
                {
                    type: 'route',
                    name: 'page checker',
                    requireBasePath: false,
                    match: route('/:path*'),
                    fn: async (checkerReq, checkerRes, params, parsedCheckerUrl)=>{
                        let { pathname  } = parsedCheckerUrl;
                        pathname = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname || '/');
                        if (!pathname) {
                            return {
                                finished: false
                            };
                        }
                        if (await memoizedPageChecker(pathname)) {
                            return this.catchAllRoute.fn(checkerReq, checkerRes, params, parsedCheckerUrl);
                        }
                        return {
                            finished: false
                        };
                    }
                }, 
            ] : [],
            ...this.rewrites.afterFiles,
            ...this.rewrites.fallback.length ? [
                {
                    type: 'route',
                    name: 'dynamic route/page check',
                    requireBasePath: false,
                    match: route('/:path*'),
                    fn: async (_checkerReq, _checkerRes, _params, parsedCheckerUrl)=>{
                        return {
                            finished: await applyCheckTrue(parsedCheckerUrl)
                        };
                    }
                },
                ...this.rewrites.fallback, 
            ] : [],
            // We only check the catch-all route if public page routes hasn't been
            // disabled
            ...this.useFileSystemPublicRoutes ? [
                this.catchAllRoute
            ] : [], 
        ];
        const originallyHadBasePath = !this.basePath || (0, _requestMeta).getRequestMeta(req, '_nextHadBasePath');
        for (const testRoute of allRoutes){
            // if basePath is being used, the basePath will still be included
            // in the pathname here to allow custom-routes to require containing
            // it or not, filesystem routes and pages must always include the basePath
            // if it is set
            let currentPathname = parsedUrlUpdated.pathname;
            const originalPathname = currentPathname;
            const requireBasePath = testRoute.requireBasePath !== false;
            const isCustomRoute = customRouteTypes.has(testRoute.type);
            const isPublicFolderCatchall = testRoute.name === 'public folder catchall';
            const isMiddlewareCatchall = testRoute.name === 'middleware catchall';
            const keepBasePath = isCustomRoute || isPublicFolderCatchall || isMiddlewareCatchall;
            const keepLocale = isCustomRoute;
            const currentPathnameNoBasePath = replaceBasePath(currentPathname, this.basePath);
            if (!keepBasePath) {
                currentPathname = currentPathnameNoBasePath;
            }
            const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(currentPathnameNoBasePath, this.locales);
            const activeBasePath = keepBasePath ? this.basePath : '';
            if (keepLocale) {
                if (!testRoute.internal && parsedUrl.query.__nextLocale && !localePathResult.detectedLocale) {
                    currentPathname = `${activeBasePath}/${parsedUrl.query.__nextLocale}${currentPathnameNoBasePath === '/' ? '' : currentPathnameNoBasePath}`;
                }
                if ((0, _requestMeta).getRequestMeta(req, '__nextHadTrailingSlash') && !currentPathname.endsWith('/')) {
                    currentPathname += '/';
                }
            } else {
                currentPathname = `${(0, _requestMeta).getRequestMeta(req, '_nextHadBasePath') ? activeBasePath : ''}${activeBasePath && currentPathnameNoBasePath === '/' ? '' : currentPathnameNoBasePath}`;
            }
            let newParams = testRoute.match(currentPathname);
            if (testRoute.has && newParams) {
                const hasParams = (0, _prepareDestination).matchHas(req, testRoute.has, parsedUrlUpdated.query);
                if (hasParams) {
                    Object.assign(newParams, hasParams);
                } else {
                    newParams = false;
                }
            }
            // Check if the match function matched
            if (newParams) {
                // since we require basePath be present for non-custom-routes we
                // 404 here when we matched an fs route
                if (!keepBasePath) {
                    if (!originallyHadBasePath && !(0, _requestMeta).getRequestMeta(req, '_nextDidRewrite')) {
                        if (requireBasePath) {
                            // consider this a non-match so the 404 renders
                            this.seenRequests.delete(req);
                            return false;
                        }
                        continue;
                    }
                    parsedUrlUpdated.pathname = currentPathname;
                }
                const result = await testRoute.fn(req, res, newParams, parsedUrlUpdated);
                // The response was handled
                if (result.finished) {
                    this.seenRequests.delete(req);
                    return true;
                }
                // since the fs route didn't finish routing we need to re-add the
                // basePath to continue checking with the basePath present
                if (!keepBasePath) {
                    parsedUrlUpdated.pathname = originalPathname;
                }
                if (result.pathname) {
                    parsedUrlUpdated.pathname = result.pathname;
                }
                if (result.query) {
                    parsedUrlUpdated.query = {
                        ...(0, _requestMeta).getNextInternalQuery(parsedUrlUpdated.query),
                        ...result.query
                    };
                }
                // check filesystem
                if (testRoute.check === true) {
                    if (await applyCheckTrue(parsedUrlUpdated)) {
                        this.seenRequests.delete(req);
                        return true;
                    }
                }
            }
        }
        this.seenRequests.delete(req);
        return false;
    }
}
exports.default = Router;

//# sourceMappingURL=router.js.map