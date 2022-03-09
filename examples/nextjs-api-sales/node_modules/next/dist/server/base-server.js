"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareServerlessUrl = prepareServerlessUrl;
Object.defineProperty(exports, "stringifyQuery", {
    enumerable: true,
    get: function() {
        return _serverRouteUtils.stringifyQuery;
    }
});
exports.default = void 0;
var _path = require("path");
var _querystring = require("querystring");
var _url = require("url");
var _loadCustomRoutes = require("../lib/load-custom-routes");
var _constants = require("../shared/lib/constants");
var _utils = require("../shared/lib/router/utils");
var _apiUtils = require("./api-utils");
var envConfig = _interopRequireWildcard(require("../shared/lib/runtime-config"));
var _utils1 = require("../shared/lib/utils");
var _utils2 = require("./utils");
var _router = _interopRequireWildcard(require("./router"));
var _sendPayload = require("./send-payload");
var _incrementalCache = require("./incremental-cache");
var _renderResult = _interopRequireDefault(require("./render-result"));
var _normalizeTrailingSlash = require("../client/normalize-trailing-slash");
var _getRouteFromAssetPath = _interopRequireDefault(require("../shared/lib/router/utils/get-route-from-asset-path"));
var _denormalizePagePath = require("./denormalize-page-path");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var Log = _interopRequireWildcard(require("../build/output/log"));
var _detectDomainLocale = require("../shared/lib/i18n/detect-domain-locale");
var _escapePathDelimiters = _interopRequireDefault(require("../shared/lib/router/utils/escape-path-delimiters"));
var _utils3 = require("../build/webpack/loaders/next-serverless-loader/utils");
var _responseCache = _interopRequireDefault(require("./response-cache"));
var _parseNextUrl = require("../shared/lib/router/utils/parse-next-url");
var _isError = _interopRequireWildcard(require("../lib/is-error"));
var _constants1 = require("../lib/constants");
var _requestMeta = require("./request-meta");
var _serverRouteUtils = require("./server-route-utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
class Server {
    constructor({ dir ='.' , quiet =false , conf , dev =false , minimalMode =false , customServer =true , hostname , port  }){
        var ref, ref1, ref2;
        this.customErrorNo404Warn = (0, _utils1).execOnce(()=>{
            Log.warn(`You have added a custom /_error page without a custom /404 page. This prevents the 404 page from being auto statically optimized.\nSee here for info: https://nextjs.org/docs/messages/custom-error-no-custom-404`);
        });
        this.dir = (0, _path).resolve(dir);
        this.quiet = quiet;
        this.loadEnvConfig({
            dev
        });
        // TODO: should conf be normalized to prevent missing
        // values from causing issues as this can be user provided
        this.nextConfig = conf;
        this.hostname = hostname;
        this.port = port;
        this.distDir = (0, _path).join(this.dir, this.nextConfig.distDir);
        this.publicDir = this.getPublicDir();
        this.hasStaticDir = !minimalMode && this.getHasStaticDir();
        // Only serverRuntimeConfig needs the default
        // publicRuntimeConfig gets it's default in client/index.js
        const { serverRuntimeConfig ={
        } , publicRuntimeConfig , assetPrefix , generateEtags ,  } = this.nextConfig;
        this.buildId = this.getBuildId();
        this.minimalMode = minimalMode || !!process.env.NEXT_PRIVATE_MINIMAL_MODE;
        const serverComponents = this.nextConfig.experimental.serverComponents;
        this.serverComponentManifest = serverComponents ? this.getServerComponentManifest() : undefined;
        this.renderOpts = {
            poweredByHeader: this.nextConfig.poweredByHeader,
            canonicalBase: this.nextConfig.amp.canonicalBase || '',
            buildId: this.buildId,
            generateEtags,
            previewProps: this.getPreviewProps(),
            customServer: customServer === true ? true : undefined,
            ampOptimizerConfig: (ref = this.nextConfig.experimental.amp) === null || ref === void 0 ? void 0 : ref.optimizer,
            basePath: this.nextConfig.basePath,
            images: this.nextConfig.images,
            optimizeFonts: !!this.nextConfig.optimizeFonts && !dev,
            fontManifest: this.nextConfig.optimizeFonts && !dev ? this.getFontManifest() : undefined,
            optimizeCss: this.nextConfig.experimental.optimizeCss,
            disableOptimizedLoading: this.nextConfig.experimental.runtime ? true : this.nextConfig.experimental.disableOptimizedLoading,
            domainLocales: (ref1 = this.nextConfig.i18n) === null || ref1 === void 0 ? void 0 : ref1.domains,
            distDir: this.distDir,
            runtime: this.nextConfig.experimental.runtime,
            serverComponents,
            crossOrigin: this.nextConfig.crossOrigin ? this.nextConfig.crossOrigin : undefined,
            reactRoot: this.nextConfig.experimental.reactRoot === true
        };
        // Only the `publicRuntimeConfig` key is exposed to the client side
        // It'll be rendered as part of __NEXT_DATA__ on the client side
        if (Object.keys(publicRuntimeConfig).length > 0) {
            this.renderOpts.runtimeConfig = publicRuntimeConfig;
        }
        // Initialize next/config with the environment configuration
        envConfig.setConfig({
            serverRuntimeConfig,
            publicRuntimeConfig
        });
        this.pagesManifest = this.getPagesManifest();
        this.middlewareManifest = this.getMiddlewareManifest();
        this.customRoutes = this.getCustomRoutes();
        this.router = new _router.default(this.generateRoutes());
        this.setAssetPrefix(assetPrefix);
        this.incrementalCache = new _incrementalCache.IncrementalCache({
            fs: this.getCacheFilesystem(),
            dev,
            distDir: this.distDir,
            pagesDir: (0, _path).join(this.distDir, this._isLikeServerless ? _constants.SERVERLESS_DIRECTORY : _constants.SERVER_DIRECTORY, 'pages'),
            locales: (ref2 = this.nextConfig.i18n) === null || ref2 === void 0 ? void 0 : ref2.locales,
            max: this.nextConfig.experimental.isrMemoryCacheSize,
            flushToDisk: !minimalMode && this.nextConfig.experimental.isrFlushToDisk,
            getPrerenderManifest: ()=>{
                if (dev) {
                    return {
                        version: -1,
                        routes: {
                        },
                        dynamicRoutes: {
                        },
                        notFoundRoutes: [],
                        preview: null
                    };
                } else {
                    return this.getPrerenderManifest();
                }
            }
        });
        this.responseCache = new _responseCache.default(this.incrementalCache);
    }
    logError(err) {
        if (this.quiet) return;
        console.error(err);
    }
    async handleRequest(req, res, parsedUrl) {
        try {
            var ref23, ref1, ref2, ref3, ref4, ref5;
            const urlParts = (req.url || '').split('?');
            const urlNoQuery = urlParts[0];
            if (urlNoQuery === null || urlNoQuery === void 0 ? void 0 : urlNoQuery.match(/(\\|\/\/)/)) {
                const cleanUrl = (0, _utils1).normalizeRepeatedSlashes(req.url);
                res.redirect(cleanUrl, 308).body(cleanUrl).send();
                return;
            }
            (0, _apiUtils).setLazyProp({
                req: req
            }, 'cookies', (0, _apiUtils).getCookieParser(req.headers));
            // Parse url if parsedUrl not provided
            if (!parsedUrl || typeof parsedUrl !== 'object') {
                parsedUrl = (0, _url).parse(req.url, true);
            }
            // Parse the querystring ourselves if the user doesn't handle querystring parsing
            if (typeof parsedUrl.query === 'string') {
                parsedUrl.query = (0, _querystring).parse(parsedUrl.query);
            }
            // When there are hostname and port we build an absolute URL
            const initUrl = this.hostname && this.port ? `http://${this.hostname}:${this.port}${req.url}` : req.url;
            (0, _requestMeta).addRequestMeta(req, '__NEXT_INIT_URL', initUrl);
            (0, _requestMeta).addRequestMeta(req, '__NEXT_INIT_QUERY', {
                ...parsedUrl.query
            });
            const url = (0, _parseNextUrl).parseNextUrl({
                headers: req.headers,
                nextConfig: this.nextConfig,
                url: (ref23 = req.url) === null || ref23 === void 0 ? void 0 : ref23.replace(/^\/+/, '/')
            });
            if (url.basePath) {
                req.url = (0, _router).replaceBasePath(req.url, this.nextConfig.basePath);
                (0, _requestMeta).addRequestMeta(req, '_nextHadBasePath', true);
            }
            if (this.minimalMode && req.headers['x-matched-path'] && typeof req.headers['x-matched-path'] === 'string') {
                var ref, ref21;
                const reqUrlIsDataUrl = (ref = req.url) === null || ref === void 0 ? void 0 : ref.includes('/_next/data');
                const matchedPathIsDataUrl = (ref21 = req.headers['x-matched-path']) === null || ref21 === void 0 ? void 0 : ref21.includes('/_next/data');
                const isDataUrl = reqUrlIsDataUrl || matchedPathIsDataUrl;
                let parsedPath = (0, _url).parse(isDataUrl ? req.url : req.headers['x-matched-path'], true);
                let matchedPathname = parsedPath.pathname;
                let matchedPathnameNoExt = isDataUrl ? matchedPathname.replace(/\.json$/, '') : matchedPathname;
                if (this.nextConfig.i18n) {
                    const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(matchedPathname || '/', this.nextConfig.i18n.locales);
                    if (localePathResult.detectedLocale) {
                        parsedUrl.query.__nextLocale = localePathResult.detectedLocale;
                    }
                }
                if (isDataUrl) {
                    matchedPathname = (0, _denormalizePagePath).denormalizePagePath(matchedPathname);
                    matchedPathnameNoExt = (0, _denormalizePagePath).denormalizePagePath(matchedPathnameNoExt);
                }
                const pageIsDynamic = (0, _utils).isDynamicRoute(matchedPathnameNoExt);
                const combinedRewrites = [];
                combinedRewrites.push(...this.customRoutes.rewrites.beforeFiles);
                combinedRewrites.push(...this.customRoutes.rewrites.afterFiles);
                combinedRewrites.push(...this.customRoutes.rewrites.fallback);
                const utils = (0, _utils3).getUtils({
                    pageIsDynamic,
                    page: matchedPathnameNoExt,
                    i18n: this.nextConfig.i18n,
                    basePath: this.nextConfig.basePath,
                    rewrites: combinedRewrites
                });
                try {
                    var ref43;
                    // ensure parsedUrl.pathname includes URL before processing
                    // rewrites or they won't match correctly
                    if (this.nextConfig.i18n && !((ref43 = url.locale) === null || ref43 === void 0 ? void 0 : ref43.path.detectedLocale)) {
                        var ref44;
                        parsedUrl.pathname = `/${(ref44 = url.locale) === null || ref44 === void 0 ? void 0 : ref44.locale}${parsedUrl.pathname}`;
                    }
                    utils.handleRewrites(req, parsedUrl);
                    // interpolate dynamic params and normalize URL if needed
                    if (pageIsDynamic) {
                        let params = {
                        };
                        Object.assign(parsedUrl.query, parsedPath.query);
                        const paramsResult = utils.normalizeDynamicRouteParams(parsedUrl.query);
                        if (paramsResult.hasValidParams) {
                            params = paramsResult.params;
                        } else if (req.headers['x-now-route-matches']) {
                            const opts = {
                            };
                            params = utils.getParamsFromRouteMatches(req, opts, parsedUrl.query.__nextLocale || '');
                            if (opts.locale) {
                                parsedUrl.query.__nextLocale = opts.locale;
                            }
                        } else {
                            params = utils.dynamicRouteMatcher(matchedPathnameNoExt);
                        }
                        if (params) {
                            if (!paramsResult.hasValidParams) {
                                params = utils.normalizeDynamicRouteParams(params).params;
                            }
                            matchedPathname = utils.interpolateDynamicPath(matchedPathname, params);
                            req.url = utils.interpolateDynamicPath(req.url, params);
                        }
                        if (reqUrlIsDataUrl && matchedPathIsDataUrl) {
                            req.url = (0, _url).format({
                                ...parsedPath,
                                pathname: matchedPathname
                            });
                        }
                        Object.assign(parsedUrl.query, params);
                        utils.normalizeVercelUrl(req, true);
                    }
                } catch (err) {
                    if (err instanceof _utils1.DecodeError) {
                        res.statusCode = 400;
                        return this.renderError(null, req, res, '/_error', {
                        });
                    }
                    throw err;
                }
                parsedUrl.pathname = `${this.nextConfig.basePath || ''}${matchedPathname === '/' && this.nextConfig.basePath ? '' : matchedPathname}`;
                url.pathname = parsedUrl.pathname;
            }
            (0, _requestMeta).addRequestMeta(req, '__nextHadTrailingSlash', (ref1 = url.locale) === null || ref1 === void 0 ? void 0 : ref1.trailingSlash);
            if ((ref2 = url.locale) === null || ref2 === void 0 ? void 0 : ref2.domain) {
                (0, _requestMeta).addRequestMeta(req, '__nextIsLocaleDomain', true);
            }
            if ((ref3 = url.locale) === null || ref3 === void 0 ? void 0 : ref3.path.detectedLocale) {
                req.url = (0, _url).format(url);
                (0, _requestMeta).addRequestMeta(req, '__nextStrippedLocale', true);
                if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
                    return this.render404(req, res, parsedUrl);
                }
            }
            if (!this.minimalMode || !parsedUrl.query.__nextLocale) {
                var ref;
                if (url === null || url === void 0 ? void 0 : (ref = url.locale) === null || ref === void 0 ? void 0 : ref.locale) {
                    parsedUrl.query.__nextLocale = url.locale.locale;
                }
            }
            if (url === null || url === void 0 ? void 0 : (ref4 = url.locale) === null || ref4 === void 0 ? void 0 : ref4.defaultLocale) {
                parsedUrl.query.__nextDefaultLocale = url.locale.defaultLocale;
            }
            if ((ref5 = url.locale) === null || ref5 === void 0 ? void 0 : ref5.redirect) {
                res.redirect(url.locale.redirect, _constants.TEMPORARY_REDIRECT_STATUS).body(url.locale.redirect).send();
                return;
            }
            res.statusCode = 200;
            return await this.run(req, res, parsedUrl);
        } catch (err) {
            if (err && typeof err === 'object' && err.code === 'ERR_INVALID_URL' || err instanceof _utils1.DecodeError) {
                res.statusCode = 400;
                return this.renderError(null, req, res, '/_error', {
                });
            }
            if (this.minimalMode || this.renderOpts.dev) {
                throw err;
            }
            this.logError((0, _isError).getProperError(err));
            res.statusCode = 500;
            res.body('Internal Server Error').send();
        }
    }
    getRequestHandler() {
        return this.handleRequest.bind(this);
    }
    setAssetPrefix(prefix) {
        this.renderOpts.assetPrefix = prefix ? prefix.replace(/\/$/, '') : '';
    }
    // Backwards compatibility
    async prepare() {
    }
    // Backwards compatibility
    async close() {
    }
    getCustomRoutes() {
        const customRoutes = this.getRoutesManifest();
        let rewrites;
        // rewrites can be stored as an array when an array is
        // returned in next.config.js so massage them into
        // the expected object format
        if (Array.isArray(customRoutes.rewrites)) {
            rewrites = {
                beforeFiles: [],
                afterFiles: customRoutes.rewrites,
                fallback: []
            };
        } else {
            rewrites = customRoutes.rewrites;
        }
        return Object.assign(customRoutes, {
            rewrites
        });
    }
    getPreviewProps() {
        return this.getPrerenderManifest().preview;
    }
    async ensureMiddleware(_pathname, _isSSR) {
    }
    generateRoutes() {
        var ref;
        const publicRoutes = this.generatePublicRoutes();
        const imageRoutes = this.generateImageRoutes();
        const staticFilesRoutes = this.generateStaticRoutes();
        const fsRoutes = [
            ...this.generateFsStaticRoutes(),
            {
                match: (0, _router).route('/_next/data/:path*'),
                type: 'route',
                name: '_next/data catchall',
                fn: async (req, res, params, _parsedUrl)=>{
                    // Make sure to 404 for /_next/data/ itself and
                    // we also want to 404 if the buildId isn't correct
                    if (!params.path || params.path[0] !== this.buildId) {
                        await this.render404(req, res, _parsedUrl);
                        return {
                            finished: true
                        };
                    }
                    // remove buildId from URL
                    params.path.shift();
                    const lastParam = params.path[params.path.length - 1];
                    // show 404 if it doesn't end with .json
                    if (typeof lastParam !== 'string' || !lastParam.endsWith('.json')) {
                        await this.render404(req, res, _parsedUrl);
                        return {
                            finished: true
                        };
                    }
                    // re-create page's pathname
                    let pathname = `/${params.path.join('/')}`;
                    pathname = (0, _getRouteFromAssetPath).default(pathname, '.json');
                    if (this.nextConfig.i18n) {
                        const { host  } = (req === null || req === void 0 ? void 0 : req.headers) || {
                        };
                        // remove port from host and remove port if present
                        const hostname = host === null || host === void 0 ? void 0 : host.split(':')[0].toLowerCase();
                        const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(pathname, this.nextConfig.i18n.locales);
                        const { defaultLocale  } = (0, _detectDomainLocale).detectDomainLocale(this.nextConfig.i18n.domains, hostname) || {
                        };
                        let detectedLocale = '';
                        if (localePathResult.detectedLocale) {
                            pathname = localePathResult.pathname;
                            detectedLocale = localePathResult.detectedLocale;
                        }
                        _parsedUrl.query.__nextLocale = detectedLocale;
                        _parsedUrl.query.__nextDefaultLocale = defaultLocale || this.nextConfig.i18n.defaultLocale;
                        if (!detectedLocale) {
                            _parsedUrl.query.__nextLocale = _parsedUrl.query.__nextDefaultLocale;
                            await this.render404(req, res, _parsedUrl);
                            return {
                                finished: true
                            };
                        }
                    }
                    const parsedUrl = (0, _url).parse(pathname, true);
                    await this.render(req, res, pathname, {
                        ..._parsedUrl.query,
                        _nextDataReq: '1'
                    }, parsedUrl, true);
                    return {
                        finished: true
                    };
                }
            },
            ...imageRoutes,
            {
                match: (0, _router).route('/_next/:path*'),
                type: 'route',
                name: '_next catchall',
                // This path is needed because `render()` does a check for `/_next` and the calls the routing again
                fn: async (req, res, _params, parsedUrl)=>{
                    await this.render404(req, res, parsedUrl);
                    return {
                        finished: true
                    };
                }
            },
            ...publicRoutes,
            ...staticFilesRoutes, 
        ];
        const restrictedRedirectPaths = this.nextConfig.basePath ? [
            `${this.nextConfig.basePath}/_next`
        ] : [
            '/_next'
        ];
        // Headers come very first
        const headers = this.minimalMode ? [] : this.customRoutes.headers.map((rule)=>(0, _serverRouteUtils).createHeaderRoute({
                rule,
                restrictedRedirectPaths
            })
        );
        const redirects = this.minimalMode ? [] : this.customRoutes.redirects.map((rule)=>(0, _serverRouteUtils).createRedirectRoute({
                rule,
                restrictedRedirectPaths
            })
        );
        const rewrites = this.generateRewrites({
            restrictedRedirectPaths
        });
        const catchAllMiddleware = this.generateCatchAllMiddlewareRoute();
        const catchAllRoute = {
            match: (0, _router).route('/:path*'),
            type: 'route',
            name: 'Catchall render',
            fn: async (req, res, _params, parsedUrl)=>{
                let { pathname , query  } = parsedUrl;
                if (!pathname) {
                    throw new Error('pathname is undefined');
                }
                // next.js core assumes page path without trailing slash
                pathname = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
                if (this.nextConfig.i18n) {
                    var ref;
                    const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(pathname, (ref = this.nextConfig.i18n) === null || ref === void 0 ? void 0 : ref.locales);
                    if (localePathResult.detectedLocale) {
                        pathname = localePathResult.pathname;
                        parsedUrl.query.__nextLocale = localePathResult.detectedLocale;
                    }
                }
                const bubbleNoFallback = !!query._nextBubbleNoFallback;
                if (pathname.match(_constants1.MIDDLEWARE_ROUTE)) {
                    await this.render404(req, res, parsedUrl);
                    return {
                        finished: true
                    };
                }
                if (pathname === '/api' || pathname.startsWith('/api/')) {
                    delete query._nextBubbleNoFallback;
                    const handled = await this.handleApiRequest(req, res, pathname, query);
                    if (handled) {
                        return {
                            finished: true
                        };
                    }
                }
                try {
                    await this.render(req, res, pathname, query, parsedUrl, true);
                    return {
                        finished: true
                    };
                } catch (err) {
                    if (err instanceof NoFallbackError && bubbleNoFallback) {
                        return {
                            finished: false
                        };
                    }
                    throw err;
                }
            }
        };
        const { useFileSystemPublicRoutes  } = this.nextConfig;
        if (useFileSystemPublicRoutes) {
            this.dynamicRoutes = this.getDynamicRoutes();
            if (!this.minimalMode) {
                this.middleware = this.getMiddleware();
            }
        }
        return {
            headers,
            fsRoutes,
            rewrites,
            redirects,
            catchAllRoute,
            catchAllMiddleware,
            useFileSystemPublicRoutes,
            dynamicRoutes: this.dynamicRoutes,
            basePath: this.nextConfig.basePath,
            pageChecker: this.hasPage.bind(this),
            locales: ((ref = this.nextConfig.i18n) === null || ref === void 0 ? void 0 : ref.locales) || []
        };
    }
    async hasPage(pathname) {
        let found = false;
        try {
            var ref;
            found = !!this.getPagePath(pathname, (ref = this.nextConfig.i18n) === null || ref === void 0 ? void 0 : ref.locales);
        } catch (_) {
        }
        return found;
    }
    async _beforeCatchAllRender(_req, _res, _params, _parsedUrl) {
        return false;
    }
    // Used to build API page in development
    async ensureApiPage(_pathname) {
    }
    /**
   * Resolves `API` request, in development builds on demand
   * @param req http request
   * @param res http response
   * @param pathname path of request
   */ async handleApiRequest(req, res, pathname, query) {
        let page = pathname;
        let params = false;
        let pageFound = !(0, _utils).isDynamicRoute(page) && await this.hasPage(page);
        if (!pageFound && this.dynamicRoutes) {
            for (const dynamicRoute of this.dynamicRoutes){
                params = dynamicRoute.match(pathname);
                if (dynamicRoute.page.startsWith('/api') && params) {
                    page = dynamicRoute.page;
                    pageFound = true;
                    break;
                }
            }
        }
        if (!pageFound) {
            return false;
        }
        // Make sure the page is built before getting the path
        // or else it won't be in the manifest yet
        await this.ensureApiPage(page);
        let builtPagePath;
        try {
            builtPagePath = this.getPagePath(page);
        } catch (err) {
            if ((0, _isError).default(err) && err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return this.runApi(req, res, query, params, page, builtPagePath);
    }
    getDynamicRoutes() {
        const addedPages = new Set();
        return (0, _utils).getSortedRoutes(Object.keys(this.pagesManifest).map((page)=>{
            var ref;
            return (0, _normalizeLocalePath).normalizeLocalePath(page, (ref = this.nextConfig.i18n) === null || ref === void 0 ? void 0 : ref.locales).pathname;
        })).map((page)=>{
            if (addedPages.has(page) || !(0, _utils).isDynamicRoute(page)) return null;
            addedPages.add(page);
            return {
                page,
                match: (0, _utils).getRouteMatcher((0, _utils).getRouteRegex(page))
            };
        }).filter((item)=>Boolean(item)
        );
    }
    async run(req, res, parsedUrl) {
        this.handleCompression(req, res);
        try {
            const matched = await this.router.execute(req, res, parsedUrl);
            if (matched) {
                return;
            }
        } catch (err) {
            if (err instanceof _utils1.DecodeError) {
                res.statusCode = 400;
                return this.renderError(null, req, res, '/_error', {
                });
            }
            throw err;
        }
        await this.render404(req, res, parsedUrl);
    }
    async pipe(fn, partialContext) {
        const userAgent = partialContext.req.headers['user-agent'];
        const ctx = {
            ...partialContext,
            renderOpts: {
                ...this.renderOpts,
                supportsDynamicHTML: userAgent ? !(0, _utils2).isBot(userAgent) : false
            }
        };
        const payload = await fn(ctx);
        if (payload === null) {
            return;
        }
        const { req , res  } = ctx;
        const { body , type , revalidateOptions  } = payload;
        if (!res.sent) {
            const { generateEtags , poweredByHeader , dev  } = this.renderOpts;
            if (dev) {
                // In dev, we should not cache pages for any reason.
                res.setHeader('Cache-Control', 'no-store, must-revalidate');
            }
            return this.sendRenderResult(req, res, {
                result: body,
                type,
                generateEtags,
                poweredByHeader,
                options: revalidateOptions
            });
        }
    }
    async getStaticHTML(fn, partialContext) {
        const payload = await fn({
            ...partialContext,
            renderOpts: {
                ...this.renderOpts,
                supportsDynamicHTML: false
            }
        });
        if (payload === null) {
            return null;
        }
        return payload.body.toUnchunkedString();
    }
    async render(req, res, pathname, query = {
    }, parsedUrl, internalRender = false) {
        var ref;
        if (!pathname.startsWith('/')) {
            console.warn(`Cannot render page with path "${pathname}", did you mean "/${pathname}"?. See more info here: https://nextjs.org/docs/messages/render-no-starting-slash`);
        }
        if (this.renderOpts.customServer && pathname === '/index' && !await this.hasPage('/index')) {
            // maintain backwards compatibility for custom server
            // (see custom-server integration tests)
            pathname = '/';
        }
        // we allow custom servers to call render for all URLs
        // so check if we need to serve a static _next file or not.
        // we don't modify the URL for _next/data request but still
        // call render so we special case this to prevent an infinite loop
        if (!internalRender && !this.minimalMode && !query._nextDataReq && (((ref = req.url) === null || ref === void 0 ? void 0 : ref.match(/^\/_next\//)) || this.hasStaticDir && req.url.match(/^\/static\//))) {
            return this.handleRequest(req, res, parsedUrl);
        }
        // Custom server users can run `app.render()` which needs compression.
        if (this.renderOpts.customServer) {
            this.handleCompression(req, res);
        }
        if ((0, _utils2).isBlockedPage(pathname)) {
            return this.render404(req, res, parsedUrl);
        }
        return this.pipe((ctx)=>this.renderToResponse(ctx)
        , {
            req,
            res,
            pathname,
            query
        });
    }
    async getStaticPaths(pathname) {
        // `staticPaths` is intentionally set to `undefined` as it should've
        // been caught when checking disk data.
        const staticPaths = undefined;
        // Read whether or not fallback should exist from the manifest.
        const fallbackField = this.getPrerenderManifest().dynamicRoutes[pathname].fallback;
        return {
            staticPaths,
            fallbackMode: typeof fallbackField === 'string' ? 'static' : fallbackField === null ? 'blocking' : false
        };
    }
    async renderToResponseWithComponents({ req , res , pathname , renderOpts: opts  }, { components , query  }) {
        var ref, ref30, ref46;
        const is404Page = pathname === '/404';
        const is500Page = pathname === '/500';
        const isLikeServerless = typeof components.ComponentMod === 'object' && typeof components.ComponentMod.renderReqToHTML === 'function';
        const isSSG = !!components.getStaticProps;
        const hasServerProps = !!components.getServerSideProps;
        const hasStaticPaths = !!components.getStaticPaths;
        const hasGetInitialProps = !!components.Component.getInitialProps;
        // Toggle whether or not this is a Data request
        const isDataReq = !!query._nextDataReq && (isSSG || hasServerProps);
        delete query._nextDataReq;
        // Don't delete query.__flight__ yet, it still needs to be used in renderToHTML later
        const isFlightRequest = Boolean(this.serverComponentManifest && query.__flight__);
        // we need to ensure the status code if /404 is visited directly
        if (is404Page && !isDataReq && !isFlightRequest) {
            res.statusCode = 404;
        }
        // ensure correct status is set when visiting a status page
        // directly e.g. /500
        if (_constants.STATIC_STATUS_PAGES.includes(pathname)) {
            res.statusCode = parseInt(pathname.substr(1), 10);
        }
        // static pages can only respond to GET/HEAD
        // requests so ensure we respond with 405 for
        // invalid requests
        if (!is404Page && !is500Page && pathname !== '/_error' && req.method !== 'HEAD' && req.method !== 'GET' && (typeof components.Component === 'string' || isSSG)) {
            res.statusCode = 405;
            res.setHeader('Allow', [
                'GET',
                'HEAD'
            ]);
            await this.renderError(null, req, res, pathname);
            return null;
        }
        // handle static page
        if (typeof components.Component === 'string') {
            return {
                type: 'html',
                // TODO: Static pages should be serialized as RenderResult
                body: _renderResult.default.fromStatic(components.Component)
            };
        }
        if (!query.amp) {
            delete query.amp;
        }
        if (opts.supportsDynamicHTML === true) {
            var ref47;
            // Disable dynamic HTML in cases that we know it won't be generated,
            // so that we can continue generating a cache key when possible.
            opts.supportsDynamicHTML = !isSSG && !isLikeServerless && !query.amp && typeof ((ref47 = components.Document) === null || ref47 === void 0 ? void 0 : ref47.getInitialProps) !== 'function';
        }
        const defaultLocale = isSSG ? (ref = this.nextConfig.i18n) === null || ref === void 0 ? void 0 : ref.defaultLocale : query.__nextDefaultLocale;
        const locale = query.__nextLocale;
        const locales = (ref30 = this.nextConfig.i18n) === null || ref30 === void 0 ? void 0 : ref30.locales;
        let previewData;
        let isPreviewMode = false;
        if (hasServerProps || isSSG) {
            // For the edge runtime, we don't support preview mode in SSG.
            if (!process.browser) {
                const { tryGetPreviewData  } = require('./api-utils/node');
                previewData = tryGetPreviewData(req, res, this.renderOpts.previewProps);
                isPreviewMode = previewData !== false;
            }
        }
        let isManualRevalidate = false;
        if (isSSG) {
            isManualRevalidate = (0, _apiUtils).checkIsManualRevalidate(req, this.renderOpts.previewProps);
        }
        // Compute the iSSG cache key. We use the rewroteUrl since
        // pages with fallback: false are allowed to be rewritten to
        // and we need to look up the path by the rewritten path
        let urlPathname = (0, _url).parse(req.url || '').pathname || '/';
        let resolvedUrlPathname = (0, _requestMeta).getRequestMeta(req, '_nextRewroteUrl') || urlPathname;
        urlPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash(urlPathname);
        resolvedUrlPathname = (0, _normalizeLocalePath).normalizeLocalePath((0, _normalizeTrailingSlash).removePathTrailingSlash(resolvedUrlPathname), (ref46 = this.nextConfig.i18n) === null || ref46 === void 0 ? void 0 : ref46.locales).pathname;
        const stripNextDataPath = (path)=>{
            if (path.includes(this.buildId)) {
                const splitPath = path.substring(path.indexOf(this.buildId) + this.buildId.length);
                path = (0, _denormalizePagePath).denormalizePagePath(splitPath.replace(/\.json$/, ''));
            }
            if (this.nextConfig.i18n) {
                return (0, _normalizeLocalePath).normalizeLocalePath(path, locales).pathname;
            }
            return path;
        };
        const handleRedirect = (pageData)=>{
            const redirect = {
                destination: pageData.pageProps.__N_REDIRECT,
                statusCode: pageData.pageProps.__N_REDIRECT_STATUS,
                basePath: pageData.pageProps.__N_REDIRECT_BASE_PATH
            };
            const statusCode = (0, _loadCustomRoutes).getRedirectStatus(redirect);
            const { basePath  } = this.nextConfig;
            if (basePath && redirect.basePath !== false && redirect.destination.startsWith('/')) {
                redirect.destination = `${basePath}${redirect.destination}`;
            }
            if (redirect.destination.startsWith('/')) {
                redirect.destination = (0, _utils1).normalizeRepeatedSlashes(redirect.destination);
            }
            res.redirect(redirect.destination, statusCode).body(redirect.destination).send();
        };
        // remove /_next/data prefix from urlPathname so it matches
        // for direct page visit and /_next/data visit
        if (isDataReq) {
            resolvedUrlPathname = stripNextDataPath(resolvedUrlPathname);
            urlPathname = stripNextDataPath(urlPathname);
        }
        let ssgCacheKey = isPreviewMode || !isSSG || this.minimalMode || opts.supportsDynamicHTML ? null // Preview mode and manual revalidate bypasses the cache
         : `${locale ? `/${locale}` : ''}${(pathname === '/' || resolvedUrlPathname === '/') && locale ? '' : resolvedUrlPathname}${query.amp ? '.amp' : ''}`;
        if ((is404Page || is500Page) && isSSG) {
            ssgCacheKey = `${locale ? `/${locale}` : ''}${pathname}${query.amp ? '.amp' : ''}`;
        }
        if (ssgCacheKey) {
            // we only encode path delimiters for path segments from
            // getStaticPaths so we need to attempt decoding the URL
            // to match against and only escape the path delimiters
            // this allows non-ascii values to be handled e.g. Japanese characters
            // TODO: investigate adding this handling for non-SSG pages so
            // non-ascii names work there also
            ssgCacheKey = ssgCacheKey.split('/').map((seg)=>{
                try {
                    seg = (0, _escapePathDelimiters).default(decodeURIComponent(seg), true);
                } catch (_) {
                    // An improperly encoded URL was provided
                    throw new _utils1.DecodeError('failed to decode param');
                }
                return seg;
            }).join('/');
        }
        const doRender = async ()=>{
            let pageData;
            let body;
            let sprRevalidate;
            let isNotFound;
            let isRedirect;
            // handle serverless
            if (isLikeServerless) {
                const renderResult = await components.ComponentMod.renderReqToHTML(req, res, 'passthrough', {
                    locale,
                    locales,
                    defaultLocale,
                    optimizeCss: this.renderOpts.optimizeCss,
                    distDir: this.distDir,
                    fontManifest: this.renderOpts.fontManifest,
                    domainLocales: this.renderOpts.domainLocales
                });
                body = renderResult.html;
                pageData = renderResult.renderOpts.pageData;
                sprRevalidate = renderResult.renderOpts.revalidate;
                isNotFound = renderResult.renderOpts.isNotFound;
                isRedirect = renderResult.renderOpts.isRedirect;
            } else {
                const origQuery = (0, _url).parse(req.url || '', true).query;
                const hadTrailingSlash = urlPathname !== '/' && this.nextConfig.trailingSlash;
                const resolvedUrl = (0, _url).format({
                    pathname: `${resolvedUrlPathname}${hadTrailingSlash ? '/' : ''}`,
                    // make sure to only add query values from original URL
                    query: origQuery
                });
                const renderOpts = {
                    ...components,
                    ...opts,
                    isDataReq,
                    resolvedUrl,
                    locale,
                    locales,
                    defaultLocale,
                    // For getServerSideProps and getInitialProps we need to ensure we use the original URL
                    // and not the resolved URL to prevent a hydration mismatch on
                    // asPath
                    resolvedAsPath: hasServerProps || hasGetInitialProps ? (0, _url).format({
                        // we use the original URL pathname less the _next/data prefix if
                        // present
                        pathname: `${urlPathname}${hadTrailingSlash ? '/' : ''}`,
                        query: origQuery
                    }) : resolvedUrl
                };
                const renderResult = await this.renderHTML(req, res, pathname, query, renderOpts);
                body = renderResult;
                // TODO: change this to a different passing mechanism
                pageData = renderOpts.pageData;
                sprRevalidate = renderOpts.revalidate;
                isNotFound = renderOpts.isNotFound;
                isRedirect = renderOpts.isRedirect;
            }
            let value;
            if (isNotFound) {
                value = null;
            } else if (isRedirect) {
                value = {
                    kind: 'REDIRECT',
                    props: pageData
                };
            } else {
                if (!body) {
                    return null;
                }
                value = {
                    kind: 'PAGE',
                    html: body,
                    pageData
                };
            }
            return {
                revalidate: sprRevalidate,
                value
            };
        };
        const cacheEntry = await this.responseCache.get(ssgCacheKey, async (hasResolved, hadCache)=>{
            const isProduction = !this.renderOpts.dev;
            const isDynamicPathname = (0, _utils).isDynamicRoute(pathname);
            const didRespond = hasResolved || res.sent;
            let { staticPaths , fallbackMode  } = hasStaticPaths ? await this.getStaticPaths(pathname) : {
                staticPaths: undefined,
                fallbackMode: false
            };
            if (fallbackMode === 'static' && (0, _utils2).isBot(req.headers['user-agent'] || '')) {
                fallbackMode = 'blocking';
            }
            // only allow manual revalidate for fallback: true/blocking
            // or for prerendered fallback: false paths
            if (isManualRevalidate && (fallbackMode !== false || hadCache)) {
                fallbackMode = 'blocking';
            }
            // When we did not respond from cache, we need to choose to block on
            // rendering or return a skeleton.
            //
            // * Data requests always block.
            //
            // * Blocking mode fallback always blocks.
            //
            // * Preview mode toggles all pages to be resolved in a blocking manner.
            //
            // * Non-dynamic pages should block (though this is an impossible
            //   case in production).
            //
            // * Dynamic pages should return their skeleton if not defined in
            //   getStaticPaths, then finish the data request on the client-side.
            //
            if (this.minimalMode !== true && fallbackMode !== 'blocking' && ssgCacheKey && !didRespond && !isPreviewMode && isDynamicPathname && // Development should trigger fallback when the path is not in
            // `getStaticPaths`
            (isProduction || !staticPaths || !staticPaths.includes(// we use ssgCacheKey here as it is normalized to match the
            // encoding from getStaticPaths along with including the locale
            query.amp ? ssgCacheKey.replace(/\.amp$/, '') : ssgCacheKey))) {
                if (// In development, fall through to render to handle missing
                // getStaticPaths.
                (isProduction || staticPaths) && // When fallback isn't present, abort this render so we 404
                fallbackMode !== 'static') {
                    throw new NoFallbackError();
                }
                if (!isDataReq) {
                    // Production already emitted the fallback as static HTML.
                    if (isProduction) {
                        const html = await this.incrementalCache.getFallback(locale ? `/${locale}${pathname}` : pathname);
                        return {
                            value: {
                                kind: 'PAGE',
                                html: _renderResult.default.fromStatic(html),
                                pageData: {
                                }
                            }
                        };
                    } else {
                        query.__nextFallback = 'true';
                        if (isLikeServerless) {
                            prepareServerlessUrl(req, query);
                        }
                        const result = await doRender();
                        if (!result) {
                            return null;
                        }
                        // Prevent caching this result
                        delete result.revalidate;
                        return result;
                    }
                }
            }
            const result = await doRender();
            if (!result) {
                return null;
            }
            return {
                ...result,
                revalidate: result.revalidate !== undefined ? result.revalidate : /* default to minimum revalidate (this should be an invariant) */ 1
            };
        }, {
            isManualRevalidate
        });
        if (!cacheEntry) {
            if (ssgCacheKey) {
                // A cache entry might not be generated if a response is written
                // in `getInitialProps` or `getServerSideProps`, but those shouldn't
                // have a cache key. If we do have a cache key but we don't end up
                // with a cache entry, then either Next.js or the application has a
                // bug that needs fixing.
                throw new Error('invariant: cache entry required but not generated');
            }
            return null;
        }
        const { revalidate , value: cachedData  } = cacheEntry;
        const revalidateOptions = typeof revalidate !== 'undefined' && (!this.renderOpts.dev || hasServerProps && !isDataReq) ? {
            // When the page is 404 cache-control should not be added unless
            // we are rendering the 404 page for notFound: true which should
            // cache according to revalidate correctly
            private: isPreviewMode || is404Page && cachedData,
            stateful: !isSSG,
            revalidate
        } : undefined;
        if (!cachedData) {
            if (revalidateOptions) {
                (0, _sendPayload).setRevalidateHeaders(res, revalidateOptions);
            }
            if (isDataReq) {
                res.statusCode = 404;
                res.body('{"notFound":true}').send();
                return null;
            } else {
                if (this.renderOpts.dev) {
                    query.__nextNotFoundSrcPage = pathname;
                }
                await this.render404(req, res, {
                    pathname,
                    query
                }, false);
                return null;
            }
        } else if (cachedData.kind === 'REDIRECT') {
            if (isDataReq) {
                return {
                    type: 'json',
                    body: _renderResult.default.fromStatic(JSON.stringify(cachedData.props)),
                    revalidateOptions
                };
            } else {
                await handleRedirect(cachedData.props);
                return null;
            }
        } else if (cachedData.kind === 'IMAGE') {
            throw new Error('invariant SSG should not return an image cache value');
        } else {
            return {
                type: isDataReq ? 'json' : 'html',
                body: isDataReq ? _renderResult.default.fromStatic(JSON.stringify(cachedData.pageData)) : cachedData.html,
                revalidateOptions
            };
        }
    }
    async renderToResponse(ctx) {
        const { res , query , pathname  } = ctx;
        let page = pathname;
        const bubbleNoFallback = !!query._nextBubbleNoFallback;
        delete query._nextBubbleNoFallback;
        try {
            // Ensure a request to the URL /accounts/[id] will be treated as a dynamic
            // route correctly and not loaded immediately without parsing params.
            if (!(0, _utils).isDynamicRoute(pathname)) {
                const result = await this.findPageComponents(pathname, query);
                if (result) {
                    try {
                        return await this.renderToResponseWithComponents(ctx, result);
                    } catch (err) {
                        const isNoFallbackError = err instanceof NoFallbackError;
                        if (!isNoFallbackError || isNoFallbackError && bubbleNoFallback) {
                            throw err;
                        }
                    }
                }
            }
            if (this.dynamicRoutes) {
                for (const dynamicRoute of this.dynamicRoutes){
                    const params = dynamicRoute.match(pathname);
                    if (!params) {
                        continue;
                    }
                    const dynamicRouteResult = await this.findPageComponents(dynamicRoute.page, query, params);
                    if (dynamicRouteResult) {
                        try {
                            page = dynamicRoute.page;
                            return await this.renderToResponseWithComponents({
                                ...ctx,
                                pathname: dynamicRoute.page,
                                renderOpts: {
                                    ...ctx.renderOpts,
                                    params
                                }
                            }, dynamicRouteResult);
                        } catch (err) {
                            const isNoFallbackError = err instanceof NoFallbackError;
                            if (!isNoFallbackError || isNoFallbackError && bubbleNoFallback) {
                                throw err;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            const err = (0, _isError).getProperError(error);
            if (err instanceof NoFallbackError && bubbleNoFallback) {
                throw err;
            }
            if (err instanceof _utils1.DecodeError) {
                res.statusCode = 400;
                return await this.renderErrorToResponse(ctx, err);
            }
            res.statusCode = 500;
            const isWrappedError = err instanceof WrappedBuildError;
            const response = await this.renderErrorToResponse(ctx, isWrappedError ? err.innerError : err);
            if (!isWrappedError) {
                if (this.minimalMode && !process.browser || this.renderOpts.dev) {
                    if ((0, _isError).default(err)) err.page = page;
                    throw err;
                }
                this.logError((0, _isError).getProperError(err));
            }
            return response;
        }
        res.statusCode = 404;
        return this.renderErrorToResponse(ctx, null);
    }
    async renderToHTML(req, res, pathname, query = {
    }) {
        return this.getStaticHTML((ctx)=>this.renderToResponse(ctx)
        , {
            req,
            res,
            pathname,
            query
        });
    }
    async renderError(err, req, res, pathname, query = {
    }, setHeaders = true) {
        if (setHeaders) {
            res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
        }
        return this.pipe(async (ctx)=>{
            const response = await this.renderErrorToResponse(ctx, err);
            if (this.minimalMode && res.statusCode === 500) {
                throw err;
            }
            return response;
        }, {
            req,
            res,
            pathname,
            query
        });
    }
    async renderErrorToResponse(ctx, err) {
        const { res , query  } = ctx;
        try {
            let result = null;
            const is404 = res.statusCode === 404;
            let using404Page = false;
            // use static 404 page if available and is 404 response
            if (is404) {
                result = await this.findPageComponents('/404', query);
                using404Page = result !== null;
            }
            let statusPage = `/${res.statusCode}`;
            if (!result && _constants.STATIC_STATUS_PAGES.includes(statusPage)) {
                result = await this.findPageComponents(statusPage, query);
            }
            if (!result) {
                result = await this.findPageComponents('/_error', query);
                statusPage = '/_error';
            }
            if (process.env.NODE_ENV !== 'production' && !using404Page && await this.hasPage('/_error') && !await this.hasPage('/404')) {
                this.customErrorNo404Warn();
            }
            try {
                return await this.renderToResponseWithComponents({
                    ...ctx,
                    pathname: statusPage,
                    renderOpts: {
                        ...ctx.renderOpts,
                        err
                    }
                }, result);
            } catch (maybeFallbackError) {
                if (maybeFallbackError instanceof NoFallbackError) {
                    throw new Error('invariant: failed to render error page');
                }
                throw maybeFallbackError;
            }
        } catch (error) {
            const renderToHtmlError = (0, _isError).getProperError(error);
            const isWrappedError = renderToHtmlError instanceof WrappedBuildError;
            if (!isWrappedError) {
                this.logError(renderToHtmlError);
            }
            res.statusCode = 500;
            const fallbackComponents = await this.getFallbackErrorComponents();
            if (fallbackComponents) {
                return this.renderToResponseWithComponents({
                    ...ctx,
                    pathname: '/_error',
                    renderOpts: {
                        ...ctx.renderOpts,
                        // We render `renderToHtmlError` here because `err` is
                        // already captured in the stacktrace.
                        err: isWrappedError ? renderToHtmlError.innerError : renderToHtmlError
                    }
                }, {
                    query,
                    components: fallbackComponents
                });
            }
            return {
                type: 'html',
                body: _renderResult.default.fromStatic('Internal Server Error')
            };
        }
    }
    async renderErrorToHTML(err, req, res, pathname, query = {
    }) {
        return this.getStaticHTML((ctx)=>this.renderErrorToResponse(ctx, err)
        , {
            req,
            res,
            pathname,
            query
        });
    }
    getCacheFilesystem() {
        return {
            readFile: ()=>Promise.resolve('')
            ,
            readFileSync: ()=>''
            ,
            writeFile: ()=>Promise.resolve()
            ,
            mkdir: ()=>Promise.resolve()
            ,
            stat: ()=>Promise.resolve({
                    mtime: new Date()
                })
        };
    }
    async getFallbackErrorComponents() {
        // The development server will provide an implementation for this
        return null;
    }
    async render404(req, res, parsedUrl, setHeaders = true) {
        const { pathname , query  } = parsedUrl ? parsedUrl : (0, _url).parse(req.url, true);
        if (this.nextConfig.i18n) {
            query.__nextLocale = query.__nextLocale || this.nextConfig.i18n.defaultLocale;
            query.__nextDefaultLocale = query.__nextDefaultLocale || this.nextConfig.i18n.defaultLocale;
        }
        res.statusCode = 404;
        return this.renderError(null, req, res, pathname, query, setHeaders);
    }
    get _isLikeServerless() {
        return (0, _utils2).isTargetLikeServerless(this.nextConfig.target);
    }
}
exports.default = Server;
function prepareServerlessUrl(req, query) {
    const curUrl = (0, _url).parse(req.url, true);
    req.url = (0, _url).format({
        ...curUrl,
        search: undefined,
        query: {
            ...curUrl.query,
            ...query
        }
    });
}
class NoFallbackError extends Error {
}
class WrappedBuildError extends Error {
    constructor(innerError){
        super();
        this.innerError = innerError;
    }
}
exports.WrappedBuildError = WrappedBuildError;

//# sourceMappingURL=base-server.js.map