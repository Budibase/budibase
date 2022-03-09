"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderScriptError = renderScriptError;
exports.default = void 0;
var _middleware = require("next/dist/compiled/@next/react-dev-overlay/middleware");
var _hotMiddleware = require("./hot-middleware");
var _path = require("path");
var _webpack = require("next/dist/compiled/webpack/webpack");
var _entries = require("../../build/entries");
var _output = require("../../build/output");
var _webpackConfig = _interopRequireDefault(require("../../build/webpack-config"));
var _constants = require("../../lib/constants");
var _recursiveDelete = require("../../lib/recursive-delete");
var _constants1 = require("../../shared/lib/constants");
var _router = require("../router");
var _findPageFile = require("../lib/find-page-file");
var _onDemandEntryHandler = _interopRequireWildcard(require("./on-demand-entry-handler"));
var _normalizePagePath = require("../normalize-page-path");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../get-route-from-entrypoint"));
var _fileExists = require("../../lib/file-exists");
var _middlewarePlugin = require("../../build/webpack/plugins/middleware-plugin");
var _querystring = require("querystring");
var _utils = require("../../build/utils");
var _utils1 = require("../../shared/lib/utils");
var _trace = require("../../trace");
var _isError = require("../../lib/is-error");
var _ws = _interopRequireDefault(require("next/dist/compiled/ws"));
var _fs = require("fs");
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
const wsServer = new _ws.default.Server({
    noServer: true
});
async function renderScriptError(res, error, { verbose =true  } = {
}) {
    // Asks CDNs and others to not to cache the errored page
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    if (error.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('404 - Not Found');
        return;
    }
    if (verbose) {
        console.error(error.stack);
    }
    res.statusCode = 500;
    res.end('500 - Internal Error');
}
function addCorsSupport(req, res) {
    const isApiRoute = req.url.match(_constants.API_ROUTE);
    // API routes handle their own CORS headers
    if (isApiRoute) {
        return {
            preflight: false
        };
    }
    if (!req.headers.origin) {
        return {
            preflight: false
        };
    }
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    // Based on https://github.com/primus/access-control/blob/4cf1bc0e54b086c91e6aa44fb14966fa5ef7549c/index.js#L158
    if (req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    }
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return {
            preflight: true
        };
    }
    return {
        preflight: false
    };
}
const matchNextPageBundleRequest = (0, _router).route('/_next/static/chunks/pages/:path*.js(\\.map|)');
// Recursively look up the issuer till it ends up at the root
function findEntryModule(issuer) {
    if (issuer.issuer) {
        return findEntryModule(issuer.issuer);
    }
    return issuer;
}
function erroredPages(compilation) {
    const failedPages = {
    };
    for (const error of compilation.errors){
        if (!error.module) {
            continue;
        }
        const entryModule = findEntryModule(error.module);
        const { name  } = entryModule;
        if (!name) {
            continue;
        }
        // Only pages have to be reloaded
        const enhancedName = (0, _getRouteFromEntrypoint).default(name);
        if (!enhancedName) {
            continue;
        }
        if (!failedPages[enhancedName]) {
            failedPages[enhancedName] = [];
        }
        failedPages[enhancedName].push(error);
    }
    return failedPages;
}
class HotReloader {
    constructor(dir, { config , pagesDir , buildId , previewProps , rewrites  }){
        this.clientError = null;
        this.serverError = null;
        this.pagesMapping = {
        };
        this.buildId = buildId;
        this.dir = dir;
        this.middlewares = [];
        this.pagesDir = pagesDir;
        this.clientStats = null;
        this.serverStats = null;
        this.serverPrevDocumentHash = null;
        this.config = config;
        this.runtime = config.experimental.runtime;
        this.hasServerComponents = !!(this.runtime && config.experimental.serverComponents);
        this.previewProps = previewProps;
        this.rewrites = rewrites;
        this.hotReloaderSpan = (0, _trace).trace('hot-reloader', undefined, {
            version: "12.1.0"
        });
        // Ensure the hotReloaderSpan is flushed immediately as it's the parentSpan for all processing
        // of the current `next dev` invocation.
        this.hotReloaderSpan.stop();
    }
    async run(req, res, parsedUrl) {
        // Usually CORS support is not needed for the hot-reloader (this is dev only feature)
        // With when the app runs for multi-zones support behind a proxy,
        // the current page is trying to access this URL via assetPrefix.
        // That's when the CORS support is needed.
        const { preflight  } = addCorsSupport(req, res);
        if (preflight) {
            return {
            };
        }
        // When a request comes in that is a page bundle, e.g. /_next/static/<buildid>/pages/index.js
        // we have to compile the page using on-demand-entries, this middleware will handle doing that
        // by adding the page to on-demand-entries, waiting till it's done
        // and then the bundle will be served like usual by the actual route in server/index.js
        const handlePageBundleRequest = async (pageBundleRes, parsedPageBundleUrl)=>{
            const { pathname  } = parsedPageBundleUrl;
            const params = matchNextPageBundleRequest(pathname);
            if (!params) {
                return {
                };
            }
            let decodedPagePath;
            try {
                decodedPagePath = `/${params.path.map((param)=>decodeURIComponent(param)
                ).join('/')}`;
            } catch (_) {
                throw new _utils1.DecodeError('failed to decode param');
            }
            const page = (0, _normalizePagePath).denormalizePagePath(decodedPagePath);
            if (page === '/_error' || _constants1.BLOCKED_PAGES.indexOf(page) === -1) {
                try {
                    await this.ensurePage(page, true);
                } catch (error) {
                    await renderScriptError(pageBundleRes, (0, _isError).getProperError(error));
                    return {
                        finished: true
                    };
                }
                const errors = await this.getCompilationErrors(page);
                if (errors.length > 0) {
                    await renderScriptError(pageBundleRes, errors[0], {
                        verbose: false
                    });
                    return {
                        finished: true
                    };
                }
            }
            return {
            };
        };
        const { finished  } = await handlePageBundleRequest(res, parsedUrl);
        for (const fn of this.middlewares){
            await new Promise((resolve, reject)=>{
                fn(req, res, (err)=>{
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
        return {
            finished
        };
    }
    onHMR(req, _res, head) {
        wsServer.handleUpgrade(req, req.socket, head, (client)=>{
            var ref, ref1;
            (ref = this.webpackHotMiddleware) === null || ref === void 0 ? void 0 : ref.onHMR(client);
            (ref1 = this.onDemandEntries) === null || ref1 === void 0 ? void 0 : ref1.onHMR(client);
        });
    }
    async clean(span) {
        return span.traceChild('clean').traceAsyncFn(()=>(0, _recursiveDelete).recursiveDelete((0, _path).join(this.dir, this.config.distDir), /^cache/)
        );
    }
    async getWebpackConfig(span) {
        const webpackConfigSpan = span.traceChild('get-webpack-config');
        return webpackConfigSpan.traceAsyncFn(async ()=>{
            const pagePaths = await webpackConfigSpan.traceChild('get-page-paths').traceAsyncFn(()=>Promise.all([
                    (0, _findPageFile).findPageFile(this.pagesDir, '/_app', this.config.pageExtensions),
                    (0, _findPageFile).findPageFile(this.pagesDir, '/_document', this.config.pageExtensions), 
                ])
            );
            this.pagesMapping = webpackConfigSpan.traceChild('create-pages-mapping').traceFn(()=>(0, _entries).createPagesMapping(pagePaths.filter((i)=>i !== null
                ), this.config.pageExtensions, {
                    isDev: true,
                    runtime: this.config.experimental.runtime,
                    hasServerComponents: this.hasServerComponents
                })
            );
            const entrypoints = webpackConfigSpan.traceChild('create-entrypoints').traceFn(()=>(0, _entries).createEntrypoints(this.pagesMapping, 'server', this.buildId, this.previewProps, this.config, [])
            );
            return webpackConfigSpan.traceChild('generate-webpack-config').traceAsyncFn(()=>Promise.all([
                    (0, _webpackConfig).default(this.dir, {
                        dev: true,
                        isServer: false,
                        config: this.config,
                        buildId: this.buildId,
                        pagesDir: this.pagesDir,
                        rewrites: this.rewrites,
                        entrypoints: entrypoints.client,
                        runWebpackSpan: this.hotReloaderSpan
                    }),
                    (0, _webpackConfig).default(this.dir, {
                        dev: true,
                        isServer: true,
                        config: this.config,
                        buildId: this.buildId,
                        pagesDir: this.pagesDir,
                        rewrites: this.rewrites,
                        entrypoints: entrypoints.server,
                        runWebpackSpan: this.hotReloaderSpan
                    }),
                    // For the edge runtime, we need an extra compiler to generate the
                    // web-targeted server bundle for now.
                    this.runtime === 'edge' ? (0, _webpackConfig).default(this.dir, {
                        dev: true,
                        isServer: true,
                        isEdgeRuntime: true,
                        config: this.config,
                        buildId: this.buildId,
                        pagesDir: this.pagesDir,
                        rewrites: this.rewrites,
                        entrypoints: entrypoints.edgeServer,
                        runWebpackSpan: this.hotReloaderSpan
                    }) : null, 
                ].filter(Boolean))
            );
        });
    }
    async buildFallbackError() {
        if (this.fallbackWatcher) return;
        const fallbackConfig = await (0, _webpackConfig).default(this.dir, {
            runWebpackSpan: this.hotReloaderSpan,
            dev: true,
            isServer: false,
            config: this.config,
            buildId: this.buildId,
            pagesDir: this.pagesDir,
            rewrites: {
                beforeFiles: [],
                afterFiles: [],
                fallback: []
            },
            isDevFallback: true,
            entrypoints: (0, _entries).createEntrypoints({
                '/_app': 'next/dist/pages/_app',
                '/_error': 'next/dist/pages/_error'
            }, 'server', this.buildId, this.previewProps, this.config, []).client
        });
        const fallbackCompiler = (0, _webpack).webpack(fallbackConfig);
        this.fallbackWatcher = await new Promise((resolve)=>{
            let bootedFallbackCompiler = false;
            fallbackCompiler.watch(// @ts-ignore webpack supports an array of watchOptions when using a multiCompiler
            fallbackConfig.watchOptions, // Errors are handled separately
            (_err)=>{
                if (!bootedFallbackCompiler) {
                    bootedFallbackCompiler = true;
                    resolve(true);
                }
            });
        });
    }
    async start() {
        const startSpan = this.hotReloaderSpan.traceChild('start');
        startSpan.stop() // Stop immediately to create an artificial parent span
        ;
        await this.clean(startSpan);
        // Ensure distDir exists before writing package.json
        await _fs.promises.mkdir(this.config.distDir, {
            recursive: true
        });
        // Ensure commonjs handling is used for files in the distDir (generally .next)
        // Files outside of the distDir can be "type": "module"
        await _fs.promises.writeFile((0, _path).join(this.config.distDir, 'package.json'), '{"type": "commonjs"}');
        const configs = await this.getWebpackConfig(startSpan);
        for (const config of configs){
            const defaultEntry = config.entry;
            config.entry = async (...args)=>{
                // @ts-ignore entry is always a function
                const entrypoints = await defaultEntry(...args);
                const isClientCompilation = config.name === 'client';
                const isNodeServerCompilation = config.name === 'server';
                const isEdgeServerCompilation = config.name === 'edge-server';
                await Promise.all(Object.keys(_onDemandEntryHandler.entries).map(async (pageKey)=>{
                    const isClientKey = pageKey.startsWith('client');
                    const isEdgeServerKey = pageKey.startsWith('edge-server');
                    if (isClientKey !== isClientCompilation) return;
                    if (isEdgeServerKey !== isEdgeServerCompilation) return;
                    const page = pageKey.slice(isClientKey ? 'client'.length : isEdgeServerKey ? 'edge-server'.length : 'server'.length);
                    const isMiddleware = !!page.match(_constants.MIDDLEWARE_ROUTE);
                    if (isClientCompilation && page.match(_constants.API_ROUTE) && !isMiddleware) {
                        return;
                    }
                    const isApiRoute = page.match(_constants.API_ROUTE);
                    if (!isClientCompilation && isMiddleware) {
                        return;
                    }
                    const { bundlePath , absolutePagePath , dispose  } = _onDemandEntryHandler.entries[pageKey];
                    const pageExists = !dispose && await (0, _fileExists).fileExists(absolutePagePath);
                    if (!pageExists) {
                        // page was removed or disposed
                        delete _onDemandEntryHandler.entries[pageKey];
                        return;
                    }
                    const isCustomError = (0, _utils).isCustomErrorPage(page);
                    const isReserved = (0, _utils).isReservedPage(page);
                    const isServerComponent = this.hasServerComponents && (0, _utils).isFlightPage(this.config, absolutePagePath);
                    if (isNodeServerCompilation && this.runtime === 'edge' && !isApiRoute && !isCustomError) {
                        return;
                    }
                    _onDemandEntryHandler.entries[pageKey].status = _onDemandEntryHandler.BUILDING;
                    const pageLoaderOpts = {
                        page,
                        absolutePagePath
                    };
                    if (isClientCompilation && isMiddleware) {
                        entrypoints[bundlePath] = (0, _entries).finalizeEntrypoint({
                            name: bundlePath,
                            value: `next-middleware-loader?${(0, _querystring).stringify(pageLoaderOpts)}!`,
                            isServer: false,
                            isMiddleware: true
                        });
                    } else if (isClientCompilation) {
                        entrypoints[bundlePath] = (0, _entries).finalizeEntrypoint({
                            name: bundlePath,
                            value: `next-client-pages-loader?${(0, _querystring).stringify(pageLoaderOpts)}!`,
                            isServer: false
                        });
                        if (isServerComponent) {
                            _middlewarePlugin.ssrEntries.set(bundlePath, {
                                requireFlightManifest: true
                            });
                        } else if (this.runtime === 'edge' && !isReserved && !isCustomError) {
                            _middlewarePlugin.ssrEntries.set(bundlePath, {
                                requireFlightManifest: false
                            });
                        }
                    } else if (isEdgeServerCompilation) {
                        if (!isReserved) {
                            entrypoints[bundlePath] = (0, _entries).finalizeEntrypoint({
                                name: '[name].js',
                                value: `next-middleware-ssr-loader?${(0, _querystring).stringify({
                                    dev: true,
                                    page,
                                    stringifiedConfig: JSON.stringify(this.config),
                                    absoluteAppPath: this.pagesMapping['/_app'],
                                    absoluteDocumentPath: this.pagesMapping['/_document'],
                                    absoluteErrorPath: this.pagesMapping['/_error'],
                                    absolute404Path: this.pagesMapping['/404'] || '',
                                    absolutePagePath,
                                    isServerComponent,
                                    buildId: this.buildId
                                })}!`,
                                isServer: false,
                                isEdgeServer: true
                            });
                        }
                    } else {
                        let request = (0, _path).relative(config.context, absolutePagePath);
                        if (!(0, _path).isAbsolute(request) && !request.startsWith('../')) {
                            request = `./${request}`;
                        }
                        entrypoints[bundlePath] = (0, _entries).finalizeEntrypoint({
                            name: bundlePath,
                            value: request,
                            isServer: true
                        });
                    }
                }));
                return entrypoints;
            };
        }
        // Enable building of client compilation before server compilation in development
        // @ts-ignore webpack 5
        configs.parallelism = 1;
        const multiCompiler = (0, _webpack).webpack(configs);
        (0, _output).watchCompilers(multiCompiler.compilers[0], multiCompiler.compilers[1], multiCompiler.compilers[2] || null);
        // Watch for changes to client/server page files so we can tell when just
        // the server file changes and trigger a reload for GS(S)P pages
        const changedClientPages = new Set();
        const changedServerPages = new Set();
        const prevClientPageHashes = new Map();
        const prevServerPageHashes = new Map();
        const trackPageChanges = (pageHashMap, changedItems)=>(stats)=>{
                try {
                    stats.entrypoints.forEach((entry, key)=>{
                        if (key.startsWith('pages/')) {
                            // TODO this doesn't handle on demand loaded chunks
                            entry.chunks.forEach((chunk)=>{
                                if (chunk.id === key) {
                                    const modsIterable = stats.chunkGraph.getChunkModulesIterable(chunk);
                                    let chunksHash = new _webpack.StringXor();
                                    modsIterable.forEach((mod)=>{
                                        if (mod.resource && mod.resource.replace(/\\/g, '/').includes(key)) {
                                            // use original source to calculate hash since mod.hash
                                            // includes the source map in development which changes
                                            // every time for both server and client so we calculate
                                            // the hash without the source map for the page module
                                            const hash = require('crypto').createHash('sha256').update(mod.originalSource().buffer()).digest().toString('hex');
                                            chunksHash.add(hash);
                                        } else {
                                            // for non-pages we can use the module hash directly
                                            const hash = stats.chunkGraph.getModuleHash(mod, chunk.runtime);
                                            chunksHash.add(hash);
                                        }
                                    });
                                    const prevHash = pageHashMap.get(key);
                                    const curHash = chunksHash.toString();
                                    if (prevHash && prevHash !== curHash) {
                                        changedItems.add(key);
                                    }
                                    pageHashMap.set(key, curHash);
                                }
                            });
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        ;
        multiCompiler.compilers[0].hooks.emit.tap('NextjsHotReloaderForClient', trackPageChanges(prevClientPageHashes, changedClientPages));
        multiCompiler.compilers[1].hooks.emit.tap('NextjsHotReloaderForServer', trackPageChanges(prevServerPageHashes, changedServerPages));
        // This plugin watches for changes to _document.js and notifies the client side that it should reload the page
        multiCompiler.compilers[1].hooks.failed.tap('NextjsHotReloaderForServer', (err)=>{
            this.serverError = err;
            this.serverStats = null;
        });
        multiCompiler.compilers[1].hooks.done.tap('NextjsHotReloaderForServer', (stats)=>{
            this.serverError = null;
            this.serverStats = stats;
            const { compilation  } = stats;
            // We only watch `_document` for changes on the server compilation
            // the rest of the files will be triggered by the client compilation
            const documentChunk = compilation.namedChunks.get('pages/_document');
            // If the document chunk can't be found we do nothing
            if (!documentChunk) {
                console.warn('_document.js chunk not found');
                return;
            }
            // Initial value
            if (this.serverPrevDocumentHash === null) {
                this.serverPrevDocumentHash = documentChunk.hash || null;
                return;
            }
            // If _document.js didn't change we don't trigger a reload
            if (documentChunk.hash === this.serverPrevDocumentHash) {
                return;
            }
            // Notify reload to reload the page, as _document.js was changed (different hash)
            this.send('reloadPage');
            this.serverPrevDocumentHash = documentChunk.hash || null;
        });
        multiCompiler.hooks.done.tap('NextjsHotReloaderForServer', ()=>{
            const serverOnlyChanges = (0, _utils).difference(changedServerPages, changedClientPages);
            const middlewareChanges = Array.from(changedClientPages).filter((name)=>name.match(_constants.MIDDLEWARE_ROUTE)
            );
            changedClientPages.clear();
            changedServerPages.clear();
            if (middlewareChanges.length > 0) {
                this.send({
                    event: 'middlewareChanges'
                });
            }
            if (serverOnlyChanges.length > 0) {
                this.send({
                    event: 'serverOnlyChanges',
                    pages: serverOnlyChanges.map((pg)=>(0, _normalizePagePath).denormalizePagePath(pg.substr('pages'.length))
                    )
                });
            }
        });
        multiCompiler.compilers[0].hooks.failed.tap('NextjsHotReloaderForClient', (err)=>{
            this.clientError = err;
            this.clientStats = null;
        });
        multiCompiler.compilers[0].hooks.done.tap('NextjsHotReloaderForClient', (stats)=>{
            this.clientError = null;
            this.clientStats = stats;
            const { compilation  } = stats;
            const chunkNames = new Set([
                ...compilation.namedChunks.keys()
            ].filter((name)=>!!(0, _getRouteFromEntrypoint).default(name)
            ));
            if (this.prevChunkNames) {
                // detect chunks which have to be replaced with a new template
                // e.g, pages/index.js <-> pages/_error.js
                const addedPages = diff(chunkNames, this.prevChunkNames);
                const removedPages = diff(this.prevChunkNames, chunkNames);
                if (addedPages.size > 0) {
                    for (const addedPage of addedPages){
                        const page = (0, _getRouteFromEntrypoint).default(addedPage);
                        this.send('addedPage', page);
                    }
                }
                if (removedPages.size > 0) {
                    for (const removedPage of removedPages){
                        const page = (0, _getRouteFromEntrypoint).default(removedPage);
                        this.send('removedPage', page);
                    }
                }
            }
            this.prevChunkNames = chunkNames;
        });
        this.webpackHotMiddleware = new _hotMiddleware.WebpackHotMiddleware(multiCompiler.compilers);
        let booted = false;
        this.watcher = await new Promise((resolve)=>{
            const watcher = multiCompiler.watch(// @ts-ignore webpack supports an array of watchOptions when using a multiCompiler
            configs.map((config)=>config.watchOptions
            ), // Errors are handled separately
            (_err)=>{
                if (!booted) {
                    booted = true;
                    resolve(watcher);
                }
            });
        });
        this.onDemandEntries = (0, _onDemandEntryHandler).default(this.watcher, multiCompiler, {
            pagesDir: this.pagesDir,
            nextConfig: this.config,
            ...this.config.onDemandEntries
        });
        this.middlewares = [
            (0, _middleware).getOverlayMiddleware({
                rootDirectory: this.dir,
                stats: ()=>this.clientStats
                ,
                serverStats: ()=>this.serverStats
            }), 
        ];
    }
    async stop() {
        await new Promise((resolve, reject)=>{
            this.watcher.close((err)=>err ? reject(err) : resolve(true)
            );
        });
        if (this.fallbackWatcher) {
            await new Promise((resolve, reject)=>{
                this.fallbackWatcher.close((err)=>err ? reject(err) : resolve(true)
                );
            });
        }
    }
    async getCompilationErrors(page) {
        var ref, ref6;
        const normalizedPage = (0, _normalizePagePath).normalizePathSep(page);
        if (this.clientError || this.serverError) {
            return [
                this.clientError || this.serverError
            ];
        } else if ((ref = this.clientStats) === null || ref === void 0 ? void 0 : ref.hasErrors()) {
            const { compilation  } = this.clientStats;
            const failedPages = erroredPages(compilation);
            // If there is an error related to the requesting page we display it instead of the first error
            if (failedPages[normalizedPage] && failedPages[normalizedPage].length > 0) {
                return failedPages[normalizedPage];
            }
            // If none were found we still have to show the other errors
            return this.clientStats.compilation.errors;
        } else if ((ref6 = this.serverStats) === null || ref6 === void 0 ? void 0 : ref6.hasErrors()) {
            const { compilation  } = this.serverStats;
            const failedPages = erroredPages(compilation);
            // If there is an error related to the requesting page we display it instead of the first error
            if (failedPages[normalizedPage] && failedPages[normalizedPage].length > 0) {
                return failedPages[normalizedPage];
            }
            // If none were found we still have to show the other errors
            return this.serverStats.compilation.errors;
        }
        return [];
    }
    send(action, ...args) {
        this.webpackHotMiddleware.publish(action && typeof action === 'object' ? action : {
            action,
            data: args
        });
    }
    async ensurePage(page, clientOnly = false) {
        var ref;
        // Make sure we don't re-build or dispose prebuilt pages
        if (page !== '/_error' && _constants1.BLOCKED_PAGES.indexOf(page) !== -1) {
            return;
        }
        const error = clientOnly ? this.clientError : this.serverError || this.clientError;
        if (error) {
            return Promise.reject(error);
        }
        return (ref = this.onDemandEntries) === null || ref === void 0 ? void 0 : ref.ensurePage(page, clientOnly);
    }
}
exports.default = HotReloader;
function diff(a, b) {
    return new Set([
        ...a
    ].filter((v)=>!b.has(v)
    ));
}

//# sourceMappingURL=hot-reloader.js.map