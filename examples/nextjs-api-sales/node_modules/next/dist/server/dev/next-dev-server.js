"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _fs = _interopRequireDefault(require("fs"));
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _jestWorker = require("next/dist/compiled/jest-worker");
var _amphtmlValidator = _interopRequireDefault(require("next/dist/compiled/amphtml-validator"));
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _path = require("path");
var _react = _interopRequireDefault(require("react"));
var _watchpack = _interopRequireDefault(require("next/dist/compiled/watchpack"));
var _output = require("../../build/output");
var _constants = require("../../lib/constants");
var _fileExists = require("../../lib/file-exists");
var _findPagesDir = require("../../lib/find-pages-dir");
var _loadCustomRoutes = _interopRequireDefault(require("../../lib/load-custom-routes"));
var _verifyTypeScriptSetup = require("../../lib/verifyTypeScriptSetup");
var _constants1 = require("../../shared/lib/constants");
var _utils = require("../../shared/lib/router/utils");
var _nextServer = _interopRequireWildcard(require("../next-server"));
var _normalizePagePath = require("../normalize-page-path");
var _router = _interopRequireWildcard(require("../router"));
var _events = require("../../telemetry/events");
var _storage = require("../../telemetry/storage");
var _trace = require("../../trace");
var _hotReloader = _interopRequireDefault(require("./hot-reloader"));
var _findPageFile = require("../lib/find-page-file");
var _utils1 = require("../lib/utils");
var _coalescedFunction = require("../../lib/coalesced-function");
var _loadComponents = require("../load-components");
var _utils2 = require("../../shared/lib/utils");
var _middleware = require("next/dist/compiled/@next/react-dev-overlay/middleware");
var Log = _interopRequireWildcard(require("../../build/output/log"));
var _isError = _interopRequireWildcard(require("../../lib/is-error"));
var _getMiddlewareRegex = require("../../shared/lib/router/utils/get-middleware-regex");
var _utils3 = require("../../build/utils");
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
// Load ReactDevOverlay only when needed
let ReactDevOverlayImpl;
const ReactDevOverlay = (props)=>{
    if (ReactDevOverlayImpl === undefined) {
        ReactDevOverlayImpl = require('next/dist/compiled/@next/react-dev-overlay/client').ReactDevOverlay;
    }
    return ReactDevOverlayImpl(props);
};
class DevServer extends _nextServer.default {
    getStaticPathsWorker() {
        if (this.staticPathsWorker) {
            return this.staticPathsWorker;
        }
        this.staticPathsWorker = new _jestWorker.Worker(require.resolve('./static-paths-worker'), {
            maxRetries: 1,
            numWorkers: this.nextConfig.experimental.cpus,
            enableWorkerThreads: this.nextConfig.experimental.workerThreads,
            forkOptions: {
                env: {
                    ...process.env,
                    // discard --inspect/--inspect-brk flags from process.env.NODE_OPTIONS. Otherwise multiple Node.js debuggers
                    // would be started if user launch Next.js in debugging mode. The number of debuggers is linked to
                    // the number of workers Next.js tries to launch. The only worker users are interested in debugging
                    // is the main Next.js one
                    NODE_OPTIONS: (0, _utils1).getNodeOptionsWithoutInspect()
                }
            }
        });
        this.staticPathsWorker.getStdout().pipe(process.stdout);
        this.staticPathsWorker.getStderr().pipe(process.stderr);
        return this.staticPathsWorker;
    }
    constructor(options){
        var ref, ref1;
        super({
            ...options,
            dev: true
        });
        this.addedUpgradeListener = false;
        this.renderOpts.dev = true;
        this.renderOpts.ErrorDebug = ReactDevOverlay;
        this.devReady = new Promise((resolve)=>{
            this.setDevReady = resolve;
        });
        var ref2;
        this.renderOpts.ampSkipValidation = (ref2 = (ref = this.nextConfig.experimental) === null || ref === void 0 ? void 0 : (ref1 = ref.amp) === null || ref1 === void 0 ? void 0 : ref1.skipValidation) !== null && ref2 !== void 0 ? ref2 : false;
        this.renderOpts.ampValidator = (html, pathname)=>{
            const validatorPath = this.nextConfig.experimental && this.nextConfig.experimental.amp && this.nextConfig.experimental.amp.validator;
            return _amphtmlValidator.default.getInstance(validatorPath).then((validator)=>{
                const result = validator.validateString(html);
                (0, _output).ampValidation(pathname, result.errors.filter((e)=>e.severity === 'ERROR'
                ).filter((e)=>this._filterAmpDevelopmentScript(html, e)
                ), result.errors.filter((e)=>e.severity !== 'ERROR'
                ));
            });
        };
        if (_fs.default.existsSync((0, _path).join(this.dir, 'static'))) {
            console.warn(`The static directory has been deprecated in favor of the public directory. https://nextjs.org/docs/messages/static-dir-deprecated`);
        }
        // setup upgrade listener eagerly when we can otherwise
        // it will be done on the first request via req.socket.server
        if (options.httpServer) {
            this.setupWebSocketHandler(options.httpServer);
        }
        this.isCustomServer = !options.isNextDevCommand;
        this.pagesDir = (0, _findPagesDir).findPagesDir(this.dir);
    }
    getBuildId() {
        return 'development';
    }
    async addExportPathMapRoutes() {
        // Makes `next export` exportPathMap work in development mode.
        // So that the user doesn't have to define a custom server reading the exportPathMap
        if (this.nextConfig.exportPathMap) {
            console.log('Defining routes from exportPathMap');
            const exportPathMap = await this.nextConfig.exportPathMap({
            }, {
                dev: true,
                dir: this.dir,
                outDir: null,
                distDir: this.distDir,
                buildId: this.buildId
            }) // In development we can't give a default path mapping
            ;
            for(const path in exportPathMap){
                const { page , query ={
                }  } = exportPathMap[path];
                // We use unshift so that we're sure the routes is defined before Next's default routes
                this.router.addFsRoute({
                    match: (0, _router).route(path),
                    type: 'route',
                    name: `${path} exportpathmap route`,
                    fn: async (req, res, _params, parsedUrl)=>{
                        const { query: urlQuery  } = parsedUrl;
                        Object.keys(urlQuery).filter((key)=>query[key] === undefined
                        ).forEach((key)=>console.warn(`Url '${path}' defines a query parameter '${key}' that is missing in exportPathMap`)
                        );
                        const mergedQuery = {
                            ...urlQuery,
                            ...query
                        };
                        await this.render(req, res, page, mergedQuery, parsedUrl, true);
                        return {
                            finished: true
                        };
                    }
                });
            }
        }
    }
    async startWatcher() {
        if (this.webpackWatcher) {
            return;
        }
        const regexMiddleware = new RegExp(`[\\\\/](_middleware.(?:${this.nextConfig.pageExtensions.join('|')}))$`);
        const regexPageExtension = new RegExp(`\\.+(?:${this.nextConfig.pageExtensions.join('|')})$`);
        let resolved = false;
        return new Promise((resolve, reject)=>{
            const pagesDir = this.pagesDir;
            // Watchpack doesn't emit an event for an empty directory
            _fs.default.readdir(pagesDir, (_, files)=>{
                if (files === null || files === void 0 ? void 0 : files.length) {
                    return;
                }
                if (!resolved) {
                    resolve();
                    resolved = true;
                }
            });
            let wp = this.webpackWatcher = new _watchpack.default();
            wp.watch([], [
                pagesDir
            ], 0);
            wp.on('aggregated', ()=>{
                const routedMiddleware = [];
                const routedPages = [];
                const knownFiles = wp.getTimeInfoEntries();
                const ssrMiddleware = new Set();
                const runtime = this.nextConfig.experimental.runtime;
                const isEdgeRuntime = runtime === 'edge';
                const hasServerComponents = runtime && this.nextConfig.experimental.serverComponents;
                for (const [fileName, { accuracy  }] of knownFiles){
                    if (accuracy === undefined || !regexPageExtension.test(fileName)) {
                        continue;
                    }
                    if (regexMiddleware.test(fileName)) {
                        routedMiddleware.push(`/${(0, _path).relative(pagesDir, fileName).replace(/\\+/g, '/')}`.replace(/^\/+/g, '/').replace(regexMiddleware, '/'));
                        continue;
                    }
                    let pageName = '/' + (0, _path).relative(pagesDir, fileName).replace(/\\+/g, '/');
                    pageName = pageName.replace(regexPageExtension, '');
                    pageName = pageName.replace(/\/index$/, '') || '/';
                    if (hasServerComponents && pageName.endsWith('.server')) {
                        routedMiddleware.push(pageName);
                        ssrMiddleware.add(pageName);
                    } else if (isEdgeRuntime && !((0, _utils3).isReservedPage(pageName) || (0, _utils3).isCustomErrorPage(pageName))) {
                        routedMiddleware.push(pageName);
                        ssrMiddleware.add(pageName);
                    }
                    routedPages.push(pageName);
                }
                this.middleware = (0, _utils).getSortedRoutes(routedMiddleware).map((page)=>({
                        match: (0, _utils).getRouteMatcher((0, _getMiddlewareRegex).getMiddlewareRegex(page, !ssrMiddleware.has(page))),
                        page,
                        ssr: ssrMiddleware.has(page)
                    })
                );
                try {
                    var ref;
                    // we serve a separate manifest with all pages for the client in
                    // dev mode so that we can match a page after a rewrite on the client
                    // before it has been built and is populated in the _buildManifest
                    const sortedRoutes = (0, _utils).getSortedRoutes(routedPages);
                    if (!((ref = this.sortedRoutes) === null || ref === void 0 ? void 0 : ref.every((val, idx)=>val === sortedRoutes[idx]
                    ))) {
                        // emit the change so clients fetch the update
                        this.hotReloader.send(undefined, {
                            devPagesManifest: true
                        });
                    }
                    this.sortedRoutes = sortedRoutes;
                    this.dynamicRoutes = this.sortedRoutes.filter(_utils.isDynamicRoute).map((page)=>({
                            page,
                            match: (0, _utils).getRouteMatcher((0, _utils).getRouteRegex(page))
                        })
                    );
                    this.router.setDynamicRoutes(this.dynamicRoutes);
                    if (!resolved) {
                        resolve();
                        resolved = true;
                    }
                } catch (e) {
                    if (!resolved) {
                        reject(e);
                        resolved = true;
                    } else {
                        console.warn('Failed to reload dynamic routes:', e);
                    }
                }
            });
        });
    }
    async stopWatcher() {
        if (!this.webpackWatcher) {
            return;
        }
        this.webpackWatcher.close();
        this.webpackWatcher = null;
    }
    async prepare() {
        (0, _trace).setGlobal('distDir', this.distDir);
        (0, _trace).setGlobal('phase', _constants1.PHASE_DEVELOPMENT_SERVER);
        await (0, _verifyTypeScriptSetup).verifyTypeScriptSetup(this.dir, this.pagesDir, false, this.nextConfig);
        this.customRoutes = await (0, _loadCustomRoutes).default(this.nextConfig);
        // reload router
        const { redirects , rewrites , headers  } = this.customRoutes;
        if (rewrites.beforeFiles.length || rewrites.afterFiles.length || rewrites.fallback.length || redirects.length || headers.length) {
            this.router = new _router.default(this.generateRoutes());
        }
        this.hotReloader = new _hotReloader.default(this.dir, {
            pagesDir: this.pagesDir,
            config: this.nextConfig,
            previewProps: this.getPreviewProps(),
            buildId: this.buildId,
            rewrites
        });
        await super.prepare();
        await this.addExportPathMapRoutes();
        await this.hotReloader.start();
        await this.startWatcher();
        this.setDevReady();
        const telemetry = new _storage.Telemetry({
            distDir: this.distDir
        });
        telemetry.record((0, _events).eventCliSession(this.distDir, this.nextConfig, {
            webpackVersion: 5,
            cliCommand: 'dev',
            isSrcDir: (0, _path).relative(this.dir, this.pagesDir).startsWith('src'),
            hasNowJson: !!await (0, _findUp).default('now.json', {
                cwd: this.dir
            }),
            isCustomServer: this.isCustomServer
        }));
        // This is required by the tracing subsystem.
        (0, _trace).setGlobal('telemetry', telemetry);
        process.on('unhandledRejection', (reason)=>{
            this.logErrorWithOriginalStack(reason, 'unhandledRejection').catch(()=>{
            });
        });
        process.on('uncaughtException', (err)=>{
            this.logErrorWithOriginalStack(err, 'uncaughtException').catch(()=>{
            });
        });
    }
    async close() {
        await this.stopWatcher();
        await this.getStaticPathsWorker().end();
        if (this.hotReloader) {
            await this.hotReloader.stop();
        }
    }
    async hasPage(pathname) {
        let normalizedPath;
        try {
            normalizedPath = (0, _normalizePagePath).normalizePagePath(pathname);
        } catch (err) {
            console.error(err);
            // if normalizing the page fails it means it isn't valid
            // so it doesn't exist so don't throw and return false
            // to ensure we return 404 instead of 500
            return false;
        }
        const pageFile = await (0, _findPageFile).findPageFile(this.pagesDir, normalizedPath, this.nextConfig.pageExtensions);
        return !!pageFile;
    }
    async _beforeCatchAllRender(req, res, params, parsedUrl) {
        const { pathname  } = parsedUrl;
        const pathParts = params.path || [];
        const path = `/${pathParts.join('/')}`;
        // check for a public file, throwing error if there's a
        // conflicting page
        let decodedPath;
        try {
            decodedPath = decodeURIComponent(path);
        } catch (_) {
            throw new _utils2.DecodeError('failed to decode param');
        }
        if (await this.hasPublicFile(decodedPath)) {
            if (await this.hasPage(pathname)) {
                const err = new Error(`A conflicting public file and page file was found for path ${pathname} https://nextjs.org/docs/messages/conflicting-public-file-page`);
                res.statusCode = 500;
                await this.renderError(err, req, res, pathname, {
                });
                return true;
            }
            await this.servePublic(req, res, pathParts);
            return true;
        }
        return false;
    }
    setupWebSocketHandler(server, _req) {
        if (!this.addedUpgradeListener) {
            var ref;
            this.addedUpgradeListener = true;
            server = server || ((ref = _req === null || _req === void 0 ? void 0 : _req.originalRequest.socket) === null || ref === void 0 ? void 0 : ref.server);
            if (!server) {
                // this is very unlikely to happen but show an error in case
                // it does somehow
                Log.error(`Invalid IncomingMessage received, make sure http.createServer is being used to handle requests.`);
            } else {
                const { basePath  } = this.nextConfig;
                server.on('upgrade', (req, socket, head)=>{
                    var ref;
                    let assetPrefix = (this.nextConfig.assetPrefix || '').replace(/^\/+/, '');
                    // assetPrefix can be a proxy server with a url locally
                    // if so, it's needed to send these HMR requests with a rewritten url directly to /_next/webpack-hmr
                    // otherwise account for a path-like prefix when listening to socket events
                    if (assetPrefix.startsWith('http')) {
                        assetPrefix = '';
                    } else if (assetPrefix) {
                        assetPrefix = `/${assetPrefix}`;
                    }
                    if ((ref = req.url) === null || ref === void 0 ? void 0 : ref.startsWith(`${basePath || assetPrefix || ''}/_next/webpack-hmr`)) {
                        var ref1;
                        (ref1 = this.hotReloader) === null || ref1 === void 0 ? void 0 : ref1.onHMR(req, socket, head);
                    }
                });
            }
        }
    }
    async runMiddleware(params) {
        try {
            const result = await super.runMiddleware({
                ...params,
                onWarning: (warn)=>{
                    this.logErrorWithOriginalStack(warn, 'warning', 'client');
                }
            });
            result === null || result === void 0 ? void 0 : result.waitUntil.catch((error)=>this.logErrorWithOriginalStack(error, 'unhandledRejection', 'client')
            );
            return result;
        } catch (error) {
            this.logErrorWithOriginalStack(error, undefined, 'client');
            const err = (0, _isError).getProperError(error);
            err.middleware = true;
            const { request , response , parsedUrl  } = params;
            this.renderError(err, request, response, parsedUrl.pathname);
            return null;
        }
    }
    async run(req, res, parsedUrl) {
        await this.devReady;
        this.setupWebSocketHandler(undefined, req);
        const { basePath  } = this.nextConfig;
        let originalPathname = null;
        if (basePath && (0, _router).hasBasePath(parsedUrl.pathname || '/', basePath)) {
            // strip basePath before handling dev bundles
            // If replace ends up replacing the full url it'll be `undefined`, meaning we have to default it to `/`
            originalPathname = parsedUrl.pathname;
            parsedUrl.pathname = (0, _router).replaceBasePath(parsedUrl.pathname || '/', basePath);
        }
        const { pathname  } = parsedUrl;
        if (pathname.startsWith('/_next')) {
            if (await (0, _fileExists).fileExists((0, _path).join(this.publicDir, '_next'))) {
                throw new Error(_constants.PUBLIC_DIR_MIDDLEWARE_CONFLICT);
            }
        }
        const { finished =false  } = await this.hotReloader.run(req.originalRequest, res.originalResponse, parsedUrl);
        if (finished) {
            return;
        }
        if (originalPathname) {
            // restore the path before continuing so that custom-routes can accurately determine
            // if they should match against the basePath or not
            parsedUrl.pathname = originalPathname;
        }
        try {
            return await super.run(req, res, parsedUrl);
        } catch (error) {
            res.statusCode = 500;
            const err = (0, _isError).getProperError(error);
            try {
                this.logErrorWithOriginalStack(err).catch(()=>{
                });
                return await this.renderError(err, req, res, pathname, {
                    __NEXT_PAGE: (0, _isError).default(err) && err.page || pathname || ''
                });
            } catch (internalErr) {
                console.error(internalErr);
                res.body('Internal Server Error').send();
            }
        }
    }
    async logErrorWithOriginalStack(err, type, stats = 'server') {
        let usedOriginalStack = false;
        if ((0, _isError).default(err) && err.name && err.stack && err.message) {
            try {
                const frames = (0, _middleware).parseStack(err.stack);
                const frame = frames[0];
                if (frame.lineNumber && (frame === null || frame === void 0 ? void 0 : frame.file)) {
                    var ref, ref1, ref2, ref3, ref4, ref5;
                    const compilation = stats === 'client' ? (ref = this.hotReloader) === null || ref === void 0 ? void 0 : (ref1 = ref.clientStats) === null || ref1 === void 0 ? void 0 : ref1.compilation : (ref2 = this.hotReloader) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.serverStats) === null || ref3 === void 0 ? void 0 : ref3.compilation;
                    const moduleId = frame.file.replace(/^(webpack-internal:\/\/\/|file:\/\/)/, '');
                    const source = await (0, _middleware).getSourceById(!!((ref4 = frame.file) === null || ref4 === void 0 ? void 0 : ref4.startsWith(_path.sep)) || !!((ref5 = frame.file) === null || ref5 === void 0 ? void 0 : ref5.startsWith('file:')), moduleId, compilation);
                    const originalFrame = await (0, _middleware).createOriginalStackFrame({
                        line: frame.lineNumber,
                        column: frame.column,
                        source,
                        frame,
                        modulePath: moduleId,
                        rootDirectory: this.dir
                    });
                    if (originalFrame) {
                        const { originalCodeFrame , originalStackFrame  } = originalFrame;
                        const { file , lineNumber , column , methodName  } = originalStackFrame;
                        console.error((type === 'warning' ? _chalk.default.yellow('warn') : _chalk.default.red('error')) + ' - ' + `${file} (${lineNumber}:${column}) @ ${methodName}`);
                        console.error(`${(type === 'warning' ? _chalk.default.yellow : _chalk.default.red)(err.name)}: ${err.message}`);
                        console.error(originalCodeFrame);
                        usedOriginalStack = true;
                    }
                }
            } catch (_) {
            // failed to load original stack using source maps
            // this un-actionable by users so we don't show the
            // internal error and only show the provided stack
            }
        }
        if (!usedOriginalStack) {
            if (type === 'warning') {
                Log.warn(err + '');
            } else if (type) {
                Log.error(`${type}:`, err + '');
            } else {
                Log.error(err + '');
            }
        }
    }
    // override production loading of routes-manifest
    getCustomRoutes() {
        // actual routes will be loaded asynchronously during .prepare()
        return {
            redirects: [],
            rewrites: {
                beforeFiles: [],
                afterFiles: [],
                fallback: []
            },
            headers: []
        };
    }
    getPreviewProps() {
        if (this._devCachedPreviewProps) {
            return this._devCachedPreviewProps;
        }
        return this._devCachedPreviewProps = {
            previewModeId: _crypto.default.randomBytes(16).toString('hex'),
            previewModeSigningKey: _crypto.default.randomBytes(32).toString('hex'),
            previewModeEncryptionKey: _crypto.default.randomBytes(32).toString('hex')
        };
    }
    getPagesManifest() {
        return undefined;
    }
    getMiddleware() {
        return [];
    }
    getMiddlewareManifest() {
        return undefined;
    }
    getServerComponentManifest() {
        return undefined;
    }
    async hasMiddleware(pathname, isSSR) {
        return this.hasPage(isSSR ? pathname : getMiddlewareFilepath(pathname));
    }
    async ensureMiddleware(pathname, isSSR) {
        return this.hotReloader.ensurePage(isSSR ? pathname : getMiddlewareFilepath(pathname));
    }
    generateRoutes() {
        const { fsRoutes , ...otherRoutes } = super.generateRoutes();
        // In development we expose all compiled files for react-error-overlay's line show feature
        // We use unshift so that we're sure the routes is defined before Next's default routes
        fsRoutes.unshift({
            match: (0, _router).route('/_next/development/:path*'),
            type: 'route',
            name: '_next/development catchall',
            fn: async (req, res, params)=>{
                const p = (0, _path).join(this.distDir, ...params.path || []);
                await this.serveStatic(req, res, p);
                return {
                    finished: true
                };
            }
        });
        fsRoutes.unshift({
            match: (0, _router).route(`/_next/${_constants1.CLIENT_STATIC_FILES_PATH}/${this.buildId}/${_constants1.DEV_CLIENT_PAGES_MANIFEST}`),
            type: 'route',
            name: `_next/${_constants1.CLIENT_STATIC_FILES_PATH}/${this.buildId}/${_constants1.DEV_CLIENT_PAGES_MANIFEST}`,
            fn: async (_req, res)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.body(JSON.stringify({
                    pages: this.sortedRoutes
                })).send();
                return {
                    finished: true
                };
            }
        });
        fsRoutes.unshift({
            match: (0, _router).route(`/_next/${_constants1.CLIENT_STATIC_FILES_PATH}/${this.buildId}/${_constants1.DEV_MIDDLEWARE_MANIFEST}`),
            type: 'route',
            name: `_next/${_constants1.CLIENT_STATIC_FILES_PATH}/${this.buildId}/${_constants1.DEV_MIDDLEWARE_MANIFEST}`,
            fn: async (_req, res)=>{
                var ref;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.body(JSON.stringify(((ref = this.middleware) === null || ref === void 0 ? void 0 : ref.map((middleware)=>[
                        middleware.page,
                        !!middleware.ssr, 
                    ]
                )) || [])).send();
                return {
                    finished: true
                };
            }
        });
        fsRoutes.push({
            match: (0, _router).route('/:path*'),
            type: 'route',
            requireBasePath: false,
            name: 'catchall public directory route',
            fn: async (req, res, params, parsedUrl)=>{
                const { pathname  } = parsedUrl;
                if (!pathname) {
                    throw new Error('pathname is undefined');
                }
                // Used in development to check public directory paths
                if (await this._beforeCatchAllRender(req, res, params, parsedUrl)) {
                    return {
                        finished: true
                    };
                }
                return {
                    finished: false
                };
            }
        });
        return {
            fsRoutes,
            ...otherRoutes
        };
    }
    // In development public files are not added to the router but handled as a fallback instead
    generatePublicRoutes() {
        return [];
    }
    // In development dynamic routes cannot be known ahead of time
    getDynamicRoutes() {
        return [];
    }
    _filterAmpDevelopmentScript(html, event) {
        if (event.code !== 'DISALLOWED_SCRIPT_TAG') {
            return true;
        }
        const snippetChunks = html.split('\n');
        let snippet;
        if (!(snippet = html.split('\n')[event.line - 1]) || !(snippet = snippet.substring(event.col))) {
            return true;
        }
        snippet = snippet + snippetChunks.slice(event.line).join('\n');
        snippet = snippet.substring(0, snippet.indexOf('</script>'));
        return !snippet.includes('data-amp-development-mode-only');
    }
    async getStaticPaths(pathname) {
        // we lazy load the staticPaths to prevent the user
        // from waiting on them for the page to load in dev mode
        const __getStaticPaths = async ()=>{
            const { configFileName , publicRuntimeConfig , serverRuntimeConfig , httpAgentOptions ,  } = this.nextConfig;
            const { locales , defaultLocale  } = this.nextConfig.i18n || {
            };
            const paths = await this.getStaticPathsWorker().loadStaticPaths(this.distDir, pathname, !this.renderOpts.dev && this._isLikeServerless, {
                configFileName,
                publicRuntimeConfig,
                serverRuntimeConfig
            }, httpAgentOptions, locales, defaultLocale);
            return paths;
        };
        const { paths: staticPaths , fallback  } = (await (0, _coalescedFunction).withCoalescedInvoke(__getStaticPaths)(`staticPaths-${pathname}`, [])).value;
        return {
            staticPaths,
            fallbackMode: fallback === 'blocking' ? 'blocking' : fallback === true ? 'static' : false
        };
    }
    async ensureApiPage(pathname) {
        return this.hotReloader.ensurePage(pathname);
    }
    async findPageComponents(pathname, query = {
    }, params = null) {
        await this.devReady;
        const compilationErr = await this.getCompilationError(pathname);
        if (compilationErr) {
            // Wrap build errors so that they don't get logged again
            throw new _nextServer.WrappedBuildError(compilationErr);
        }
        try {
            await this.hotReloader.ensurePage(pathname);
            // When the new page is compiled, we need to reload the server component
            // manifest.
            if (this.nextConfig.experimental.serverComponents) {
                this.serverComponentManifest = super.getServerComponentManifest();
            }
            return super.findPageComponents(pathname, query, params);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
            return null;
        }
    }
    async getFallbackErrorComponents() {
        await this.hotReloader.buildFallbackError();
        // Build the error page to ensure the fallback is built too.
        // TODO: See if this can be moved into hotReloader or removed.
        await this.hotReloader.ensurePage('/_error');
        return await (0, _loadComponents).loadDefaultErrorComponents(this.distDir, {
            hasConcurrentFeatures: !!this.renderOpts.runtime
        });
    }
    setImmutableAssetCacheControl(res) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
    }
    servePublic(req, res, pathParts) {
        const p = (0, _path).join(this.publicDir, ...pathParts);
        return this.serveStatic(req, res, p);
    }
    async hasPublicFile(path) {
        try {
            const info = await _fs.default.promises.stat((0, _path).join(this.publicDir, path));
            return info.isFile();
        } catch (_) {
            return false;
        }
    }
    async getCompilationError(page) {
        const errors = await this.hotReloader.getCompilationErrors(page);
        if (errors.length === 0) return;
        // Return the very first error we found.
        return errors[0];
    }
    isServeableUrl(untrustedFileUrl) {
        // This method mimics what the version of `send` we use does:
        // 1. decodeURIComponent:
        //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L989
        //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L518-L522
        // 2. resolve:
        //    https://github.com/pillarjs/send/blob/de073ed3237ade9ff71c61673a34474b30e5d45b/index.js#L561
        let decodedUntrustedFilePath;
        try {
            // (1) Decode the URL so we have the proper file name
            decodedUntrustedFilePath = decodeURIComponent(untrustedFileUrl);
        } catch  {
            return false;
        }
        // (2) Resolve "up paths" to determine real request
        const untrustedFilePath = (0, _path).resolve(decodedUntrustedFilePath);
        // don't allow null bytes anywhere in the file path
        if (untrustedFilePath.indexOf('\x00') !== -1) {
            return false;
        }
        // During development mode, files can be added while the server is running.
        // Checks for .next/static, .next/server, static and public.
        // Note that in development .next/server is available for error reporting purposes.
        // see `packages/next/server/next-server.ts` for more details.
        if (untrustedFilePath.startsWith((0, _path).join(this.distDir, 'static') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.distDir, 'server') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.dir, 'static') + _path.sep) || untrustedFilePath.startsWith((0, _path).join(this.dir, 'public') + _path.sep)) {
            return true;
        }
        return false;
    }
}
exports.default = DevServer;
function getMiddlewareFilepath(pathname) {
    return pathname.endsWith('/') ? `${pathname}_middleware` : `${pathname}/_middleware`;
}

//# sourceMappingURL=next-dev-server.js.map