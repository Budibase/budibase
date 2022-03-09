"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPageFromPath = getPageFromPath;
exports.createPagesMapping = createPagesMapping;
exports.createEntrypoints = createEntrypoints;
exports.finalizeEntrypoint = finalizeEntrypoint;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = require("path");
var _querystring = require("querystring");
var _constants = require("../lib/constants");
var _utils = require("../server/utils");
var _normalizePagePath = require("../server/normalize-page-path");
var _log = require("./output/log");
var _utils1 = require("./utils");
var _middlewarePlugin = require("./webpack/plugins/middleware-plugin");
var _constants1 = require("../shared/lib/constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getPageFromPath(pagePath, extensions) {
    let page = pagePath.replace(new RegExp(`\\.+(${extensions.join('|')})$`), '');
    page = page.replace(/\\/g, '/').replace(/\/index$/, '');
    return page === '' ? '/' : page;
}
function createPagesMapping(pagePaths, extensions, { isDev , hasServerComponents , runtime  }) {
    const previousPages = {
    };
    // Do not process .d.ts files inside the `pages` folder
    pagePaths = extensions.includes('ts') ? pagePaths.filter((pagePath)=>!pagePath.endsWith('.d.ts')
    ) : pagePaths;
    const pages = pagePaths.reduce((result, pagePath)=>{
        const pageKey = getPageFromPath(pagePath, extensions);
        if (hasServerComponents && /\.client$/.test(pageKey)) {
            // Assume that if there's a Client Component, that there is
            // a matching Server Component that will map to the page.
            return result;
        }
        if (pageKey in result) {
            (0, _log).warn(`Duplicate page detected. ${_chalk.default.cyan((0, _path).join('pages', previousPages[pageKey]))} and ${_chalk.default.cyan((0, _path).join('pages', pagePath))} both resolve to ${_chalk.default.cyan(pageKey)}.`);
        } else {
            previousPages[pageKey] = pagePath;
        }
        result[pageKey] = (0, _path).join(_constants.PAGES_DIR_ALIAS, pagePath).replace(/\\/g, '/');
        return result;
    }, {
    });
    // we alias these in development and allow webpack to
    // allow falling back to the correct source file so
    // that HMR can work properly when a file is added/removed
    const documentPage = `_document${runtime ? '-concurrent' : ''}`;
    if (isDev) {
        pages['/_app'] = `${_constants.PAGES_DIR_ALIAS}/_app`;
        pages['/_error'] = `${_constants.PAGES_DIR_ALIAS}/_error`;
        pages['/_document'] = `${_constants.PAGES_DIR_ALIAS}/_document`;
    } else {
        pages['/_app'] = pages['/_app'] || 'next/dist/pages/_app';
        pages['/_error'] = pages['/_error'] || 'next/dist/pages/_error';
        pages['/_document'] = pages['/_document'] || `next/dist/pages/${documentPage}`;
    }
    return pages;
}
function createEntrypoints(pages, target, buildId, previewMode, config, loadedEnvFiles) {
    const client = {
    };
    const server = {
    };
    const edgeServer = {
    };
    const hasRuntimeConfig = Object.keys(config.publicRuntimeConfig).length > 0 || Object.keys(config.serverRuntimeConfig).length > 0;
    const defaultServerlessOptions = {
        absoluteAppPath: pages['/_app'],
        absoluteDocumentPath: pages['/_document'],
        absoluteErrorPath: pages['/_error'],
        absolute404Path: pages['/404'] || '',
        distDir: _constants.DOT_NEXT_ALIAS,
        buildId,
        assetPrefix: config.assetPrefix,
        generateEtags: config.generateEtags ? 'true' : '',
        poweredByHeader: config.poweredByHeader ? 'true' : '',
        canonicalBase: config.amp.canonicalBase || '',
        basePath: config.basePath,
        runtimeConfig: hasRuntimeConfig ? JSON.stringify({
            publicRuntimeConfig: config.publicRuntimeConfig,
            serverRuntimeConfig: config.serverRuntimeConfig
        }) : '',
        previewProps: JSON.stringify(previewMode),
        // base64 encode to make sure contents don't break webpack URL loading
        loadedEnvFiles: Buffer.from(JSON.stringify(loadedEnvFiles)).toString('base64'),
        i18n: config.i18n ? JSON.stringify(config.i18n) : '',
        reactRoot: config.experimental.reactRoot ? 'true' : ''
    };
    Object.keys(pages).forEach((page)=>{
        const absolutePagePath = pages[page];
        const bundleFile = (0, _normalizePagePath).normalizePagePath(page);
        const isApiRoute = page.match(_constants.API_ROUTE);
        const clientBundlePath = _path.posix.join('pages', bundleFile);
        const serverBundlePath = _path.posix.join('pages', bundleFile);
        const isLikeServerless = (0, _utils).isTargetLikeServerless(target);
        const isReserved = (0, _utils1).isReservedPage(page);
        const isCustomError = (0, _utils1).isCustomErrorPage(page);
        const isFlight = (0, _utils1).isFlightPage(config, absolutePagePath);
        const edgeRuntime = config.experimental.runtime === 'edge';
        if (page.match(_constants.MIDDLEWARE_ROUTE)) {
            const loaderOpts = {
                absolutePagePath: pages[page],
                page
            };
            client[clientBundlePath] = `next-middleware-loader?${(0, _querystring).stringify(loaderOpts)}!`;
            return;
        }
        if (edgeRuntime && !isReserved && !isCustomError && !isApiRoute) {
            _middlewarePlugin.ssrEntries.set(clientBundlePath, {
                requireFlightManifest: isFlight
            });
            edgeServer[serverBundlePath] = finalizeEntrypoint({
                name: '[name].js',
                value: `next-middleware-ssr-loader?${(0, _querystring).stringify({
                    dev: false,
                    page,
                    stringifiedConfig: JSON.stringify(config),
                    absolute500Path: pages['/500'] || '',
                    absolutePagePath,
                    isServerComponent: isFlight,
                    ...defaultServerlessOptions
                })}!`,
                isServer: false,
                isEdgeServer: true
            });
        }
        if (isApiRoute && isLikeServerless) {
            const serverlessLoaderOptions = {
                page,
                absolutePagePath,
                ...defaultServerlessOptions
            };
            server[serverBundlePath] = `next-serverless-loader?${(0, _querystring).stringify(serverlessLoaderOptions)}!`;
        } else if (isApiRoute || target === 'server') {
            if (!edgeRuntime || isReserved || isCustomError) {
                server[serverBundlePath] = [
                    absolutePagePath
                ];
            }
        } else if (isLikeServerless && page !== '/_app' && page !== '/_document' && !edgeRuntime) {
            const serverlessLoaderOptions = {
                page,
                absolutePagePath,
                ...defaultServerlessOptions
            };
            server[serverBundlePath] = `next-serverless-loader?${(0, _querystring).stringify(serverlessLoaderOptions)}!`;
        }
        if (page === '/_document') {
            return;
        }
        if (!isApiRoute) {
            const pageLoaderOpts = {
                page,
                absolutePagePath
            };
            const pageLoader = `next-client-pages-loader?${(0, _querystring).stringify(pageLoaderOpts)}!`;
            // Make sure next/router is a dependency of _app or else chunk splitting
            // might cause the router to not be able to load causing hydration
            // to fail
            client[clientBundlePath] = page === '/_app' ? [
                pageLoader,
                require.resolve('../client/router')
            ] : pageLoader;
        }
    });
    return {
        client,
        server,
        edgeServer
    };
}
function finalizeEntrypoint({ name , value , isServer , isMiddleware , isEdgeServer  }) {
    const entry = typeof value !== 'object' || Array.isArray(value) ? {
        import: value
    } : value;
    if (isServer) {
        const isApi = name.startsWith('pages/api/');
        return {
            publicPath: isApi ? '' : undefined,
            runtime: isApi ? 'webpack-api-runtime' : 'webpack-runtime',
            layer: isApi ? 'api' : undefined,
            ...entry
        };
    }
    if (isEdgeServer) {
        const ssrMiddlewareEntry = {
            library: {
                name: [
                    '_ENTRIES',
                    `middleware_[name]`
                ],
                type: 'assign'
            },
            runtime: _constants1.MIDDLEWARE_SSR_RUNTIME_WEBPACK,
            asyncChunks: false,
            ...entry
        };
        return ssrMiddlewareEntry;
    }
    if (isMiddleware) {
        const middlewareEntry = {
            filename: 'server/[name].js',
            layer: 'middleware',
            library: {
                name: [
                    '_ENTRIES',
                    `middleware_[name]`
                ],
                type: 'assign'
            },
            runtime: _constants1.MIDDLEWARE_RUNTIME_WEBPACK,
            asyncChunks: false,
            ...entry
        };
        return middlewareEntry;
    }
    if (name !== 'polyfills' && name !== 'main' && name !== 'amp' && name !== 'react-refresh') {
        return {
            dependOn: name.startsWith('pages/') && name !== 'pages/_app' ? 'pages/_app' : 'main',
            ...entry
        };
    }
    return entry;
}

//# sourceMappingURL=entries.js.map