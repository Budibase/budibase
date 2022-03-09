"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderToHTML = renderToHTML;
exports.useMaybeDeferContent = useMaybeDeferContent;
var _querystring = require("querystring");
var _react = _interopRequireDefault(require("react"));
var _reactServerDomWebpack = require("next/dist/compiled/react-server-dom-webpack");
var _writerBrowserServer = require("next/dist/compiled/react-server-dom-webpack/writer.browser.server");
var _styledJsx = require("styled-jsx");
var _constants = require("../lib/constants");
var _isSerializableProps = require("../lib/is-serializable-props");
var _amp = require("../shared/lib/amp");
var _ampContext = require("../shared/lib/amp-context");
var _constants1 = require("../shared/lib/constants");
var _head = require("../shared/lib/head");
var _headManagerContext = require("../shared/lib/head-manager-context");
var _loadable = _interopRequireDefault(require("../shared/lib/loadable"));
var _loadableContext = require("../shared/lib/loadable-context");
var _routerContext = require("../shared/lib/router-context");
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _utils = require("../shared/lib/utils");
var _denormalizePagePath = require("./denormalize-page-path");
var _normalizePagePath = require("./normalize-page-path");
var _requestMeta = require("./request-meta");
var _loadCustomRoutes = require("../lib/load-custom-routes");
var _renderResult = _interopRequireDefault(require("./render-result"));
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _utils1 = require("./web/utils");
var _imageConfigContext = require("../shared/lib/image-config-context");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let optimizeAmp;
let getFontDefinitionFromManifest;
let tryGetPreviewData;
let warn;
let postProcess;
const DOCTYPE = '<!DOCTYPE html>';
if (!process.browser) {
    require('./node-polyfill-web-streams');
    optimizeAmp = require('./optimize-amp').default;
    getFontDefinitionFromManifest = require('./font-utils').getFontDefinitionFromManifest;
    tryGetPreviewData = require('./api-utils/node').tryGetPreviewData;
    warn = require('../build/output/log').warn;
    postProcess = require('../shared/lib/post-process').default;
} else {
    warn = console.warn.bind(console);
}
function noRouter() {
    const message = 'No router instance found. you should only use "next/router" inside the client side of your app. https://nextjs.org/docs/messages/no-router-instance';
    throw new Error(message);
}
class ServerRouter {
    constructor(pathname, query, as, { isFallback  }, isReady, basePath, locale, locales, defaultLocale, domainLocales, isPreview, isLocaleDomain){
        this.route = pathname.replace(/\/$/, '') || '/';
        this.pathname = pathname;
        this.query = query;
        this.asPath = as;
        this.isFallback = isFallback;
        this.basePath = basePath;
        this.locale = locale;
        this.locales = locales;
        this.defaultLocale = defaultLocale;
        this.isReady = isReady;
        this.domainLocales = domainLocales;
        this.isPreview = !!isPreview;
        this.isLocaleDomain = !!isLocaleDomain;
    }
    push() {
        noRouter();
    }
    replace() {
        noRouter();
    }
    reload() {
        noRouter();
    }
    back() {
        noRouter();
    }
    prefetch() {
        noRouter();
    }
    beforePopState() {
        noRouter();
    }
}
function enhanceComponents(options, App, Component) {
    // For backwards compatibility
    if (typeof options === 'function') {
        return {
            App,
            Component: options(Component)
        };
    }
    return {
        App: options.enhanceApp ? options.enhanceApp(App) : App,
        Component: options.enhanceComponent ? options.enhanceComponent(Component) : Component
    };
}
function renderFlight(App, Component, props) {
    const AppServer = App.__next_rsc__ ? App : _react.default.Fragment;
    return(/*#__PURE__*/ _react.default.createElement(AppServer, null, /*#__PURE__*/ _react.default.createElement(Component, Object.assign({
    }, props))));
}
const invalidKeysMsg = (methodName, invalidKeys)=>{
    return `Additional keys were returned from \`${methodName}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` + `\n\n\treturn { props: { title: 'My Title', content: '...' } }` + `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticprops-value`;
};
function checkRedirectValues(redirect, req, method) {
    const { destination , permanent , statusCode , basePath  } = redirect;
    let errors = [];
    const hasStatusCode = typeof statusCode !== 'undefined';
    const hasPermanent = typeof permanent !== 'undefined';
    if (hasPermanent && hasStatusCode) {
        errors.push(`\`permanent\` and \`statusCode\` can not both be provided`);
    } else if (hasPermanent && typeof permanent !== 'boolean') {
        errors.push(`\`permanent\` must be \`true\` or \`false\``);
    } else if (hasStatusCode && !_loadCustomRoutes.allowedStatusCodes.has(statusCode)) {
        errors.push(`\`statusCode\` must undefined or one of ${[
            ..._loadCustomRoutes.allowedStatusCodes
        ].join(', ')}`);
    }
    const destinationType = typeof destination;
    if (destinationType !== 'string') {
        errors.push(`\`destination\` should be string but received ${destinationType}`);
    }
    const basePathType = typeof basePath;
    if (basePathType !== 'undefined' && basePathType !== 'boolean') {
        errors.push(`\`basePath\` should be undefined or a false, received ${basePathType}`);
    }
    if (errors.length > 0) {
        throw new Error(`Invalid redirect object returned from ${method} for ${req.url}\n` + errors.join(' and ') + '\n' + `See more info here: https://nextjs.org/docs/messages/invalid-redirect-gssp`);
    }
}
const rscCache = new Map();
function createRSCHook() {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    return (writable, id, req, bootstrap)=>{
        let entry = rscCache.get(id);
        if (!entry) {
            const [renderStream, forwardStream] = (0, _utils1).readableStreamTee(req);
            entry = (0, _reactServerDomWebpack).createFromReadableStream(renderStream);
            rscCache.set(id, entry);
            let bootstrapped = false;
            const forwardReader = forwardStream.getReader();
            const writer = writable.getWriter();
            function process() {
                forwardReader.read().then(({ done , value  })=>{
                    if (bootstrap && !bootstrapped) {
                        bootstrapped = true;
                        writer.write(encoder.encode(`<script>(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            0,
                            id
                        ])})</script>`));
                    }
                    if (done) {
                        rscCache.delete(id);
                        writer.close();
                    } else {
                        writer.write(encoder.encode(`<script>(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            1,
                            id,
                            decoder.decode(value)
                        ])})</script>`));
                        process();
                    }
                });
            }
            process();
        }
        return entry;
    };
}
const useRSCResponse = createRSCHook();
// Create the wrapper component for a Flight stream.
function createServerComponentRenderer(App, OriginalComponent, { cachePrefix , transformStream , serverComponentManifest , runtime  }) {
    if (runtime === 'nodejs') {
        // For the nodejs runtime, we need to expose the `__webpack_require__` API
        // globally for react-server-dom-webpack.
        // This is a hack until we find a better way.
        // @ts-ignore
        globalThis.__webpack_require__ = OriginalComponent.__webpack_require__;
    }
    const writable = transformStream.writable;
    const ServerComponentWrapper = (props)=>{
        const id = _react.default.useId();
        const reqStream = (0, _writerBrowserServer).renderToReadableStream(renderFlight(App, OriginalComponent, props), serverComponentManifest);
        const response = useRSCResponse(writable, cachePrefix + ',' + id, reqStream, true);
        const root = response.readRoot();
        rscCache.delete(id);
        return root;
    };
    const Component = (props)=>{
        return(/*#__PURE__*/ _react.default.createElement(_react.default.Suspense, {
            fallback: null
        }, /*#__PURE__*/ _react.default.createElement(ServerComponentWrapper, Object.assign({
        }, props))));
    };
    // Although it's not allowed to attach some static methods to Component,
    // we still re-assign all the component APIs to keep the behavior unchanged.
    for (const methodName of [
        'getInitialProps',
        'getStaticProps',
        'getServerSideProps',
        'getStaticPaths', 
    ]){
        const method = OriginalComponent[methodName];
        if (method) {
            Component[methodName] = method;
        }
    }
    return Component;
}
async function renderToHTML(req, res, pathname, query, renderOpts) {
    // In dev we invalidate the cache by appending a timestamp to the resource URL.
    // This is a workaround to fix https://github.com/vercel/next.js/issues/5860
    // TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
    renderOpts.devOnlyCacheBusterQueryString = renderOpts.dev ? renderOpts.devOnlyCacheBusterQueryString || `?ts=${Date.now()}` : '';
    // don't modify original query object
    query = Object.assign({
    }, query);
    const { err , dev =false , ampPath ='' , App , Document , pageConfig ={
    } , buildManifest , fontManifest , reactLoadableManifest , ErrorDebug , getStaticProps , getStaticPaths , getServerSideProps , serverComponentManifest , serverComponentProps , isDataReq , params , previewProps , basePath , devOnlyCacheBusterQueryString , supportsDynamicHTML , images , reactRoot , runtime ,  } = renderOpts;
    const hasConcurrentFeatures = !!runtime;
    const OriginalComponent = renderOpts.Component;
    // We don't need to opt-into the flight inlining logic if the page isn't a RSC.
    const isServerComponent = !!serverComponentManifest && hasConcurrentFeatures && OriginalComponent.__next_rsc__;
    let Component = renderOpts.Component;
    let serverComponentsInlinedTransformStream = null;
    if (isServerComponent) {
        serverComponentsInlinedTransformStream = new TransformStream();
        const search = (0, _querystring).stringify(query);
        Component = createServerComponentRenderer(App, OriginalComponent, {
            cachePrefix: pathname + (search ? `?${search}` : ''),
            transformStream: serverComponentsInlinedTransformStream,
            serverComponentManifest,
            runtime
        });
    }
    const getFontDefinition = (url)=>{
        if (fontManifest) {
            return getFontDefinitionFromManifest(url, fontManifest);
        }
        return '';
    };
    let { renderServerComponentData  } = renderOpts;
    if (isServerComponent && query.__flight__) {
        renderServerComponentData = true;
        delete query.__flight__;
    }
    const callMiddleware = async (method, args, props = false)=>{
        let results = props ? {
        } : [];
        if (Document[`${method}Middleware`]) {
            let middlewareFunc = await Document[`${method}Middleware`];
            middlewareFunc = middlewareFunc.default || middlewareFunc;
            const curResults = await middlewareFunc(...args);
            if (props) {
                for (const result of curResults){
                    results = {
                        ...results,
                        ...result
                    };
                }
            } else {
                results = curResults;
            }
        }
        return results;
    };
    const headTags = (...args)=>callMiddleware('headTags', args)
    ;
    const isFallback = !!query.__nextFallback;
    const notFoundSrcPage = query.__nextNotFoundSrcPage;
    delete query.__nextFallback;
    delete query.__nextLocale;
    delete query.__nextDefaultLocale;
    delete query.__nextIsNotFound;
    const isSSG = !!getStaticProps;
    const isBuildTimeSSG = isSSG && renderOpts.nextExport;
    const defaultAppGetInitialProps = App.getInitialProps === App.origGetInitialProps;
    const hasPageGetInitialProps = !!Component.getInitialProps;
    const pageIsDynamic = (0, _isDynamic).isDynamicRoute(pathname);
    const isAutoExport = !hasPageGetInitialProps && defaultAppGetInitialProps && !isSSG && !getServerSideProps && !hasConcurrentFeatures;
    for (const methodName of [
        'getStaticProps',
        'getServerSideProps',
        'getStaticPaths', 
    ]){
        if (Component[methodName]) {
            throw new Error(`page ${pathname} ${methodName} ${_constants.GSSP_COMPONENT_MEMBER_ERROR}`);
        }
    }
    if (hasPageGetInitialProps && isSSG) {
        throw new Error(_constants.SSG_GET_INITIAL_PROPS_CONFLICT + ` ${pathname}`);
    }
    if (hasPageGetInitialProps && getServerSideProps) {
        throw new Error(_constants.SERVER_PROPS_GET_INIT_PROPS_CONFLICT + ` ${pathname}`);
    }
    if (getServerSideProps && isSSG) {
        throw new Error(_constants.SERVER_PROPS_SSG_CONFLICT + ` ${pathname}`);
    }
    if (getStaticPaths && !pageIsDynamic) {
        throw new Error(`getStaticPaths is only allowed for dynamic SSG pages and was found on '${pathname}'.` + `\nRead more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage`);
    }
    if (!!getStaticPaths && !isSSG) {
        throw new Error(`getStaticPaths was added without a getStaticProps in ${pathname}. Without getStaticProps, getStaticPaths does nothing`);
    }
    if (isSSG && pageIsDynamic && !getStaticPaths) {
        throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${pathname}'.` + `\nRead more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`);
    }
    let asPath = renderOpts.resolvedAsPath || req.url;
    if (dev) {
        const { isValidElementType  } = require('next/dist/compiled/react-is');
        if (!isValidElementType(Component)) {
            throw new Error(`The default export is not a React Component in page: "${pathname}"`);
        }
        if (!isValidElementType(App)) {
            throw new Error(`The default export is not a React Component in page: "/_app"`);
        }
        if (!isValidElementType(Document)) {
            throw new Error(`The default export is not a React Component in page: "/_document"`);
        }
        if (isAutoExport || isFallback) {
            // remove query values except ones that will be set during export
            query = {
                ...query.amp ? {
                    amp: query.amp
                } : {
                }
            };
            asPath = `${pathname}${// ensure trailing slash is present for non-dynamic auto-export pages
            req.url.endsWith('/') && pathname !== '/' && !pageIsDynamic ? '/' : ''}`;
            req.url = pathname;
        }
        if (pathname === '/404' && (hasPageGetInitialProps || getServerSideProps)) {
            throw new Error(`\`pages/404\` ${_constants.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
        }
        if (_constants1.STATIC_STATUS_PAGES.includes(pathname) && (hasPageGetInitialProps || getServerSideProps)) {
            throw new Error(`\`pages${pathname}\` ${_constants.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR}`);
        }
    }
    await _loadable.default.preloadAll() // Make sure all dynamic imports are loaded
    ;
    let isPreview;
    let previewData;
    if ((isSSG || getServerSideProps) && !isFallback && !process.browser) {
        // Reads of this are cached on the `req` object, so this should resolve
        // instantly. There's no need to pass this data down from a previous
        // invoke, where we'd have to consider server & serverless.
        previewData = tryGetPreviewData(req, res, previewProps);
        isPreview = previewData !== false;
    }
    // url will always be set
    const routerIsReady = !!(getServerSideProps || hasPageGetInitialProps || !defaultAppGetInitialProps && !isSSG);
    const router = new ServerRouter(pathname, query, asPath, {
        isFallback: isFallback
    }, routerIsReady, basePath, renderOpts.locale, renderOpts.locales, renderOpts.defaultLocale, renderOpts.domainLocales, isPreview, (0, _requestMeta).getRequestMeta(req, '__nextIsLocaleDomain'));
    const jsxStyleRegistry = (0, _styledJsx).createStyleRegistry();
    const ctx = {
        err,
        req: isAutoExport ? undefined : req,
        res: isAutoExport ? undefined : res,
        pathname,
        query,
        asPath,
        locale: renderOpts.locale,
        locales: renderOpts.locales,
        defaultLocale: renderOpts.defaultLocale,
        AppTree: (props)=>{
            return(/*#__PURE__*/ _react.default.createElement(AppContainerWithIsomorphicFiberStructure, null, /*#__PURE__*/ _react.default.createElement(App, Object.assign({
            }, props, {
                Component: Component,
                router: router
            }))));
        },
        defaultGetInitialProps: async (docCtx, options = {
        })=>{
            const enhanceApp = (AppComp)=>{
                return (props)=>/*#__PURE__*/ _react.default.createElement(AppComp, Object.assign({
                    }, props))
                ;
            };
            const { html , head  } = await docCtx.renderPage({
                enhanceApp
            });
            const styles = jsxStyleRegistry.styles({
                nonce: options.nonce
            });
            return {
                html,
                head,
                styles
            };
        }
    };
    let props;
    const ampState = {
        ampFirst: pageConfig.amp === true,
        hasQuery: Boolean(query.amp),
        hybrid: pageConfig.amp === 'hybrid'
    };
    // Disable AMP under the web environment
    const inAmpMode = !process.browser && (0, _amp).isInAmpMode(ampState);
    const reactLoadableModules = [];
    let head = (0, _head).defaultHead(inAmpMode);
    let scriptLoader = {
    };
    const nextExport = !isSSG && (renderOpts.nextExport || dev && (isAutoExport || isFallback));
    const AppContainer = ({ children  })=>/*#__PURE__*/ _react.default.createElement(_routerContext.RouterContext.Provider, {
            value: router
        }, /*#__PURE__*/ _react.default.createElement(_ampContext.AmpStateContext.Provider, {
            value: ampState
        }, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
            value: {
                updateHead: (state)=>{
                    head = state;
                },
                updateScripts: (scripts)=>{
                    scriptLoader = scripts;
                },
                scripts: {
                },
                mountedInstances: new Set()
            }
        }, /*#__PURE__*/ _react.default.createElement(_loadableContext.LoadableContext.Provider, {
            value: (moduleName)=>reactLoadableModules.push(moduleName)
        }, /*#__PURE__*/ _react.default.createElement(_styledJsx.StyleRegistry, {
            registry: jsxStyleRegistry
        }, /*#__PURE__*/ _react.default.createElement(_imageConfigContext.ImageConfigContext.Provider, {
            value: images
        }, children))))))
    ;
    // The `useId` API uses the path indexes to generate an ID for each node.
    // To guarantee the match of hydration, we need to ensure that the structure
    // of wrapper nodes is isomorphic in server and client.
    // TODO: With `enhanceApp` and `enhanceComponents` options, this approach may
    // not be useful.
    // https://github.com/facebook/react/pull/22644
    const Noop = ()=>null
    ;
    const AppContainerWithIsomorphicFiberStructure = ({ children  })=>{
        return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(Noop, null), /*#__PURE__*/ _react.default.createElement(AppContainer, null, /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, dev ? /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, children, /*#__PURE__*/ _react.default.createElement(Noop, null)) : children, /*#__PURE__*/ _react.default.createElement(Noop, null)))));
    };
    props = await (0, _utils).loadGetInitialProps(App, {
        AppTree: ctx.AppTree,
        Component,
        router,
        ctx
    });
    if ((isSSG || getServerSideProps) && isPreview) {
        props.__N_PREVIEW = true;
    }
    if (isSSG) {
        props[_constants1.STATIC_PROPS_ID] = true;
    }
    if (isSSG && !isFallback) {
        let data;
        try {
            data = await getStaticProps({
                ...pageIsDynamic ? {
                    params: query
                } : undefined,
                ...isPreview ? {
                    preview: true,
                    previewData: previewData
                } : undefined,
                locales: renderOpts.locales,
                locale: renderOpts.locale,
                defaultLocale: renderOpts.defaultLocale
            });
        } catch (staticPropsError) {
            // remove not found error code to prevent triggering legacy
            // 404 rendering
            if (staticPropsError && staticPropsError.code === 'ENOENT') {
                delete staticPropsError.code;
            }
            throw staticPropsError;
        }
        if (data == null) {
            throw new Error(_constants.GSP_NO_RETURNED_VALUE);
        }
        const invalidKeys = Object.keys(data).filter((key)=>key !== 'revalidate' && key !== 'props' && key !== 'redirect' && key !== 'notFound'
        );
        if (invalidKeys.includes('unstable_revalidate')) {
            throw new Error(_constants.UNSTABLE_REVALIDATE_RENAME_ERROR);
        }
        if (invalidKeys.length) {
            throw new Error(invalidKeysMsg('getStaticProps', invalidKeys));
        }
        if (process.env.NODE_ENV !== 'production') {
            if (typeof data.notFound !== 'undefined' && typeof data.redirect !== 'undefined') {
                throw new Error(`\`redirect\` and \`notFound\` can not both be returned from ${isSSG ? 'getStaticProps' : 'getServerSideProps'} at the same time. Page: ${pathname}\nSee more info here: https://nextjs.org/docs/messages/gssp-mixed-not-found-redirect`);
            }
        }
        if ('notFound' in data && data.notFound) {
            if (pathname === '/404') {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts.isNotFound = true;
        }
        if ('redirect' in data && data.redirect && typeof data.redirect === 'object') {
            checkRedirectValues(data.redirect, req, 'getStaticProps');
            if (isBuildTimeSSG) {
                throw new Error(`\`redirect\` can not be returned from getStaticProps during prerendering (${req.url})\n` + `See more info here: https://nextjs.org/docs/messages/gsp-redirect-during-prerender`);
            }
            data.props = {
                __N_REDIRECT: data.redirect.destination,
                __N_REDIRECT_STATUS: (0, _loadCustomRoutes).getRedirectStatus(data.redirect)
            };
            if (typeof data.redirect.basePath !== 'undefined') {
                data.props.__N_REDIRECT_BASE_PATH = data.redirect.basePath;
            }
            renderOpts.isRedirect = true;
        }
        if ((dev || isBuildTimeSSG) && !renderOpts.isNotFound && !(0, _isSerializableProps).isSerializableProps(pathname, 'getStaticProps', data.props)) {
            // this fn should throw an error instead of ever returning `false`
            throw new Error('invariant: getStaticProps did not return valid props. Please report this.');
        }
        if ('revalidate' in data) {
            if (typeof data.revalidate === 'number') {
                if (!Number.isInteger(data.revalidate)) {
                    throw new Error(`A page's revalidate option must be seconds expressed as a natural number for ${req.url}. Mixed numbers, such as '${data.revalidate}', cannot be used.` + `\nTry changing the value to '${Math.ceil(data.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);
                } else if (data.revalidate <= 0) {
                    throw new Error(`A page's revalidate option can not be less than or equal to zero for ${req.url}. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` + `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` + `\nTo revalidate as soon as possible, you can set the value to \`1\`.`);
                } else if (data.revalidate > 31536000) {
                    // if it's greater than a year for some reason error
                    console.warn(`Warning: A page's revalidate option was set to more than a year for ${req.url}. This may have been done in error.` + `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);
                }
            } else if (data.revalidate === true) {
                // When enabled, revalidate after 1 second. This value is optimal for
                // the most up-to-date page possible, but without a 1-to-1
                // request-refresh ratio.
                data.revalidate = 1;
            } else if (data.revalidate === false || typeof data.revalidate === 'undefined') {
                // By default, we never revalidate.
                data.revalidate = false;
            } else {
                throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers and strings cannot be used. Received '${JSON.stringify(data.revalidate)}' for ${req.url}`);
            }
        } else {
            data.revalidate = false;
        }
        props.pageProps = Object.assign({
        }, props.pageProps, 'props' in data ? data.props : undefined);
        renderOpts.revalidate = 'revalidate' in data ? data.revalidate : undefined;
        renderOpts.pageData = props;
        // this must come after revalidate is added to renderOpts
        if (renderOpts.isNotFound) {
            return null;
        }
    }
    if (getServerSideProps) {
        props[_constants1.SERVER_PROPS_ID] = true;
    }
    if (getServerSideProps && !isFallback) {
        let data;
        let canAccessRes = true;
        let resOrProxy = res;
        let deferredContent = false;
        if (process.env.NODE_ENV !== 'production') {
            resOrProxy = new Proxy(res, {
                get: function(obj, prop, receiver) {
                    if (!canAccessRes) {
                        const message = `You should not access 'res' after getServerSideProps resolves.` + `\nRead more: https://nextjs.org/docs/messages/gssp-no-mutating-res`;
                        if (deferredContent) {
                            throw new Error(message);
                        } else {
                            warn(message);
                        }
                    }
                    const value = Reflect.get(obj, prop, receiver);
                    // since ServerResponse uses internal fields which
                    // proxy can't map correctly we need to ensure functions
                    // are bound correctly while being proxied
                    if (typeof value === 'function') {
                        return value.bind(obj);
                    }
                    return value;
                }
            });
        }
        try {
            data = await getServerSideProps({
                req: req,
                res: resOrProxy,
                query,
                resolvedUrl: renderOpts.resolvedUrl,
                ...pageIsDynamic ? {
                    params: params
                } : undefined,
                ...previewData !== false ? {
                    preview: true,
                    previewData: previewData
                } : undefined,
                locales: renderOpts.locales,
                locale: renderOpts.locale,
                defaultLocale: renderOpts.defaultLocale
            });
            canAccessRes = false;
        } catch (serverSidePropsError) {
            // remove not found error code to prevent triggering legacy
            // 404 rendering
            if ((0, _isError).default(serverSidePropsError) && serverSidePropsError.code === 'ENOENT') {
                delete serverSidePropsError.code;
            }
            throw serverSidePropsError;
        }
        if (data == null) {
            throw new Error(_constants.GSSP_NO_RETURNED_VALUE);
        }
        if (data.props instanceof Promise) {
            deferredContent = true;
        }
        const invalidKeys = Object.keys(data).filter((key)=>key !== 'props' && key !== 'redirect' && key !== 'notFound'
        );
        if (data.unstable_notFound) {
            throw new Error(`unstable_notFound has been renamed to notFound, please update the field to continue. Page: ${pathname}`);
        }
        if (data.unstable_redirect) {
            throw new Error(`unstable_redirect has been renamed to redirect, please update the field to continue. Page: ${pathname}`);
        }
        if (invalidKeys.length) {
            throw new Error(invalidKeysMsg('getServerSideProps', invalidKeys));
        }
        if ('notFound' in data && data.notFound) {
            if (pathname === '/404') {
                throw new Error(`The /404 page can not return notFound in "getStaticProps", please remove it to continue!`);
            }
            renderOpts.isNotFound = true;
            return null;
        }
        if ('redirect' in data && typeof data.redirect === 'object') {
            checkRedirectValues(data.redirect, req, 'getServerSideProps');
            data.props = {
                __N_REDIRECT: data.redirect.destination,
                __N_REDIRECT_STATUS: (0, _loadCustomRoutes).getRedirectStatus(data.redirect)
            };
            if (typeof data.redirect.basePath !== 'undefined') {
                data.props.__N_REDIRECT_BASE_PATH = data.redirect.basePath;
            }
            renderOpts.isRedirect = true;
        }
        if (deferredContent) {
            data.props = await data.props;
        }
        if ((dev || isBuildTimeSSG) && !(0, _isSerializableProps).isSerializableProps(pathname, 'getServerSideProps', data.props)) {
            // this fn should throw an error instead of ever returning `false`
            throw new Error('invariant: getServerSideProps did not return valid props. Please report this.');
        }
        props.pageProps = Object.assign({
        }, props.pageProps, data.props);
        renderOpts.pageData = props;
    }
    if (!isSSG && !getServerSideProps && process.env.NODE_ENV !== 'production' && Object.keys((props === null || props === void 0 ? void 0 : props.pageProps) || {
    }).includes('url')) {
        console.warn(`The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname}\n` + `See more info here: https://nextjs.org/docs/messages/reserved-page-prop`);
    }
    // Avoid rendering page un-necessarily for getServerSideProps data request
    // and getServerSideProps/getStaticProps redirects
    if (isDataReq && !isSSG || renderOpts.isRedirect) {
        return _renderResult.default.fromStatic(JSON.stringify(props));
    }
    // We don't call getStaticProps or getServerSideProps while generating
    // the fallback so make sure to set pageProps to an empty object
    if (isFallback) {
        props.pageProps = {
        };
    }
    // Pass router to the Server Component as a temporary workaround.
    if (isServerComponent) {
        props.pageProps = Object.assign({
        }, props.pageProps, {
            router
        });
    }
    // the response might be finished on the getInitialProps call
    if ((0, _utils).isResSent(res) && !isSSG) return null;
    if (renderServerComponentData) {
        const stream = (0, _writerBrowserServer).renderToReadableStream(renderFlight(App, OriginalComponent, {
            ...props.pageProps,
            ...serverComponentProps
        }), serverComponentManifest);
        return new _renderResult.default(pipeThrough(stream, createBufferedTransformStream()));
    }
    // we preload the buildManifest for auto-export dynamic pages
    // to speed up hydrating query values
    let filteredBuildManifest = buildManifest;
    if (isAutoExport && pageIsDynamic) {
        const page = (0, _denormalizePagePath).denormalizePagePath((0, _normalizePagePath).normalizePagePath(pathname));
        // This code would be much cleaner using `immer` and directly pushing into
        // the result from `getPageFiles`, we could maybe consider that in the
        // future.
        if (page in filteredBuildManifest.pages) {
            filteredBuildManifest = {
                ...filteredBuildManifest,
                pages: {
                    ...filteredBuildManifest.pages,
                    [page]: [
                        ...filteredBuildManifest.pages[page],
                        ...filteredBuildManifest.lowPriorityFiles.filter((f)=>f.includes('_buildManifest')
                        ), 
                    ]
                },
                lowPriorityFiles: filteredBuildManifest.lowPriorityFiles.filter((f)=>!f.includes('_buildManifest')
                )
            };
        }
    }
    const Body = ({ children  })=>{
        return inAmpMode ? children : /*#__PURE__*/ _react.default.createElement("div", {
            id: "__next"
        }, children);
    };
    const ReactDOMServer = reactRoot ? require('react-dom/server.browser') : require('react-dom/server');
    /**
   * Rules of Static & Dynamic HTML:
   *
   *    1.) We must generate static HTML unless the caller explicitly opts
   *        in to dynamic HTML support.
   *
   *    2.) If dynamic HTML support is requested, we must honor that request
   *        or throw an error. It is the sole responsibility of the caller to
   *        ensure they aren't e.g. requesting dynamic HTML for an AMP page.
   *
   * These rules help ensure that other existing features like request caching,
   * coalescing, and ISR continue working as intended.
   */ const generateStaticHTML = supportsDynamicHTML !== true;
    const renderDocument = async ()=>{
        if (!runtime && Document.getInitialProps) {
            const renderPage = (options = {
            })=>{
                if (ctx.err && ErrorDebug) {
                    const html = ReactDOMServer.renderToString(/*#__PURE__*/ _react.default.createElement(Body, null, /*#__PURE__*/ _react.default.createElement(ErrorDebug, {
                        error: ctx.err
                    })));
                    return {
                        html,
                        head
                    };
                }
                if (dev && (props.router || props.Component)) {
                    throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://nextjs.org/docs/messages/cant-override-next-props`);
                }
                const { App: EnhancedApp , Component: EnhancedComponent  } = enhanceComponents(options, App, Component);
                const html = ReactDOMServer.renderToString(/*#__PURE__*/ _react.default.createElement(Body, null, /*#__PURE__*/ _react.default.createElement(AppContainerWithIsomorphicFiberStructure, null, /*#__PURE__*/ _react.default.createElement(EnhancedApp, Object.assign({
                    Component: EnhancedComponent,
                    router: router
                }, props)))));
                return {
                    html,
                    head
                };
            };
            const documentCtx = {
                ...ctx,
                renderPage
            };
            const docProps = await (0, _utils).loadGetInitialProps(Document, documentCtx);
            // the response might be finished on the getInitialProps call
            if ((0, _utils).isResSent(res) && !isSSG) return null;
            if (!docProps || typeof docProps.html !== 'string') {
                const message = `"${(0, _utils).getDisplayName(Document)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                throw new Error(message);
            }
            return {
                bodyResult: (suffix)=>streamFromArray([
                        docProps.html,
                        suffix
                    ])
                ,
                documentElement: (htmlProps)=>/*#__PURE__*/ _react.default.createElement(Document, Object.assign({
                    }, htmlProps, docProps))
                ,
                head: docProps.head,
                headTags: await headTags(documentCtx),
                styles: docProps.styles
            };
        } else {
            let bodyResult;
            const renderContent = ()=>{
                return ctx.err && ErrorDebug ? /*#__PURE__*/ _react.default.createElement(Body, null, /*#__PURE__*/ _react.default.createElement(ErrorDebug, {
                    error: ctx.err
                })) : /*#__PURE__*/ _react.default.createElement(Body, null, /*#__PURE__*/ _react.default.createElement(AppContainerWithIsomorphicFiberStructure, null, renderOpts.serverComponents && App.__next_rsc__ ? /*#__PURE__*/ _react.default.createElement(Component, Object.assign({
                }, props.pageProps, {
                    router: router
                })) : /*#__PURE__*/ _react.default.createElement(App, Object.assign({
                }, props, {
                    Component: Component,
                    router: router
                }))));
            };
            if (reactRoot) {
                bodyResult = async (suffix)=>{
                    // this must be called inside bodyResult so appWrappers is
                    // up to date when getWrappedApp is called
                    const content = renderContent();
                    var ref;
                    return await renderToStream(ReactDOMServer, content, suffix, (ref = serverComponentsInlinedTransformStream === null || serverComponentsInlinedTransformStream === void 0 ? void 0 : serverComponentsInlinedTransformStream.readable) !== null && ref !== void 0 ? ref : streamFromArray([]), generateStaticHTML || !hasConcurrentFeatures);
                };
            } else {
                const content = renderContent();
                // for non-concurrent rendering we need to ensure App is rendered
                // before _document so that updateHead is called/collected before
                // rendering _document's head
                const result = ReactDOMServer.renderToString(content);
                bodyResult = (suffix)=>streamFromArray([
                        result,
                        suffix
                    ])
                ;
            }
            return {
                bodyResult,
                documentElement: ()=>Document()
                ,
                head,
                headTags: [],
                styles: jsxStyleRegistry.styles()
            };
        }
    };
    const documentResult = await renderDocument();
    if (!documentResult) {
        return null;
    }
    const dynamicImportsIds = new Set();
    const dynamicImports = new Set();
    for (const mod of reactLoadableModules){
        const manifestItem = reactLoadableManifest[mod];
        if (manifestItem) {
            dynamicImportsIds.add(manifestItem.id);
            manifestItem.files.forEach((item)=>{
                dynamicImports.add(item);
            });
        }
    }
    const hybridAmp = ampState.hybrid;
    const docComponentsRendered = {
    };
    const { assetPrefix , buildId , customServer , defaultLocale , disableOptimizedLoading , domainLocales , locale , locales , runtimeConfig ,  } = renderOpts;
    const htmlProps = {
        __NEXT_DATA__: {
            props,
            page: pathname,
            query,
            buildId,
            assetPrefix: assetPrefix === '' ? undefined : assetPrefix,
            runtimeConfig,
            nextExport: nextExport === true ? true : undefined,
            autoExport: isAutoExport === true ? true : undefined,
            isFallback,
            dynamicIds: dynamicImportsIds.size === 0 ? undefined : Array.from(dynamicImportsIds),
            err: renderOpts.err ? serializeError(dev, renderOpts.err) : undefined,
            gsp: !!getStaticProps ? true : undefined,
            gssp: !!getServerSideProps ? true : undefined,
            rsc: isServerComponent ? true : undefined,
            customServer,
            gip: hasPageGetInitialProps ? true : undefined,
            appGip: !defaultAppGetInitialProps ? true : undefined,
            locale,
            locales,
            defaultLocale,
            domainLocales,
            isPreview: isPreview === true ? true : undefined,
            notFoundSrcPage: notFoundSrcPage && dev ? notFoundSrcPage : undefined
        },
        buildManifest: filteredBuildManifest,
        docComponentsRendered,
        dangerousAsPath: router.asPath,
        canonicalBase: !renderOpts.ampPath && (0, _requestMeta).getRequestMeta(req, '__nextStrippedLocale') ? `${renderOpts.canonicalBase || ''}/${renderOpts.locale}` : renderOpts.canonicalBase,
        ampPath,
        inAmpMode,
        isDevelopment: !!dev,
        hybridAmp,
        dynamicImports: Array.from(dynamicImports),
        assetPrefix,
        // Only enabled in production as development mode has features relying on HMR (style injection for example)
        unstable_runtimeJS: process.env.NODE_ENV === 'production' ? pageConfig.unstable_runtimeJS : undefined,
        unstable_JsPreload: pageConfig.unstable_JsPreload,
        devOnlyCacheBusterQueryString,
        scriptLoader,
        locale,
        disableOptimizedLoading,
        head: documentResult.head,
        headTags: documentResult.headTags,
        styles: documentResult.styles,
        useMaybeDeferContent,
        crossOrigin: renderOpts.crossOrigin,
        optimizeCss: renderOpts.optimizeCss,
        optimizeFonts: renderOpts.optimizeFonts,
        runtime
    };
    const document = /*#__PURE__*/ _react.default.createElement(_ampContext.AmpStateContext.Provider, {
        value: ampState
    }, /*#__PURE__*/ _react.default.createElement(_utils.HtmlContext.Provider, {
        value: htmlProps
    }, documentResult.documentElement(htmlProps)));
    let documentHTML;
    if (hasConcurrentFeatures) {
        const documentStream = await renderToStream(ReactDOMServer, document, null, streamFromArray([]), true);
        documentHTML = await streamToString(documentStream);
    } else {
        documentHTML = ReactDOMServer.renderToStaticMarkup(document);
    }
    if (process.env.NODE_ENV !== 'production') {
        const nonRenderedComponents = [];
        const expectedDocComponents = [
            'Main',
            'Head',
            'NextScript',
            'Html'
        ];
        for (const comp of expectedDocComponents){
            if (!docComponentsRendered[comp]) {
                nonRenderedComponents.push(comp);
            }
        }
        if (nonRenderedComponents.length) {
            const missingComponentList = nonRenderedComponents.map((e)=>`<${e} />`
            ).join(', ');
            const plural = nonRenderedComponents.length !== 1 ? 's' : '';
            console.warn(`Your custom Document (pages/_document) did not render all the required subcomponent${plural}.\n` + `Missing component${plural}: ${missingComponentList}\n` + 'Read how to fix here: https://nextjs.org/docs/messages/missing-document-component');
        }
    }
    const [renderTargetPrefix, renderTargetSuffix] = documentHTML.split('<next-js-internal-body-render-target></next-js-internal-body-render-target>');
    const prefix = [];
    if (!documentHTML.startsWith(DOCTYPE)) {
        prefix.push(DOCTYPE);
    }
    prefix.push(renderTargetPrefix);
    if (inAmpMode) {
        prefix.push('<!-- __NEXT_DATA__ -->');
    }
    let streams = [
        streamFromArray(prefix),
        await documentResult.bodyResult(renderTargetSuffix), 
    ];
    const postProcessors = (generateStaticHTML ? [
        inAmpMode ? async (html)=>{
            html = await optimizeAmp(html, renderOpts.ampOptimizerConfig);
            if (!renderOpts.ampSkipValidation && renderOpts.ampValidator) {
                await renderOpts.ampValidator(html, pathname);
            }
            return html;
        } : null,
        !process.browser && process.env.__NEXT_OPTIMIZE_FONTS ? async (html)=>{
            return await postProcess(html, {
                getFontDefinition
            }, {
                optimizeFonts: renderOpts.optimizeFonts
            });
        } : null,
        !process.browser && renderOpts.optimizeCss ? async (html)=>{
            // eslint-disable-next-line import/no-extraneous-dependencies
            const Critters = require('critters');
            const cssOptimizer = new Critters({
                ssrMode: true,
                reduceInlineStyles: false,
                path: renderOpts.distDir,
                publicPath: `${renderOpts.assetPrefix}/_next/`,
                preload: 'media',
                fonts: false,
                ...renderOpts.optimizeCss
            });
            return await cssOptimizer.process(html);
        } : null,
        inAmpMode || hybridAmp ? async (html)=>{
            return html.replace(/&amp;amp=1/g, '&amp=1');
        } : null, 
    ] : []).filter(Boolean);
    if (generateStaticHTML || postProcessors.length > 0) {
        let html = await streamToString(chainStreams(streams));
        for (const postProcessor of postProcessors){
            if (postProcessor) {
                html = await postProcessor(html);
            }
        }
        return new _renderResult.default(html);
    }
    return new _renderResult.default(chainStreams(streams));
}
function errorToJSON(err) {
    return {
        name: err.name,
        message: err.message,
        stack: err.stack,
        middleware: err.middleware
    };
}
function serializeError(dev, err) {
    if (dev) {
        return errorToJSON(err);
    }
    return {
        name: 'Internal Server Error.',
        message: '500 - Internal Server Error.',
        statusCode: 500
    };
}
function createTransformStream({ flush , transform  }) {
    const source = new TransformStream();
    const sink = new TransformStream();
    const reader = source.readable.getReader();
    const writer = sink.writable.getWriter();
    const controller = {
        enqueue (chunk) {
            writer.write(chunk);
        },
        error (reason) {
            writer.abort(reason);
            reader.cancel();
        },
        terminate () {
            writer.close();
            reader.cancel();
        },
        get desiredSize () {
            return writer.desiredSize;
        }
    };
    (async ()=>{
        try {
            while(true){
                const { done , value  } = await reader.read();
                if (done) {
                    const maybePromise = flush === null || flush === void 0 ? void 0 : flush(controller);
                    if (maybePromise) {
                        await maybePromise;
                    }
                    writer.close();
                    return;
                }
                if (transform) {
                    transform(value, controller);
                } else {
                    controller.enqueue(value);
                }
            }
        } catch (err) {
            writer.abort(err);
        }
    })();
    return {
        readable: sink.readable,
        writable: source.writable
    };
}
function createBufferedTransformStream() {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let bufferedString = '';
    let pendingFlush = null;
    const flushBuffer = (controller)=>{
        if (!pendingFlush) {
            pendingFlush = new Promise((resolve)=>{
                setTimeout(()=>{
                    controller.enqueue(encoder.encode(bufferedString));
                    bufferedString = '';
                    pendingFlush = null;
                    resolve();
                }, 0);
            });
        }
        return pendingFlush;
    };
    return createTransformStream({
        transform (chunk, controller) {
            bufferedString += decoder.decode(chunk);
            flushBuffer(controller);
        },
        flush () {
            if (pendingFlush) {
                return pendingFlush;
            }
        }
    });
}
function renderToStream(ReactDOMServer, element, suffix, dataStream, generateStaticHTML) {
    return new Promise((resolve, reject)=>{
        let resolved = false;
        const closeTagString = '</body></html>';
        const encoder = new TextEncoder();
        const suffixState = suffix ? {
            closeTag: encoder.encode(closeTagString),
            suffixUnclosed: encoder.encode(suffix.split(closeTagString)[0])
        } : null;
        const doResolve = ()=>{
            if (!resolved) {
                resolved = true;
                var ref, ref1;
                // React will call our callbacks synchronously, so we need to
                // defer to a microtask to ensure `stream` is set.
                Promise.resolve().then(()=>{
                    return resolve(pipeThrough(pipeThrough(pipeThrough(stream, createBufferedTransformStream()), createInlineDataStream(pipeThrough(dataStream, createPrefixStream((ref = suffixState === null || suffixState === void 0 ? void 0 : suffixState.suffixUnclosed) !== null && ref !== void 0 ? ref : null)))), createSuffixStream((ref1 = suffixState === null || suffixState === void 0 ? void 0 : suffixState.closeTag) !== null && ref1 !== void 0 ? ref1 : null)));
                });
            }
        };
        const stream = ReactDOMServer.renderToReadableStream(element, {
            onError (err) {
                if (!resolved) {
                    resolved = true;
                    reject(err);
                }
            },
            onCompleteShell () {
                if (!generateStaticHTML) {
                    doResolve();
                }
            },
            onCompleteAll () {
                doResolve();
            }
        });
    });
}
function createSuffixStream(suffix) {
    return createTransformStream({
        flush (controller) {
            if (suffix) {
                controller.enqueue(suffix);
            }
        }
    });
}
function createPrefixStream(prefix) {
    let prefixFlushed = false;
    return createTransformStream({
        transform (chunk, controller) {
            if (!prefixFlushed && prefix) {
                prefixFlushed = true;
                controller.enqueue(prefix);
            }
            controller.enqueue(chunk);
        },
        flush (controller) {
            if (!prefixFlushed && prefix) {
                prefixFlushed = true;
                controller.enqueue(prefix);
            }
        }
    });
}
function createInlineDataStream(dataStream) {
    let dataStreamFinished = null;
    return createTransformStream({
        transform (chunk, controller) {
            controller.enqueue(chunk);
            if (!dataStreamFinished && dataStream) {
                const dataStreamReader = dataStream.getReader();
                // We are buffering here for the inlined data stream because the
                // "shell" stream might be chunkenized again by the underlying stream
                // implementation, e.g. with a specific high-water mark. To ensure it's
                // the safe timing to pipe the data stream, this extra tick is
                // necessary.
                dataStreamFinished = new Promise((res)=>setTimeout(async ()=>{
                        try {
                            while(true){
                                const { done , value  } = await dataStreamReader.read();
                                if (done) {
                                    return res();
                                }
                                controller.enqueue(value);
                            }
                        } catch (err) {
                            controller.error(err);
                        }
                        res();
                    }, 0)
                );
            }
        },
        flush () {
            if (dataStreamFinished) {
                return dataStreamFinished;
            }
        }
    });
}
function pipeTo(readable, writable, options) {
    let resolver;
    const promise = new Promise((resolve)=>resolver = resolve
    );
    const reader = readable.getReader();
    const writer = writable.getWriter();
    function process() {
        reader.read().then(({ done , value  })=>{
            if (done) {
                if (options === null || options === void 0 ? void 0 : options.preventClose) {
                    writer.releaseLock();
                } else {
                    writer.close();
                }
                resolver();
            } else {
                writer.write(value);
                process();
            }
        });
    }
    process();
    return promise;
}
function pipeThrough(readable, transformStream) {
    pipeTo(readable, transformStream.writable);
    return transformStream.readable;
}
function chainStreams(streams) {
    const { readable , writable  } = new TransformStream();
    let promise = Promise.resolve();
    for(let i = 0; i < streams.length; ++i){
        promise = promise.then(()=>pipeTo(streams[i], writable, {
                preventClose: i + 1 < streams.length
            })
        );
    }
    return readable;
}
function streamFromArray(strings) {
    const encoder = new TextEncoder();
    const chunks = Array.from(strings.map((str)=>encoder.encode(str)
    ));
    return new ReadableStream({
        start (controller) {
            chunks.forEach((chunk)=>controller.enqueue(chunk)
            );
            controller.close();
        }
    });
}
async function streamToString(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let bufferedString = '';
    while(true){
        const { done , value  } = await reader.read();
        if (done) {
            return bufferedString;
        }
        bufferedString += decoder.decode(value);
    }
}
function useMaybeDeferContent(_name, contentFn) {
    return [
        false,
        contentFn()
    ];
}

//# sourceMappingURL=render.js.map