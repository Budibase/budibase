"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = build;
var _env = require("@next/env");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _crypto = _interopRequireDefault(require("crypto"));
var _micromatch = require("next/dist/compiled/micromatch");
var _fs = require("fs");
var _worker = require("../lib/worker");
var _devalue = _interopRequireDefault(require("next/dist/compiled/devalue"));
var _escapeRegexp = require("../shared/lib/escape-regexp");
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _indexCjs = require("next/dist/compiled/nanoid/index.cjs");
var _pathToRegexp = require("next/dist/compiled/path-to-regexp");
var _path = _interopRequireWildcard(require("path"));
var _formatWebpackMessages = _interopRequireDefault(require("../client/dev/error-overlay/format-webpack-messages"));
var _constants = require("../lib/constants");
var _fileExists = require("../lib/file-exists");
var _findPagesDir = require("../lib/find-pages-dir");
var _loadCustomRoutes = _interopRequireWildcard(require("../lib/load-custom-routes"));
var _nonNullable = require("../lib/non-nullable");
var _recursiveDelete = require("../lib/recursive-delete");
var _verifyAndLint = require("../lib/verifyAndLint");
var _verifyTypeScriptSetup = require("../lib/verifyTypeScriptSetup");
var _constants1 = require("../shared/lib/constants");
var _utils = require("../shared/lib/router/utils");
var _config = _interopRequireDefault(require("../server/config"));
var _utils1 = require("../server/utils");
var _normalizePagePath = require("../server/normalize-page-path");
var _require = require("../server/require");
var ciEnvironment = _interopRequireWildcard(require("../telemetry/ci-info"));
var _events = require("../telemetry/events");
var _storage = require("../telemetry/storage");
var _compiler = require("./compiler");
var _entries = require("./entries");
var _generateBuildId = require("./generate-build-id");
var _isWriteable = require("./is-writeable");
var Log = _interopRequireWildcard(require("./output/log"));
var _spinner = _interopRequireDefault(require("./spinner"));
var _trace = require("../trace");
var _utils2 = require("./utils");
var _webpackConfig = _interopRequireDefault(require("./webpack-config"));
var _writeBuildId = require("./write-build-id");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _telemetryPlugin = require("./webpack/plugins/telemetry-plugin");
var _recursiveCopy = require("../lib/recursive-copy");
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
async function build(dir, conf = null, reactProductionProfiling = false, debugOutput = false, runLint = true) {
    const nextBuildSpan = (0, _trace).trace('next-build', undefined, {
        version: "12.1.0"
    });
    const buildResult = await nextBuildSpan.traceAsyncFn(async ()=>{
        // attempt to load global env values so they are available in next.config.js
        const { loadedEnvFiles  } = nextBuildSpan.traceChild('load-dotenv').traceFn(()=>(0, _env).loadEnvConfig(dir, false, Log)
        );
        const config = await nextBuildSpan.traceChild('load-next-config').traceAsyncFn(()=>(0, _config).default(_constants1.PHASE_PRODUCTION_BUILD, dir, conf)
        );
        const distDir = _path.default.join(dir, config.distDir);
        (0, _trace).setGlobal('phase', _constants1.PHASE_PRODUCTION_BUILD);
        (0, _trace).setGlobal('distDir', distDir);
        // Currently, when the runtime option is set (either `nodejs` or `edge`),
        // we enable concurrent features (Fizz-related rendering architecture).
        const runtime = config.experimental.runtime;
        const hasConcurrentFeatures = !!runtime;
        const hasServerComponents = hasConcurrentFeatures && !!config.experimental.serverComponents;
        const { target  } = config;
        const buildId = await nextBuildSpan.traceChild('generate-buildid').traceAsyncFn(()=>(0, _generateBuildId).generateBuildId(config.generateBuildId, _indexCjs.nanoid)
        );
        const customRoutes = await nextBuildSpan.traceChild('load-custom-routes').traceAsyncFn(()=>(0, _loadCustomRoutes).default(config)
        );
        const { headers , rewrites , redirects  } = customRoutes;
        const cacheDir = _path.default.join(distDir, 'cache');
        if (ciEnvironment.isCI && !ciEnvironment.hasNextSupport) {
            const hasCache = await (0, _fileExists).fileExists(cacheDir);
            if (!hasCache) {
                // Intentionally not piping to stderr in case people fail in CI when
                // stderr is detected.
                console.log(`${Log.prefixes.warn} No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache`);
            }
        }
        const telemetry = new _storage.Telemetry({
            distDir
        });
        (0, _trace).setGlobal('telemetry', telemetry);
        const publicDir = _path.default.join(dir, 'public');
        const pagesDir = (0, _findPagesDir).findPagesDir(dir);
        const hasPublicDir = await (0, _fileExists).fileExists(publicDir);
        telemetry.record((0, _events).eventCliSession(dir, config, {
            webpackVersion: 5,
            cliCommand: 'build',
            isSrcDir: _path.default.relative(dir, pagesDir).startsWith('src'),
            hasNowJson: !!await (0, _findUp).default('now.json', {
                cwd: dir
            }),
            isCustomServer: null
        }));
        (0, _events).eventNextPlugins(_path.default.resolve(dir)).then((events)=>telemetry.record(events)
        );
        const ignoreTypeScriptErrors = Boolean(config.typescript.ignoreBuildErrors);
        const typeCheckStart = process.hrtime();
        const typeCheckingSpinner = (0, _spinner).default({
            prefixText: `${Log.prefixes.info} ${ignoreTypeScriptErrors ? 'Skipping validation of types' : 'Checking validity of types'}`
        });
        const verifyResult = await nextBuildSpan.traceChild('verify-typescript-setup').traceAsyncFn(()=>(0, _verifyTypeScriptSetup).verifyTypeScriptSetup(dir, pagesDir, !ignoreTypeScriptErrors, config, cacheDir)
        );
        const typeCheckEnd = process.hrtime(typeCheckStart);
        if (!ignoreTypeScriptErrors) {
            var ref, ref1, ref2;
            telemetry.record((0, _events).eventTypeCheckCompleted({
                durationInSeconds: typeCheckEnd[0],
                typescriptVersion: verifyResult.version,
                inputFilesCount: (ref = verifyResult.result) === null || ref === void 0 ? void 0 : ref.inputFilesCount,
                totalFilesCount: (ref1 = verifyResult.result) === null || ref1 === void 0 ? void 0 : ref1.totalFilesCount,
                incremental: (ref2 = verifyResult.result) === null || ref2 === void 0 ? void 0 : ref2.incremental
            }));
        }
        if (typeCheckingSpinner) {
            typeCheckingSpinner.stopAndPersist();
        }
        const ignoreESLint = Boolean(config.eslint.ignoreDuringBuilds);
        const eslintCacheDir = _path.default.join(cacheDir, 'eslint/');
        const shouldLint = !ignoreESLint && runLint;
        if (shouldLint) {
            await nextBuildSpan.traceChild('verify-and-lint').traceAsyncFn(async ()=>{
                var ref;
                await (0, _verifyAndLint).verifyAndLint(dir, eslintCacheDir, (ref = config.eslint) === null || ref === void 0 ? void 0 : ref.dirs, config.experimental.cpus, config.experimental.workerThreads, telemetry);
            });
        }
        const buildLintEvent = {
            featureName: 'build-lint',
            invocationCount: shouldLint ? 1 : 0
        };
        telemetry.record({
            eventName: _events.EVENT_BUILD_FEATURE_USAGE,
            payload: buildLintEvent
        });
        const buildSpinner = (0, _spinner).default({
            prefixText: `${Log.prefixes.info} Creating an optimized production build`
        });
        const isLikeServerless = (0, _utils1).isTargetLikeServerless(target);
        const pagePaths = await nextBuildSpan.traceChild('collect-pages').traceAsyncFn(()=>(0, _utils2).collectPages(pagesDir, config.pageExtensions)
        );
        // needed for static exporting since we want to replace with HTML
        // files
        const allStaticPages = new Set();
        let allPageInfos = new Map();
        const previewProps = {
            previewModeId: _crypto.default.randomBytes(16).toString('hex'),
            previewModeSigningKey: _crypto.default.randomBytes(32).toString('hex'),
            previewModeEncryptionKey: _crypto.default.randomBytes(32).toString('hex')
        };
        const mappedPages = nextBuildSpan.traceChild('create-pages-mapping').traceFn(()=>(0, _entries).createPagesMapping(pagePaths, config.pageExtensions, {
                isDev: false,
                hasServerComponents,
                runtime
            })
        );
        const entrypoints = nextBuildSpan.traceChild('create-entrypoints').traceFn(()=>(0, _entries).createEntrypoints(mappedPages, target, buildId, previewProps, config, loadedEnvFiles)
        );
        const pageKeys = Object.keys(mappedPages);
        const hasMiddleware = pageKeys.some((page)=>_constants.MIDDLEWARE_ROUTE.test(page)
        );
        const conflictingPublicFiles = [];
        const hasCustomErrorPage = mappedPages['/_error'].startsWith('private-next-pages');
        const hasPages404 = Boolean(mappedPages['/404'] && mappedPages['/404'].startsWith('private-next-pages'));
        if (hasMiddleware) {
            Log.warn(`using beta Middleware (not covered by semver) - https://nextjs.org/docs/messages/beta-middleware`);
        }
        if (hasPublicDir) {
            const hasPublicUnderScoreNextDir = await (0, _fileExists).fileExists(_path.default.join(publicDir, '_next'));
            if (hasPublicUnderScoreNextDir) {
                throw new Error(_constants.PUBLIC_DIR_MIDDLEWARE_CONFLICT);
            }
        }
        await nextBuildSpan.traceChild('public-dir-conflict-check').traceAsyncFn(async ()=>{
            // Check if pages conflict with files in `public`
            // Only a page of public file can be served, not both.
            for(const page in mappedPages){
                const hasPublicPageFile = await (0, _fileExists).fileExists(_path.default.join(publicDir, page === '/' ? '/index' : page), 'file');
                if (hasPublicPageFile) {
                    conflictingPublicFiles.push(page);
                }
            }
            const numConflicting = conflictingPublicFiles.length;
            if (numConflicting) {
                throw new Error(`Conflicting public and page file${numConflicting === 1 ? ' was' : 's were'} found. https://nextjs.org/docs/messages/conflicting-public-file-page\n${conflictingPublicFiles.join('\n')}`);
            }
        });
        const nestedReservedPages = pageKeys.filter((page)=>{
            return page.match(/\/(_app|_document|_error)$/) && _path.default.dirname(page) !== '/';
        });
        if (nestedReservedPages.length) {
            Log.warn(`The following reserved Next.js pages were detected not directly under the pages directory:\n` + nestedReservedPages.join('\n') + `\nSee more info here: https://nextjs.org/docs/messages/nested-reserved-page\n`);
        }
        const restrictedRedirectPaths = [
            '/_next'
        ].map((p)=>config.basePath ? `${config.basePath}${p}` : p
        );
        const buildCustomRoute = (r, type)=>{
            const keys = [];
            const routeRegex = (0, _pathToRegexp).pathToRegexp(r.source, keys, {
                strict: true,
                sensitive: false,
                delimiter: '/'
            });
            let regexSource = routeRegex.source;
            if (!r.internal) {
                regexSource = (0, _loadCustomRoutes).modifyRouteRegex(routeRegex.source, type === 'redirect' ? restrictedRedirectPaths : undefined);
            }
            return {
                ...r,
                ...type === 'redirect' ? {
                    statusCode: (0, _loadCustomRoutes).getRedirectStatus(r),
                    permanent: undefined
                } : {
                },
                regex: (0, _loadCustomRoutes).normalizeRouteRegex(regexSource)
            };
        };
        const routesManifestPath = _path.default.join(distDir, _constants1.ROUTES_MANIFEST);
        const routesManifest = nextBuildSpan.traceChild('generate-routes-manifest').traceFn(()=>({
                version: 3,
                pages404: true,
                basePath: config.basePath,
                redirects: redirects.map((r)=>buildCustomRoute(r, 'redirect')
                ),
                headers: headers.map((r)=>buildCustomRoute(r, 'header')
                ),
                dynamicRoutes: (0, _utils).getSortedRoutes(pageKeys).filter((page)=>(0, _utils).isDynamicRoute(page) && !page.match(_constants.MIDDLEWARE_ROUTE)
                ).map(pageToRoute),
                staticRoutes: (0, _utils).getSortedRoutes(pageKeys).filter((page)=>!(0, _utils).isDynamicRoute(page) && !page.match(_constants.MIDDLEWARE_ROUTE) && !(0, _utils2).isReservedPage(page)
                ).map(pageToRoute),
                dataRoutes: [],
                i18n: config.i18n || undefined
            })
        );
        if (rewrites.beforeFiles.length === 0 && rewrites.fallback.length === 0) {
            routesManifest.rewrites = rewrites.afterFiles.map((r)=>buildCustomRoute(r, 'rewrite')
            );
        } else {
            routesManifest.rewrites = {
                beforeFiles: rewrites.beforeFiles.map((r)=>buildCustomRoute(r, 'rewrite')
                ),
                afterFiles: rewrites.afterFiles.map((r)=>buildCustomRoute(r, 'rewrite')
                ),
                fallback: rewrites.fallback.map((r)=>buildCustomRoute(r, 'rewrite')
                )
            };
        }
        const combinedRewrites = [
            ...rewrites.beforeFiles,
            ...rewrites.afterFiles,
            ...rewrites.fallback, 
        ];
        const distDirCreated = await nextBuildSpan.traceChild('create-dist-dir').traceAsyncFn(async ()=>{
            try {
                await _fs.promises.mkdir(distDir, {
                    recursive: true
                });
                return true;
            } catch (err) {
                if ((0, _isError).default(err) && err.code === 'EPERM') {
                    return false;
                }
                throw err;
            }
        });
        if (!distDirCreated || !await (0, _isWriteable).isWriteable(distDir)) {
            throw new Error('> Build directory is not writeable. https://nextjs.org/docs/messages/build-dir-not-writeable');
        }
        if (config.cleanDistDir) {
            await (0, _recursiveDelete).recursiveDelete(distDir, /^cache/);
        }
        // Ensure commonjs handling is used for files in the distDir (generally .next)
        // Files outside of the distDir can be "type": "module"
        await _fs.promises.writeFile(_path.default.join(distDir, 'package.json'), '{"type": "commonjs"}');
        // We need to write the manifest with rewrites before build
        // so serverless can import the manifest
        await nextBuildSpan.traceChild('write-routes-manifest').traceAsyncFn(()=>_fs.promises.writeFile(routesManifestPath, JSON.stringify(routesManifest), 'utf8')
        );
        const manifestPath = _path.default.join(distDir, isLikeServerless ? _constants1.SERVERLESS_DIRECTORY : _constants1.SERVER_DIRECTORY, _constants1.PAGES_MANIFEST);
        const requiredServerFiles = nextBuildSpan.traceChild('generate-required-server-files').traceFn(()=>({
                version: 1,
                config: {
                    ...config,
                    configFile: undefined,
                    experimental: {
                        ...config.experimental,
                        trustHostHeader: ciEnvironment.hasNextSupport
                    }
                },
                appDir: dir,
                files: [
                    _constants1.ROUTES_MANIFEST,
                    _path.default.relative(distDir, manifestPath),
                    _constants1.BUILD_MANIFEST,
                    _constants1.PRERENDER_MANIFEST,
                    _path.default.join(_constants1.SERVER_DIRECTORY, _constants1.MIDDLEWARE_MANIFEST),
                    hasServerComponents ? _path.default.join(_constants1.SERVER_DIRECTORY, _constants1.MIDDLEWARE_FLIGHT_MANIFEST + (runtime === 'edge' ? '.js' : '.json')) : null,
                    _constants1.REACT_LOADABLE_MANIFEST,
                    config.optimizeFonts ? _path.default.join(isLikeServerless ? _constants1.SERVERLESS_DIRECTORY : _constants1.SERVER_DIRECTORY, _constants1.FONT_MANIFEST) : null,
                    _constants1.BUILD_ID_FILE, 
                ].filter(_nonNullable.nonNullable).map((file)=>_path.default.join(config.distDir, file)
                ),
                ignore: []
            })
        );
        let result = {
            warnings: [],
            errors: []
        };
        let webpackBuildStart;
        let telemetryPlugin;
        await (async ()=>{
            var ref;
            // IIFE to isolate locals and avoid retaining memory too long
            const runWebpackSpan = nextBuildSpan.traceChild('run-webpack-compiler');
            const configs = await runWebpackSpan.traceChild('generate-webpack-config').traceAsyncFn(()=>Promise.all([
                    (0, _webpackConfig).default(dir, {
                        buildId,
                        reactProductionProfiling,
                        isServer: false,
                        config,
                        target,
                        pagesDir,
                        entrypoints: entrypoints.client,
                        rewrites,
                        runWebpackSpan
                    }),
                    (0, _webpackConfig).default(dir, {
                        buildId,
                        reactProductionProfiling,
                        isServer: true,
                        config,
                        target,
                        pagesDir,
                        entrypoints: entrypoints.server,
                        rewrites,
                        runWebpackSpan
                    }),
                    runtime === 'edge' ? (0, _webpackConfig).default(dir, {
                        buildId,
                        reactProductionProfiling,
                        isServer: true,
                        isEdgeRuntime: true,
                        config,
                        target,
                        pagesDir,
                        entrypoints: entrypoints.edgeServer,
                        rewrites,
                        runWebpackSpan
                    }) : null, 
                ])
            );
            const clientConfig = configs[0];
            if (clientConfig.optimization && (clientConfig.optimization.minimize !== true || clientConfig.optimization.minimizer && clientConfig.optimization.minimizer.length === 0)) {
                Log.warn(`Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled`);
            }
            webpackBuildStart = process.hrtime();
            // We run client and server compilation separately to optimize for memory usage
            await runWebpackSpan.traceAsyncFn(async ()=>{
                const clientResult = await (0, _compiler).runCompiler(clientConfig, {
                    runWebpackSpan
                });
                // Fail build if clientResult contains errors
                if (clientResult.errors.length > 0) {
                    result = {
                        warnings: [
                            ...clientResult.warnings
                        ],
                        errors: [
                            ...clientResult.errors
                        ]
                    };
                } else {
                    const serverResult = await (0, _compiler).runCompiler(configs[1], {
                        runWebpackSpan
                    });
                    const edgeServerResult = configs[2] ? await (0, _compiler).runCompiler(configs[2], {
                        runWebpackSpan
                    }) : null;
                    result = {
                        warnings: [
                            ...clientResult.warnings,
                            ...serverResult.warnings,
                            ...(edgeServerResult === null || edgeServerResult === void 0 ? void 0 : edgeServerResult.warnings) || [], 
                        ],
                        errors: [
                            ...clientResult.errors,
                            ...serverResult.errors,
                            ...(edgeServerResult === null || edgeServerResult === void 0 ? void 0 : edgeServerResult.errors) || [], 
                        ]
                    };
                }
            });
            result = nextBuildSpan.traceChild('format-webpack-messages').traceFn(()=>(0, _formatWebpackMessages).default(result, true)
            );
            telemetryPlugin = (ref = clientConfig.plugins) === null || ref === void 0 ? void 0 : ref.find(isTelemetryPlugin);
        })();
        const webpackBuildEnd = process.hrtime(webpackBuildStart);
        if (buildSpinner) {
            buildSpinner.stopAndPersist();
        }
        if (result.errors.length > 0) {
            // Only keep the first few errors. Others are often indicative
            // of the same problem, but confuse the reader with noise.
            if (result.errors.length > 5) {
                result.errors.length = 5;
            }
            const error = result.errors.join('\n\n');
            console.error(_chalk.default.red('Failed to compile.\n'));
            if (error.indexOf('private-next-pages') > -1 && error.indexOf('does not contain a default export') > -1) {
                const page_name_regex = /'private-next-pages\/(?<page_name>[^']*)'/;
                const parsed = page_name_regex.exec(error);
                const page_name = parsed && parsed.groups && parsed.groups.page_name;
                throw new Error(`webpack build failed: found page without a React Component as default export in pages/${page_name}\n\nSee https://nextjs.org/docs/messages/page-without-valid-component for more info.`);
            }
            console.error(error);
            console.error();
            // When using the web runtime, common Node.js native APIs are not available.
            const moduleName = (0, _utils2).getUnresolvedModuleFromError(error);
            if (hasConcurrentFeatures && moduleName) {
                const err = new Error(`Native Node.js APIs are not supported in the Edge Runtime. Found \`${moduleName}\` imported.\n\n`);
                err.code = 'EDGE_RUNTIME_UNSUPPORTED_API';
                throw err;
            }
            if (error.indexOf('private-next-pages') > -1 || error.indexOf('__next_polyfill__') > -1) {
                const err = new Error('webpack config.resolve.alias was incorrectly overridden. https://nextjs.org/docs/messages/invalid-resolve-alias');
                err.code = 'INVALID_RESOLVE_ALIAS';
                throw err;
            }
            const err = new Error('Build failed because of webpack errors');
            err.code = 'WEBPACK_ERRORS';
            throw err;
        } else {
            telemetry.record((0, _events).eventBuildCompleted(pagePaths, {
                durationInSeconds: webpackBuildEnd[0]
            }));
            if (result.warnings.length > 0) {
                Log.warn('Compiled with warnings\n');
                console.warn(result.warnings.join('\n\n'));
                console.warn();
            } else {
                Log.info('Compiled successfully');
            }
        }
        const postCompileSpinner = (0, _spinner).default({
            prefixText: `${Log.prefixes.info} Collecting page data`
        });
        const buildManifestPath = _path.default.join(distDir, _constants1.BUILD_MANIFEST);
        const ssgPages = new Set();
        const ssgStaticFallbackPages = new Set();
        const ssgBlockingFallbackPages = new Set();
        const staticPages = new Set();
        const invalidPages = new Set();
        const hybridAmpPages = new Set();
        const serverPropsPages = new Set();
        const additionalSsgPaths = new Map();
        const additionalSsgPathsEncoded = new Map();
        const pageTraceIncludes = new Map();
        const pageTraceExcludes = new Map();
        const pageInfos = new Map();
        const pagesManifest = JSON.parse(await _fs.promises.readFile(manifestPath, 'utf8'));
        const buildManifest = JSON.parse(await _fs.promises.readFile(buildManifestPath, 'utf8'));
        const timeout = config.staticPageGenerationTimeout || 0;
        const sharedPool = config.experimental.sharedPool || false;
        const staticWorker = sharedPool ? require.resolve('./worker') : require.resolve('./utils');
        let infoPrinted = false;
        process.env.NEXT_PHASE = _constants1.PHASE_PRODUCTION_BUILD;
        const staticWorkers = new _worker.Worker(staticWorker, {
            timeout: timeout * 1000,
            onRestart: (method, [arg], attempts)=>{
                if (method === 'exportPage') {
                    const { path: pagePath  } = arg;
                    if (attempts >= 3) {
                        throw new Error(`Static page generation for ${pagePath} is still timing out after 3 attempts. See more info here https://nextjs.org/docs/messages/static-page-generation-timeout`);
                    }
                    Log.warn(`Restarted static page generation for ${pagePath} because it took more than ${timeout} seconds`);
                } else {
                    const pagePath = arg;
                    if (attempts >= 2) {
                        throw new Error(`Collecting page data for ${pagePath} is still timing out after 2 attempts. See more info here https://nextjs.org/docs/messages/page-data-collection-timeout`);
                    }
                    Log.warn(`Restarted collecting page data for ${pagePath} because it took more than ${timeout} seconds`);
                }
                if (!infoPrinted) {
                    Log.warn('See more info here https://nextjs.org/docs/messages/static-page-generation-timeout');
                    infoPrinted = true;
                }
            },
            numWorkers: config.experimental.cpus,
            enableWorkerThreads: config.experimental.workerThreads,
            exposedMethods: sharedPool ? [
                'hasCustomGetInitialProps',
                'isPageStatic',
                'getNamedExports',
                'exportPage', 
            ] : [
                'hasCustomGetInitialProps',
                'isPageStatic',
                'getNamedExports'
            ]
        });
        const analysisBegin = process.hrtime();
        const staticCheckSpan = nextBuildSpan.traceChild('static-check');
        const { customAppGetInitialProps , namedExports , isNextImageImported , hasSsrAmpPages , hasNonStaticErrorPage ,  } = await staticCheckSpan.traceAsyncFn(async ()=>{
            const { configFileName , publicRuntimeConfig , serverRuntimeConfig  } = config;
            const runtimeEnvConfig = {
                publicRuntimeConfig,
                serverRuntimeConfig
            };
            const nonStaticErrorPageSpan = staticCheckSpan.traceChild('check-static-error-page');
            const errorPageHasCustomGetInitialProps = nonStaticErrorPageSpan.traceAsyncFn(async ()=>hasCustomErrorPage && await staticWorkers.hasCustomGetInitialProps('/_error', distDir, isLikeServerless, runtimeEnvConfig, false)
            );
            const errorPageStaticResult = nonStaticErrorPageSpan.traceAsyncFn(async ()=>{
                var ref, ref11;
                return hasCustomErrorPage && staticWorkers.isPageStatic('/_error', distDir, isLikeServerless, configFileName, runtimeEnvConfig, config.httpAgentOptions, (ref = config.i18n) === null || ref === void 0 ? void 0 : ref.locales, (ref11 = config.i18n) === null || ref11 === void 0 ? void 0 : ref11.defaultLocale);
            });
            // we don't output _app in serverless mode so use _app export
            // from _error instead
            const appPageToCheck = isLikeServerless ? '/_error' : '/_app';
            const customAppGetInitialPropsPromise = staticWorkers.hasCustomGetInitialProps(appPageToCheck, distDir, isLikeServerless, runtimeEnvConfig, true);
            const namedExportsPromise = staticWorkers.getNamedExports(appPageToCheck, distDir, isLikeServerless, runtimeEnvConfig);
            // eslint-disable-next-line no-shadow
            let isNextImageImported;
            // eslint-disable-next-line no-shadow
            let hasSsrAmpPages = false;
            const computedManifestData = await (0, _utils2).computeFromManifest(buildManifest, distDir, config.experimental.gzipSize);
            await Promise.all(pageKeys.map(async (page)=>{
                const checkPageSpan = staticCheckSpan.traceChild('check-page', {
                    page
                });
                return checkPageSpan.traceAsyncFn(async ()=>{
                    const actualPage = (0, _normalizePagePath).normalizePagePath(page);
                    const [selfSize, allSize] = await (0, _utils2).getJsPageSizeInKb(actualPage, distDir, buildManifest, config.experimental.gzipSize, computedManifestData);
                    let isSsg = false;
                    let isStatic = false;
                    let isHybridAmp = false;
                    let ssgPageRoutes = null;
                    let isMiddlewareRoute = !!page.match(_constants.MIDDLEWARE_ROUTE);
                    if (!isMiddlewareRoute && !(0, _utils2).isReservedPage(page) && !hasConcurrentFeatures) {
                        try {
                            let isPageStaticSpan = checkPageSpan.traceChild('is-page-static');
                            let workerResult = await isPageStaticSpan.traceAsyncFn(()=>{
                                var ref, ref16;
                                return staticWorkers.isPageStatic(page, distDir, isLikeServerless, configFileName, runtimeEnvConfig, config.httpAgentOptions, (ref = config.i18n) === null || ref === void 0 ? void 0 : ref.locales, (ref16 = config.i18n) === null || ref16 === void 0 ? void 0 : ref16.defaultLocale, isPageStaticSpan.id);
                            });
                            if (config.outputFileTracing) {
                                pageTraceIncludes.set(page, workerResult.traceIncludes || []);
                                pageTraceExcludes.set(page, workerResult.traceExcludes || []);
                            }
                            if (workerResult.isStatic === false && (workerResult.isHybridAmp || workerResult.isAmpOnly)) {
                                hasSsrAmpPages = true;
                            }
                            if (workerResult.isHybridAmp) {
                                isHybridAmp = true;
                                hybridAmpPages.add(page);
                            }
                            if (workerResult.isNextImageImported) {
                                isNextImageImported = true;
                            }
                            if (workerResult.hasStaticProps) {
                                ssgPages.add(page);
                                isSsg = true;
                                if (workerResult.prerenderRoutes && workerResult.encodedPrerenderRoutes) {
                                    additionalSsgPaths.set(page, workerResult.prerenderRoutes);
                                    additionalSsgPathsEncoded.set(page, workerResult.encodedPrerenderRoutes);
                                    ssgPageRoutes = workerResult.prerenderRoutes;
                                }
                                if (workerResult.prerenderFallback === 'blocking') {
                                    ssgBlockingFallbackPages.add(page);
                                } else if (workerResult.prerenderFallback === true) {
                                    ssgStaticFallbackPages.add(page);
                                }
                            } else if (workerResult.hasServerProps) {
                                serverPropsPages.add(page);
                            } else if (workerResult.isStatic && !workerResult.hasFlightData && await customAppGetInitialPropsPromise === false) {
                                staticPages.add(page);
                                isStatic = true;
                            }
                            if (hasPages404 && page === '/404') {
                                if (!workerResult.isStatic && !workerResult.hasStaticProps) {
                                    throw new Error(`\`pages/404\` ${_constants.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
                                }
                                // we need to ensure the 404 lambda is present since we use
                                // it when _app has getInitialProps
                                if (await customAppGetInitialPropsPromise && !workerResult.hasStaticProps) {
                                    staticPages.delete(page);
                                }
                            }
                            if (_constants1.STATIC_STATUS_PAGES.includes(page) && !workerResult.isStatic && !workerResult.hasStaticProps) {
                                throw new Error(`\`pages${page}\` ${_constants.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
                            }
                        } catch (err) {
                            if (!(0, _isError).default(err) || err.message !== 'INVALID_DEFAULT_EXPORT') throw err;
                            invalidPages.add(page);
                        }
                    }
                    pageInfos.set(page, {
                        size: selfSize,
                        totalSize: allSize,
                        static: isStatic,
                        isSsg,
                        isWebSsr: hasConcurrentFeatures && !isMiddlewareRoute && !(0, _utils2).isReservedPage(page) && !(0, _utils2).isCustomErrorPage(page),
                        isHybridAmp,
                        ssgPageRoutes,
                        initialRevalidateSeconds: false,
                        pageDuration: undefined,
                        ssgPageDurations: undefined
                    });
                });
            }));
            const errorPageResult = await errorPageStaticResult;
            const nonStaticErrorPage = await errorPageHasCustomGetInitialProps || errorPageResult && errorPageResult.hasServerProps;
            const returnValue = {
                customAppGetInitialProps: await customAppGetInitialPropsPromise,
                namedExports: await namedExportsPromise,
                isNextImageImported,
                hasSsrAmpPages,
                hasNonStaticErrorPage: nonStaticErrorPage
            };
            if (!sharedPool) staticWorkers.end();
            return returnValue;
        });
        if (customAppGetInitialProps) {
            console.warn(_chalk.default.bold.yellow(`Warning: `) + _chalk.default.yellow(`You have opted-out of Automatic Static Optimization due to \`getInitialProps\` in \`pages/_app\`. This does not opt-out pages with \`getStaticProps\``));
            console.warn('Read more: https://nextjs.org/docs/messages/opt-out-auto-static-optimization\n');
        }
        if (!hasSsrAmpPages) {
            requiredServerFiles.ignore.push(_path.default.relative(dir, _path.default.join(_path.default.dirname(require.resolve('next/dist/compiled/@ampproject/toolbox-optimizer')), '**/*')));
        }
        if (config.outputFileTracing) {
            const { nodeFileTrace  } = require('next/dist/compiled/@vercel/nft');
            const includeExcludeSpan = nextBuildSpan.traceChild('apply-include-excludes');
            await includeExcludeSpan.traceAsyncFn(async ()=>{
                const globOrig = require('next/dist/compiled/glob');
                const glob = (pattern)=>{
                    return new Promise((resolve, reject)=>{
                        globOrig(pattern, {
                            cwd: dir
                        }, (err, files)=>{
                            if (err) {
                                return reject(err);
                            }
                            resolve(files);
                        });
                    });
                };
                for (let page of pageKeys){
                    await includeExcludeSpan.traceChild('include-exclude', {
                        page
                    }).traceAsyncFn(async ()=>{
                        const includeGlobs = pageTraceIncludes.get(page);
                        const excludeGlobs = pageTraceExcludes.get(page);
                        page = (0, _normalizePagePath).normalizePagePath(page);
                        if (!(includeGlobs === null || includeGlobs === void 0 ? void 0 : includeGlobs.length) && !(excludeGlobs === null || excludeGlobs === void 0 ? void 0 : excludeGlobs.length)) {
                            return;
                        }
                        const traceFile = _path.default.join(distDir, 'server/pages', `${page}.js.nft.json`);
                        const pageDir = _path.default.dirname(traceFile);
                        const traceContent = JSON.parse(await _fs.promises.readFile(traceFile, 'utf8'));
                        let includes = [];
                        if (includeGlobs === null || includeGlobs === void 0 ? void 0 : includeGlobs.length) {
                            for (const includeGlob of includeGlobs){
                                const results = await glob(includeGlob);
                                includes.push(...results.map((file)=>{
                                    return _path.default.relative(pageDir, _path.default.join(dir, file));
                                }));
                            }
                        }
                        const combined = new Set([
                            ...traceContent.files,
                            ...includes
                        ]);
                        if (excludeGlobs === null || excludeGlobs === void 0 ? void 0 : excludeGlobs.length) {
                            const resolvedGlobs = excludeGlobs.map((exclude)=>_path.default.join(dir, exclude)
                            );
                            combined.forEach((file)=>{
                                if ((0, _micromatch).isMatch(_path.default.join(pageDir, file), resolvedGlobs)) {
                                    combined.delete(file);
                                }
                            });
                        }
                        await _fs.promises.writeFile(traceFile, JSON.stringify({
                            version: traceContent.version,
                            files: [
                                ...combined
                            ]
                        }));
                    });
                }
            });
            // TODO: move this inside of webpack so it can be cached
            // between builds. Should only need to be re-run on lockfile change
            await nextBuildSpan.traceChild('trace-next-server').traceAsyncFn(async ()=>{
                let cacheKey;
                // consider all lockFiles in tree in case user accidentally
                // has both package-lock.json and yarn.lock
                const lockFiles = (await Promise.all([
                    'package-lock.json',
                    'yarn.lock',
                    'pnpm-lock.yaml'
                ].map((file)=>(0, _findUp).default(file, {
                        cwd: dir
                    })
                ))).filter(Boolean)// TypeScript doesn't like this filter
                ;
                const nextServerTraceOutput = _path.default.join(distDir, 'next-server.js.nft.json');
                const cachedTracePath = _path.default.join(distDir, 'cache/next-server.js.nft.json');
                if (lockFiles.length > 0) {
                    const cacheHash = require('crypto').createHash('sha256');
                    cacheHash.update(require('next/package').version);
                    cacheHash.update(hasSsrAmpPages + '');
                    cacheHash.update(ciEnvironment.hasNextSupport + '');
                    await Promise.all(lockFiles.map(async (lockFile)=>{
                        cacheHash.update(await _fs.promises.readFile(lockFile));
                    }));
                    cacheKey = cacheHash.digest('hex');
                    try {
                        const existingTrace = JSON.parse(await _fs.promises.readFile(cachedTracePath, 'utf8'));
                        if (existingTrace.cacheKey === cacheKey) {
                            await _fs.promises.copyFile(cachedTracePath, nextServerTraceOutput);
                            return;
                        }
                    } catch (_) {
                    }
                }
                const root = _path.default.parse(dir).root;
                const serverResult = await nodeFileTrace([
                    require.resolve('next/dist/server/next-server')
                ], {
                    base: root,
                    processCwd: dir,
                    ignore: [
                        '**/next/dist/pages/**/*',
                        '**/next/dist/compiled/webpack/(bundle4|bundle5).js',
                        '**/node_modules/webpack5/**/*',
                        '**/next/dist/server/lib/squoosh/**/*.wasm',
                        ...ciEnvironment.hasNextSupport ? [
                            // only ignore image-optimizer code when
                            // this is being handled outside of next-server
                            '**/next/dist/server/image-optimizer.js',
                            '**/node_modules/sharp/**/*', 
                        ] : [],
                        ...!hasSsrAmpPages ? [
                            '**/next/dist/compiled/@ampproject/toolbox-optimizer/**/*'
                        ] : [], 
                    ]
                });
                const tracedFiles = new Set();
                serverResult.fileList.forEach((file)=>{
                    tracedFiles.add(_path.default.relative(distDir, _path.default.join(root, file)).replace(/\\/g, '/'));
                });
                await _fs.promises.writeFile(nextServerTraceOutput, JSON.stringify({
                    version: 1,
                    cacheKey,
                    files: [
                        ...tracedFiles
                    ]
                }));
                await _fs.promises.unlink(cachedTracePath).catch(()=>{
                });
                await _fs.promises.copyFile(nextServerTraceOutput, cachedTracePath).catch(()=>{
                });
            });
        }
        if (serverPropsPages.size > 0 || ssgPages.size > 0) {
            // We update the routes manifest after the build with the
            // data routes since we can't determine these until after build
            routesManifest.dataRoutes = (0, _utils).getSortedRoutes([
                ...serverPropsPages,
                ...ssgPages, 
            ]).map((page)=>{
                const pagePath = (0, _normalizePagePath).normalizePagePath(page);
                const dataRoute = _path.default.posix.join('/_next/data', buildId, `${pagePath}.json`);
                let dataRouteRegex;
                let namedDataRouteRegex;
                let routeKeys;
                if ((0, _utils).isDynamicRoute(page)) {
                    const routeRegex = (0, _utils).getRouteRegex(dataRoute.replace(/\.json$/, ''));
                    dataRouteRegex = (0, _loadCustomRoutes).normalizeRouteRegex(routeRegex.re.source.replace(/\(\?:\\\/\)\?\$$/, `\\.json$`));
                    namedDataRouteRegex = routeRegex.namedRegex.replace(/\(\?:\/\)\?\$$/, `\\.json$`);
                    routeKeys = routeRegex.routeKeys;
                } else {
                    dataRouteRegex = (0, _loadCustomRoutes).normalizeRouteRegex(new RegExp(`^${_path.default.posix.join('/_next/data', (0, _escapeRegexp).escapeStringRegexp(buildId), `${pagePath}.json`)}$`).source);
                }
                return {
                    page,
                    routeKeys,
                    dataRouteRegex,
                    namedDataRouteRegex
                };
            });
            await _fs.promises.writeFile(routesManifestPath, JSON.stringify(routesManifest), 'utf8');
        }
        // Since custom _app.js can wrap the 404 page we have to opt-out of static optimization if it has getInitialProps
        // Only export the static 404 when there is no /_error present
        const useStatic404 = !hasConcurrentFeatures && !customAppGetInitialProps && (!hasNonStaticErrorPage || hasPages404);
        if (invalidPages.size > 0) {
            const err = new Error(`Build optimization failed: found page${invalidPages.size === 1 ? '' : 's'} without a React Component as default export in \n${[
                ...invalidPages
            ].map((pg)=>`pages${pg}`
            ).join('\n')}\n\nSee https://nextjs.org/docs/messages/page-without-valid-component for more info.\n`);
            err.code = 'BUILD_OPTIMIZATION_FAILED';
            throw err;
        }
        await (0, _writeBuildId).writeBuildId(distDir, buildId);
        if (config.experimental.optimizeCss) {
            const globOrig = require('next/dist/compiled/glob');
            const cssFilePaths = await new Promise((resolve, reject)=>{
                globOrig('**/*.css', {
                    cwd: (0, _path).join(distDir, 'static')
                }, (err, files)=>{
                    if (err) {
                        return reject(err);
                    }
                    resolve(files);
                });
            });
            requiredServerFiles.files.push(...cssFilePaths.map((filePath)=>_path.default.join(config.distDir, 'static', filePath)
            ));
        }
        const features = [
            {
                featureName: 'experimental/optimizeCss',
                invocationCount: config.experimental.optimizeCss ? 1 : 0
            },
            {
                featureName: 'optimizeFonts',
                invocationCount: config.optimizeFonts ? 1 : 0
            }, 
        ];
        telemetry.record(features.map((feature)=>{
            return {
                eventName: _events.EVENT_BUILD_FEATURE_USAGE,
                payload: feature
            };
        }));
        await _fs.promises.writeFile(_path.default.join(distDir, _constants1.SERVER_FILES_MANIFEST), JSON.stringify(requiredServerFiles), 'utf8');
        const middlewareManifest = JSON.parse(await _fs.promises.readFile(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, _constants1.MIDDLEWARE_MANIFEST), 'utf8'));
        const outputFileTracingRoot = config.experimental.outputFileTracingRoot || dir;
        if (config.experimental.outputStandalone) {
            await nextBuildSpan.traceChild('copy-traced-files').traceAsyncFn(async ()=>{
                await (0, _utils2).copyTracedFiles(dir, distDir, pageKeys, outputFileTracingRoot, requiredServerFiles.config, middlewareManifest);
            });
        }
        const finalPrerenderRoutes = {
        };
        const tbdPrerenderRoutes = [];
        let ssgNotFoundPaths = [];
        if (postCompileSpinner) postCompileSpinner.stopAndPersist();
        const { i18n  } = config;
        const usedStaticStatusPages = _constants1.STATIC_STATUS_PAGES.filter((page)=>mappedPages[page] && mappedPages[page].startsWith('private-next-pages')
        );
        usedStaticStatusPages.forEach((page)=>{
            if (!ssgPages.has(page) && !customAppGetInitialProps) {
                staticPages.add(page);
            }
        });
        const hasPages500 = usedStaticStatusPages.includes('/500');
        const useDefaultStatic500 = !hasPages500 && !hasNonStaticErrorPage && !customAppGetInitialProps;
        const combinedPages = [
            ...staticPages,
            ...ssgPages
        ];
        if (!hasConcurrentFeatures && (combinedPages.length > 0 || useStatic404 || useDefaultStatic500)) {
            const staticGenerationSpan = nextBuildSpan.traceChild('static-generation');
            await staticGenerationSpan.traceAsyncFn(async ()=>{
                (0, _utils2).detectConflictingPaths([
                    ...combinedPages,
                    ...pageKeys.filter((page)=>!combinedPages.includes(page)
                    ), 
                ], ssgPages, additionalSsgPaths);
                const exportApp = require('../export').default;
                const exportOptions = {
                    silent: false,
                    buildExport: true,
                    threads: config.experimental.cpus,
                    pages: combinedPages,
                    outdir: _path.default.join(distDir, 'export'),
                    statusMessage: 'Generating static pages',
                    exportPageWorker: sharedPool ? staticWorkers.exportPage.bind(staticWorkers) : undefined,
                    endWorker: sharedPool ? async ()=>{
                        await staticWorkers.end();
                    } : undefined
                };
                const exportConfig = {
                    ...config,
                    initialPageRevalidationMap: {
                    },
                    pageDurationMap: {
                    },
                    ssgNotFoundPaths: [],
                    // Default map will be the collection of automatic statically exported
                    // pages and incremental pages.
                    // n.b. we cannot handle this above in combinedPages because the dynamic
                    // page must be in the `pages` array, but not in the mapping.
                    exportPathMap: (defaultMap)=>{
                        // Dynamically routed pages should be prerendered to be used as
                        // a client-side skeleton (fallback) while data is being fetched.
                        // This ensures the end-user never sees a 500 or slow response from the
                        // server.
                        //
                        // Note: prerendering disables automatic static optimization.
                        ssgPages.forEach((page)=>{
                            if ((0, _utils).isDynamicRoute(page)) {
                                tbdPrerenderRoutes.push(page);
                                if (ssgStaticFallbackPages.has(page)) {
                                    // Override the rendering for the dynamic page to be treated as a
                                    // fallback render.
                                    if (i18n) {
                                        defaultMap[`/${i18n.defaultLocale}${page}`] = {
                                            page,
                                            query: {
                                                __nextFallback: true
                                            }
                                        };
                                    } else {
                                        defaultMap[page] = {
                                            page,
                                            query: {
                                                __nextFallback: true
                                            }
                                        };
                                    }
                                } else {
                                    // Remove dynamically routed pages from the default path map when
                                    // fallback behavior is disabled.
                                    delete defaultMap[page];
                                }
                            }
                        });
                        // Append the "well-known" routes we should prerender for, e.g. blog
                        // post slugs.
                        additionalSsgPaths.forEach((routes, page)=>{
                            const encodedRoutes = additionalSsgPathsEncoded.get(page);
                            routes.forEach((route, routeIdx)=>{
                                defaultMap[route] = {
                                    page,
                                    query: {
                                        __nextSsgPath: encodedRoutes === null || encodedRoutes === void 0 ? void 0 : encodedRoutes[routeIdx]
                                    }
                                };
                            });
                        });
                        if (useStatic404) {
                            defaultMap['/404'] = {
                                page: hasPages404 ? '/404' : '/_error'
                            };
                        }
                        if (useDefaultStatic500) {
                            defaultMap['/500'] = {
                                page: '/_error'
                            };
                        }
                        if (i18n) {
                            for (const page of [
                                ...staticPages,
                                ...ssgPages,
                                ...useStatic404 ? [
                                    '/404'
                                ] : [],
                                ...useDefaultStatic500 ? [
                                    '/500'
                                ] : [], 
                            ]){
                                const isSsg = ssgPages.has(page);
                                const isDynamic = (0, _utils).isDynamicRoute(page);
                                const isFallback = isSsg && ssgStaticFallbackPages.has(page);
                                for (const locale of i18n.locales){
                                    var ref;
                                    // skip fallback generation for SSG pages without fallback mode
                                    if (isSsg && isDynamic && !isFallback) continue;
                                    const outputPath = `/${locale}${page === '/' ? '' : page}`;
                                    defaultMap[outputPath] = {
                                        page: ((ref = defaultMap[page]) === null || ref === void 0 ? void 0 : ref.page) || page,
                                        query: {
                                            __nextLocale: locale
                                        }
                                    };
                                    if (isFallback) {
                                        defaultMap[outputPath].query.__nextFallback = true;
                                    }
                                }
                                if (isSsg) {
                                    // remove non-locale prefixed variant from defaultMap
                                    delete defaultMap[page];
                                }
                            }
                        }
                        return defaultMap;
                    }
                };
                await exportApp(dir, exportOptions, nextBuildSpan, exportConfig);
                const postBuildSpinner = (0, _spinner).default({
                    prefixText: `${Log.prefixes.info} Finalizing page optimization`
                });
                ssgNotFoundPaths = exportConfig.ssgNotFoundPaths;
                // remove server bundles that were exported
                for (const page of staticPages){
                    const serverBundle = (0, _require).getPagePath(page, distDir, isLikeServerless);
                    await _fs.promises.unlink(serverBundle);
                }
                const serverOutputDir = _path.default.join(distDir, isLikeServerless ? _constants1.SERVERLESS_DIRECTORY : _constants1.SERVER_DIRECTORY);
                const moveExportedPage = async (originPage, page, file, isSsg, ext, additionalSsgFile = false)=>{
                    return staticGenerationSpan.traceChild('move-exported-page').traceAsyncFn(async ()=>{
                        file = `${file}.${ext}`;
                        const orig = _path.default.join(exportOptions.outdir, file);
                        const pagePath = (0, _require).getPagePath(originPage, distDir, isLikeServerless);
                        const relativeDest = _path.default.relative(serverOutputDir, _path.default.join(_path.default.join(pagePath, // strip leading / and then recurse number of nested dirs
                        // to place from base folder
                        originPage.substr(1).split('/').map(()=>'..'
                        ).join('/')), file)).replace(/\\/g, '/');
                        const dest = _path.default.join(distDir, isLikeServerless ? _constants1.SERVERLESS_DIRECTORY : _constants1.SERVER_DIRECTORY, relativeDest);
                        if (!isSsg && !// don't add static status page to manifest if it's
                        // the default generated version e.g. no pages/500
                        (_constants1.STATIC_STATUS_PAGES.includes(page) && !usedStaticStatusPages.includes(page))) {
                            pagesManifest[page] = relativeDest;
                        }
                        const isNotFound = ssgNotFoundPaths.includes(page);
                        // for SSG files with i18n the non-prerendered variants are
                        // output with the locale prefixed so don't attempt moving
                        // without the prefix
                        if ((!i18n || additionalSsgFile) && !isNotFound) {
                            await _fs.promises.mkdir(_path.default.dirname(dest), {
                                recursive: true
                            });
                            await _fs.promises.rename(orig, dest);
                        } else if (i18n && !isSsg) {
                            // this will be updated with the locale prefixed variant
                            // since all files are output with the locale prefix
                            delete pagesManifest[page];
                        }
                        if (i18n) {
                            if (additionalSsgFile) return;
                            for (const locale of i18n.locales){
                                const curPath = `/${locale}${page === '/' ? '' : page}`;
                                const localeExt = page === '/' ? _path.default.extname(file) : '';
                                const relativeDestNoPages = relativeDest.substr('pages/'.length);
                                if (isSsg && ssgNotFoundPaths.includes(curPath)) {
                                    continue;
                                }
                                const updatedRelativeDest = _path.default.join('pages', locale + localeExt, // if it's the top-most index page we want it to be locale.EXT
                                // instead of locale/index.html
                                page === '/' ? '' : relativeDestNoPages).replace(/\\/g, '/');
                                const updatedOrig = _path.default.join(exportOptions.outdir, locale + localeExt, page === '/' ? '' : file);
                                const updatedDest = _path.default.join(distDir, isLikeServerless ? _constants1.SERVERLESS_DIRECTORY : _constants1.SERVER_DIRECTORY, updatedRelativeDest);
                                if (!isSsg) {
                                    pagesManifest[curPath] = updatedRelativeDest;
                                }
                                await _fs.promises.mkdir(_path.default.dirname(updatedDest), {
                                    recursive: true
                                });
                                await _fs.promises.rename(updatedOrig, updatedDest);
                            }
                        }
                    });
                };
                // Only move /404 to /404 when there is no custom 404 as in that case we don't know about the 404 page
                if (!hasPages404 && useStatic404) {
                    await moveExportedPage('/_error', '/404', '/404', false, 'html');
                }
                if (useDefaultStatic500) {
                    await moveExportedPage('/_error', '/500', '/500', false, 'html');
                }
                for (const page1 of combinedPages){
                    const isSsg = ssgPages.has(page1);
                    const isStaticSsgFallback = ssgStaticFallbackPages.has(page1);
                    const isDynamic = (0, _utils).isDynamicRoute(page1);
                    const hasAmp = hybridAmpPages.has(page1);
                    const file = (0, _normalizePagePath).normalizePagePath(page1);
                    const pageInfo = pageInfos.get(page1);
                    const durationInfo = exportConfig.pageDurationMap[page1];
                    if (pageInfo && durationInfo) {
                        // Set Build Duration
                        if (pageInfo.ssgPageRoutes) {
                            pageInfo.ssgPageDurations = pageInfo.ssgPageRoutes.map((pagePath)=>durationInfo[pagePath]
                            );
                        }
                        pageInfo.pageDuration = durationInfo[page1];
                    }
                    // The dynamic version of SSG pages are only prerendered if the
                    // fallback is enabled. Below, we handle the specific prerenders
                    // of these.
                    const hasHtmlOutput = !(isSsg && isDynamic && !isStaticSsgFallback);
                    if (hasHtmlOutput) {
                        await moveExportedPage(page1, page1, file, isSsg, 'html');
                    }
                    if (hasAmp && (!isSsg || isSsg && !isDynamic)) {
                        const ampPage = `${file}.amp`;
                        await moveExportedPage(page1, ampPage, ampPage, isSsg, 'html');
                        if (isSsg) {
                            await moveExportedPage(page1, ampPage, ampPage, isSsg, 'json');
                        }
                    }
                    if (isSsg) {
                        // For a non-dynamic SSG page, we must copy its data file
                        // from export, we already moved the HTML file above
                        if (!isDynamic) {
                            await moveExportedPage(page1, page1, file, isSsg, 'json');
                            if (i18n) {
                                // TODO: do we want to show all locale variants in build output
                                for (const locale of i18n.locales){
                                    const localePage = `/${locale}${page1 === '/' ? '' : page1}`;
                                    finalPrerenderRoutes[localePage] = {
                                        initialRevalidateSeconds: exportConfig.initialPageRevalidationMap[localePage],
                                        srcRoute: null,
                                        dataRoute: _path.default.posix.join('/_next/data', buildId, `${file}.json`)
                                    };
                                }
                            } else {
                                finalPrerenderRoutes[page1] = {
                                    initialRevalidateSeconds: exportConfig.initialPageRevalidationMap[page1],
                                    srcRoute: null,
                                    dataRoute: _path.default.posix.join('/_next/data', buildId, `${file}.json`)
                                };
                            }
                            // Set Page Revalidation Interval
                            if (pageInfo) {
                                pageInfo.initialRevalidateSeconds = exportConfig.initialPageRevalidationMap[page1];
                            }
                        } else {
                            // For a dynamic SSG page, we did not copy its data exports and only
                            // copy the fallback HTML file (if present).
                            // We must also copy specific versions of this page as defined by
                            // `getStaticPaths` (additionalSsgPaths).
                            const extraRoutes = additionalSsgPaths.get(page1) || [];
                            for (const route of extraRoutes){
                                const pageFile = (0, _normalizePagePath).normalizePagePath(route);
                                await moveExportedPage(page1, route, pageFile, isSsg, 'html', true);
                                await moveExportedPage(page1, route, pageFile, isSsg, 'json', true);
                                if (hasAmp) {
                                    const ampPage = `${pageFile}.amp`;
                                    await moveExportedPage(page1, ampPage, ampPage, isSsg, 'html', true);
                                    await moveExportedPage(page1, ampPage, ampPage, isSsg, 'json', true);
                                }
                                finalPrerenderRoutes[route] = {
                                    initialRevalidateSeconds: exportConfig.initialPageRevalidationMap[route],
                                    srcRoute: page1,
                                    dataRoute: _path.default.posix.join('/_next/data', buildId, `${(0, _normalizePagePath).normalizePagePath(route)}.json`)
                                };
                                // Set route Revalidation Interval
                                if (pageInfo) {
                                    pageInfo.initialRevalidateSeconds = exportConfig.initialPageRevalidationMap[route];
                                }
                            }
                        }
                    }
                }
                // remove temporary export folder
                await (0, _recursiveDelete).recursiveDelete(exportOptions.outdir);
                await _fs.promises.rmdir(exportOptions.outdir);
                await _fs.promises.writeFile(manifestPath, JSON.stringify(pagesManifest, null, 2), 'utf8');
                if (postBuildSpinner) postBuildSpinner.stopAndPersist();
                console.log();
            });
        }
        const analysisEnd = process.hrtime(analysisBegin);
        var ref;
        telemetry.record((0, _events).eventBuildOptimize(pagePaths, {
            durationInSeconds: analysisEnd[0],
            staticPageCount: staticPages.size,
            staticPropsPageCount: ssgPages.size,
            serverPropsPageCount: serverPropsPages.size,
            ssrPageCount: pagePaths.length - (staticPages.size + ssgPages.size + serverPropsPages.size),
            hasStatic404: useStatic404,
            hasReportWebVitals: (ref = namedExports === null || namedExports === void 0 ? void 0 : namedExports.includes('reportWebVitals')) !== null && ref !== void 0 ? ref : false,
            rewritesCount: combinedRewrites.length,
            headersCount: headers.length,
            redirectsCount: redirects.length - 1,
            headersWithHasCount: headers.filter((r)=>!!r.has
            ).length,
            rewritesWithHasCount: combinedRewrites.filter((r)=>!!r.has
            ).length,
            redirectsWithHasCount: redirects.filter((r)=>!!r.has
            ).length,
            middlewareCount: pageKeys.filter((page)=>_constants.MIDDLEWARE_ROUTE.test(page)
            ).length
        }));
        if (telemetryPlugin) {
            const events = (0, _events).eventBuildFeatureUsage(telemetryPlugin);
            telemetry.record(events);
        }
        if (ssgPages.size > 0) {
            var ref21;
            const finalDynamicRoutes = {
            };
            tbdPrerenderRoutes.forEach((tbdRoute)=>{
                const normalizedRoute = (0, _normalizePagePath).normalizePagePath(tbdRoute);
                const dataRoute = _path.default.posix.join('/_next/data', buildId, `${normalizedRoute}.json`);
                finalDynamicRoutes[tbdRoute] = {
                    routeRegex: (0, _loadCustomRoutes).normalizeRouteRegex((0, _utils).getRouteRegex(tbdRoute).re.source),
                    dataRoute,
                    fallback: ssgBlockingFallbackPages.has(tbdRoute) ? null : ssgStaticFallbackPages.has(tbdRoute) ? `${normalizedRoute}.html` : false,
                    dataRouteRegex: (0, _loadCustomRoutes).normalizeRouteRegex((0, _utils).getRouteRegex(dataRoute.replace(/\.json$/, '')).re.source.replace(/\(\?:\\\/\)\?\$$/, '\\.json$'))
                };
            });
            const prerenderManifest = {
                version: 3,
                routes: finalPrerenderRoutes,
                dynamicRoutes: finalDynamicRoutes,
                notFoundRoutes: ssgNotFoundPaths,
                preview: previewProps
            };
            await _fs.promises.writeFile(_path.default.join(distDir, _constants1.PRERENDER_MANIFEST), JSON.stringify(prerenderManifest), 'utf8');
            await generateClientSsgManifest(prerenderManifest, {
                distDir,
                buildId,
                locales: ((ref21 = config.i18n) === null || ref21 === void 0 ? void 0 : ref21.locales) || []
            });
        } else {
            const prerenderManifest = {
                version: 3,
                routes: {
                },
                dynamicRoutes: {
                },
                preview: previewProps,
                notFoundRoutes: []
            };
            await _fs.promises.writeFile(_path.default.join(distDir, _constants1.PRERENDER_MANIFEST), JSON.stringify(prerenderManifest), 'utf8');
        }
        await _fs.promises.writeFile(_path.default.join(distDir, _constants1.CLIENT_STATIC_FILES_PATH, buildId, '_middlewareManifest.js'), `self.__MIDDLEWARE_MANIFEST=${(0, _devalue).default(middlewareManifest.clientInfo)};self.__MIDDLEWARE_MANIFEST_CB&&self.__MIDDLEWARE_MANIFEST_CB()`);
        const images = {
            ...config.images
        };
        const { deviceSizes , imageSizes  } = images;
        images.sizes = [
            ...deviceSizes,
            ...imageSizes
        ];
        await _fs.promises.writeFile(_path.default.join(distDir, _constants1.IMAGES_MANIFEST), JSON.stringify({
            version: 1,
            images
        }), 'utf8');
        await _fs.promises.writeFile(_path.default.join(distDir, _constants1.EXPORT_MARKER), JSON.stringify({
            version: 1,
            hasExportPathMap: typeof config.exportPathMap === 'function',
            exportTrailingSlash: config.trailingSlash === true,
            isNextImageImported: isNextImageImported === true
        }), 'utf8');
        await _fs.promises.unlink(_path.default.join(distDir, _constants1.EXPORT_DETAIL)).catch((err)=>{
            if (err.code === 'ENOENT') {
                return Promise.resolve();
            }
            return Promise.reject(err);
        });
        if (config.experimental.outputStandalone) {
            for (const file of [
                ...requiredServerFiles.files,
                _path.default.join(config.distDir, _constants1.SERVER_FILES_MANIFEST),
                ...loadedEnvFiles.reduce((acc, envFile)=>{
                    if ([
                        '.env',
                        '.env.production'
                    ].includes(envFile.path)) {
                        acc.push(envFile.path);
                    }
                    return acc;
                }, []), 
            ]){
                const filePath = _path.default.join(dir, file);
                await _fs.promises.copyFile(filePath, _path.default.join(distDir, 'standalone', _path.default.relative(outputFileTracingRoot, filePath)));
            }
            await (0, _recursiveCopy).recursiveCopy(_path.default.join(distDir, _constants1.SERVER_DIRECTORY, 'pages'), _path.default.join(distDir, 'standalone', _path.default.relative(outputFileTracingRoot, distDir), _constants1.SERVER_DIRECTORY, 'pages'), {
                overwrite: true
            });
        }
        staticPages.forEach((pg)=>allStaticPages.add(pg)
        );
        pageInfos.forEach((info, key)=>{
            allPageInfos.set(key, info);
        });
        await nextBuildSpan.traceChild('print-tree-view').traceAsyncFn(()=>(0, _utils2).printTreeView(Object.keys(mappedPages), allPageInfos, isLikeServerless, {
                distPath: distDir,
                buildId: buildId,
                pagesDir,
                useStatic404,
                pageExtensions: config.pageExtensions,
                buildManifest,
                gzipSize: config.experimental.gzipSize
            })
        );
        if (debugOutput) {
            nextBuildSpan.traceChild('print-custom-routes').traceFn(()=>(0, _utils2).printCustomRoutes({
                    redirects,
                    rewrites,
                    headers
                })
            );
        }
        if (config.analyticsId) {
            console.log(_chalk.default.bold.green('Next.js Analytics') + ' is enabled for this production build. ' + "You'll receive a Real Experience Score computed by all of your visitors.");
            console.log('');
        }
        await nextBuildSpan.traceChild('telemetry-flush').traceAsyncFn(()=>telemetry.flush()
        );
    });
    // Ensure all traces are flushed before finishing the command
    await (0, _trace).flushAllTraces();
    return buildResult;
}
function generateClientSsgManifest(prerenderManifest, { buildId , distDir , locales  }) {
    const ssgPages = new Set([
        ...Object.entries(prerenderManifest.routes)// Filter out dynamic routes
        .filter(([, { srcRoute  }])=>srcRoute == null
        ).map(([route])=>(0, _normalizeLocalePath).normalizeLocalePath(route, locales).pathname
        ),
        ...Object.keys(prerenderManifest.dynamicRoutes), 
    ]);
    const clientSsgManifestContent = `self.__SSG_MANIFEST=${(0, _devalue).default(ssgPages)};self.__SSG_MANIFEST_CB&&self.__SSG_MANIFEST_CB()`;
    (0, _fs).writeFileSync(_path.default.join(distDir, _constants1.CLIENT_STATIC_FILES_PATH, buildId, '_ssgManifest.js'), clientSsgManifestContent);
}
function isTelemetryPlugin(plugin) {
    return plugin instanceof _telemetryPlugin.TelemetryPlugin;
}
function pageToRoute(page) {
    const routeRegex = (0, _utils).getRouteRegex(page);
    return {
        page,
        regex: (0, _loadCustomRoutes).normalizeRouteRegex(routeRegex.re.source),
        routeKeys: routeRegex.routeKeys,
        namedRegex: routeRegex.namedRegex
    };
}

//# sourceMappingURL=index.js.map