"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDomainLocale = getDomainLocale;
exports.addLocale = addLocale;
exports.delLocale = delLocale;
exports.hasBasePath = hasBasePath;
exports.addBasePath = addBasePath;
exports.delBasePath = delBasePath;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.default = void 0;
var _normalizeTrailingSlash = require("../../../client/normalize-trailing-slash");
var _routeLoader = require("../../../client/route-loader");
var _isError = _interopRequireWildcard(require("../../../lib/is-error"));
var _denormalizePagePath = require("../../../server/denormalize-page-path");
var _normalizeLocalePath = require("../i18n/normalize-locale-path");
var _mitt = _interopRequireDefault(require("../mitt"));
var _utils = require("../utils");
var _isDynamic = require("./utils/is-dynamic");
var _parseRelativeUrl = require("./utils/parse-relative-url");
var _querystring = require("./utils/querystring");
var _resolveRewrites = _interopRequireDefault(require("./utils/resolve-rewrites"));
var _routeMatcher = require("./utils/route-matcher");
var _routeRegex = require("./utils/route-regex");
var _getMiddlewareRegex = require("./utils/get-middleware-regex");
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
let detectDomainLocale;
if (process.env.__NEXT_I18N_SUPPORT) {
    detectDomainLocale = require('../i18n/detect-domain-locale').detectDomainLocale;
}
const basePath = process.env.__NEXT_ROUTER_BASEPATH || '';
function buildCancellationError() {
    return Object.assign(new Error('Route Cancelled'), {
        cancelled: true
    });
}
function addPathPrefix(path, prefix) {
    if (!path.startsWith('/') || !prefix) {
        return path;
    }
    const pathname = pathNoQueryHash(path);
    return (0, _normalizeTrailingSlash).normalizePathTrailingSlash(`${prefix}${pathname}`) + path.substr(pathname.length);
}
function getDomainLocale(path, locale, locales, domainLocales) {
    if (process.env.__NEXT_I18N_SUPPORT) {
        locale = locale || (0, _normalizeLocalePath).normalizeLocalePath(path, locales).detectedLocale;
        const detectedDomain = detectDomainLocale(domainLocales, undefined, locale);
        if (detectedDomain) {
            return `http${detectedDomain.http ? '' : 's'}://${detectedDomain.domain}${basePath || ''}${locale === detectedDomain.defaultLocale ? '' : `/${locale}`}${path}`;
        }
        return false;
    } else {
        return false;
    }
}
function addLocale(path, locale, defaultLocale) {
    if (process.env.__NEXT_I18N_SUPPORT) {
        const pathname = pathNoQueryHash(path);
        const pathLower = pathname.toLowerCase();
        const localeLower = locale && locale.toLowerCase();
        return locale && locale !== defaultLocale && !pathLower.startsWith('/' + localeLower + '/') && pathLower !== '/' + localeLower ? addPathPrefix(path, '/' + locale) : path;
    }
    return path;
}
function delLocale(path, locale) {
    if (process.env.__NEXT_I18N_SUPPORT) {
        const pathname = pathNoQueryHash(path);
        const pathLower = pathname.toLowerCase();
        const localeLower = locale && locale.toLowerCase();
        return locale && (pathLower.startsWith('/' + localeLower + '/') || pathLower === '/' + localeLower) ? (pathname.length === locale.length + 1 ? '/' : '') + path.substr(locale.length + 1) : path;
    }
    return path;
}
function pathNoQueryHash(path) {
    const queryIndex = path.indexOf('?');
    const hashIndex = path.indexOf('#');
    if (queryIndex > -1 || hashIndex > -1) {
        path = path.substring(0, queryIndex > -1 ? queryIndex : hashIndex);
    }
    return path;
}
function hasBasePath(path) {
    path = pathNoQueryHash(path);
    return path === basePath || path.startsWith(basePath + '/');
}
function addBasePath(path) {
    // we only add the basepath on relative urls
    return addPathPrefix(path, basePath);
}
function delBasePath(path) {
    path = path.slice(basePath.length);
    if (!path.startsWith('/')) path = `/${path}`;
    return path;
}
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils).getLocationOrigin();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && hasBasePath(resolved.pathname);
    } catch (_) {
        return false;
    }
}
function interpolateAs(route, asPathname, query) {
    let interpolatedRoute = '';
    const dynamicRegex = (0, _routeRegex).getRouteRegex(route);
    const dynamicGroups = dynamicRegex.groups;
    const dynamicMatches = // Try to match the dynamic route against the asPath
    (asPathname !== route ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
    // TODO: should this take priority; also need to change in the router.
    query;
    interpolatedRoute = route;
    const params = Object.keys(dynamicGroups);
    if (!params.every((param)=>{
        let value = dynamicMatches[param] || '';
        const { repeat , optional  } = dynamicGroups[param];
        // support single-level catch-all
        // TODO: more robust handling for user-error (passing `/`)
        let replaced = `[${repeat ? '...' : ''}${param}]`;
        if (optional) {
            replaced = `${!value ? '/' : ''}[${replaced}]`;
        }
        if (repeat && !Array.isArray(value)) value = [
            value
        ];
        return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
        (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// these values should be fully encoded instead of just
        // path delimiter escaped since they are being inserted
        // into the URL and we expect URL encoded segments
        // when parsing dynamic route params
        (segment)=>encodeURIComponent(segment)
        ).join('/') : encodeURIComponent(value)) || '/');
    })) {
        interpolatedRoute = '' // did not satisfy all requirements
        ;
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
    }
    return {
        params,
        result: interpolatedRoute
    };
}
function omitParmsFromQuery(query, params) {
    const filteredQuery = {
    };
    Object.keys(query).forEach((key)=>{
        if (!params.includes(key)) {
            filteredQuery[key] = query[key];
        }
    });
    return filteredQuery;
}
function resolveHref(router, href, resolveAs) {
    // we use a dummy base url for relative urls
    let base;
    let urlAsString = typeof href === 'string' ? href : (0, _utils).formatWithValidation(href);
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
    const urlAsStringNoProto = urlProtoMatch ? urlAsString.substr(urlProtoMatch[0].length) : urlAsString;
    const urlParts = urlAsStringNoProto.split('?');
    if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
        console.error(`Invalid href passed to next/router: ${urlAsString}, repeated forward-slashes (//) or backslashes \\ are not valid in the href`);
        const normalizedUrl = (0, _utils).normalizeRepeatedSlashes(urlAsStringNoProto);
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl;
    }
    // Return because it cannot be routed by the Next.js router
    if (!isLocalURL(urlAsString)) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
    try {
        base = new URL(urlAsString.startsWith('#') ? router.asPath : router.pathname, 'http://n');
    } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL('/', 'http://n');
    }
    try {
        const finalUrl = new URL(urlAsString, base);
        finalUrl.pathname = (0, _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname);
        let interpolatedAs = '';
        if ((0, _isDynamic).isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            const query = (0, _querystring).searchParamsToUrlQuery(finalUrl.searchParams);
            const { result , params  } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);
            if (result) {
                interpolatedAs = (0, _utils).formatWithValidation({
                    pathname: result,
                    hash: finalUrl.hash,
                    query: omitParmsFromQuery(query, params)
                });
            }
        }
        // if the origin didn't change, it means we received a relative href
        const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
        return resolveAs ? [
            resolvedHref,
            interpolatedAs || resolvedHref
        ] : resolvedHref;
    } catch (_1) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
}
function stripOrigin(url) {
    const origin = (0, _utils).getLocationOrigin();
    return url.startsWith(origin) ? url.substring(origin.length) : url;
}
function prepareUrlAs(router, url, as) {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    let [resolvedHref, resolvedAs] = resolveHref(router, url, true);
    const origin = (0, _utils).getLocationOrigin();
    const hrefHadOrigin = resolvedHref.startsWith(origin);
    const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
    resolvedHref = stripOrigin(resolvedHref);
    resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
    const preparedUrl = hrefHadOrigin ? resolvedHref : addBasePath(resolvedHref);
    const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
    return {
        url: preparedUrl,
        as: asHadOrigin ? preparedAs : addBasePath(preparedAs)
    };
}
function resolveDynamicRoute(pathname, pages) {
    const cleanPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _denormalizePagePath).denormalizePagePath(pathname));
    if (cleanPathname === '/404' || cleanPathname === '/_error') {
        return pathname;
    }
    // handle resolving href for dynamic routes
    if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some((page)=>{
            if ((0, _isDynamic).isDynamicRoute(page) && (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)) {
                pathname = page;
                return true;
            }
        });
    }
    return (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
}
const manualScrollRestoration = process.env.__NEXT_SCROLL_RESTORATION && typeof window !== 'undefined' && 'scrollRestoration' in window.history && !!function() {
    try {
        let v = '__next';
        // eslint-disable-next-line no-sequences
        return sessionStorage.setItem(v, v), sessionStorage.removeItem(v), true;
    } catch (n) {
    }
}();
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');
function fetchRetry(url, attempts, opts) {
    return fetch(url, {
        // Cookies are required to be present for Next.js' SSG "Preview Mode".
        // Cookies may also be required for `getServerSideProps`.
        //
        // > `fetch` won’t send cookies, unless you set the credentials init
        // > option.
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        //
        // > For maximum browser compatibility when it comes to sending &
        // > receiving cookies, always supply the `credentials: 'same-origin'`
        // > option instead of relying on the default.
        // https://github.com/github/fetch#caveats
        credentials: 'same-origin'
    }).then((res)=>{
        if (!res.ok) {
            if (attempts > 1 && res.status >= 500) {
                return fetchRetry(url, attempts - 1, opts);
            }
            if (res.status === 404) {
                return res.json().then((data)=>{
                    if (data.notFound) {
                        return {
                            notFound: SSG_DATA_NOT_FOUND
                        };
                    }
                    throw new Error(`Failed to load static props`);
                });
            }
            throw new Error(`Failed to load static props`);
        }
        return opts.text ? res.text() : res.json();
    });
}
function fetchNextData(dataHref, isServerRender, text, inflightCache, persistCache) {
    const { href: cacheKey  } = new URL(dataHref, window.location.href);
    if (inflightCache[cacheKey] !== undefined) {
        return inflightCache[cacheKey];
    }
    return inflightCache[cacheKey] = fetchRetry(dataHref, isServerRender ? 3 : 1, {
        text
    }).catch((err)=>{
        // We should only trigger a server-side transition if this was caused
        // on a client-side transition. Otherwise, we'd get into an infinite
        // loop.
        if (!isServerRender) {
            (0, _routeLoader).markAssetError(err);
        }
        throw err;
    }).then((data)=>{
        if (!persistCache || process.env.NODE_ENV !== 'production') {
            delete inflightCache[cacheKey];
        }
        return data;
    }).catch((err)=>{
        delete inflightCache[cacheKey];
        throw err;
    });
}
class Router {
    constructor(pathname, query, as, { initialProps , pageLoader , App , wrapApp , Component , err , subscription , isFallback , locale , locales , defaultLocale , domainLocales , isPreview  }){
        // Static Data Cache
        this.sdc = {
        };
        // In-flight Server Data Requests, for deduping
        this.sdr = {
        };
        // In-flight middleware preflight requests
        this.sde = {
        };
        this._idx = 0;
        this.onPopState = (e)=>{
            const state = e.state;
            if (!state) {
                // We get state as undefined for two reasons.
                //  1. With older safari (< 8) and older chrome (< 34)
                //  2. When the URL changed with #
                //
                // In the both cases, we don't need to proceed and change the route.
                // (as it's already changed)
                // But we can simply replace the state with the new changes.
                // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                // So, doing the following for (1) does no harm.
                const { pathname , query  } = this;
                this.changeState('replaceState', (0, _utils).formatWithValidation({
                    pathname: addBasePath(pathname),
                    query
                }), (0, _utils).getURL());
                return;
            }
            if (!state.__N) {
                return;
            }
            let forcedScroll;
            const { url , as , options , idx  } = state;
            if (process.env.__NEXT_SCROLL_RESTORATION) {
                if (manualScrollRestoration) {
                    if (this._idx !== idx) {
                        // Snapshot current scroll position:
                        try {
                            sessionStorage.setItem('__next_scroll_' + this._idx, JSON.stringify({
                                x: self.pageXOffset,
                                y: self.pageYOffset
                            }));
                        } catch  {
                        }
                        // Restore old scroll position:
                        try {
                            const v = sessionStorage.getItem('__next_scroll_' + idx);
                            forcedScroll = JSON.parse(v);
                        } catch  {
                            forcedScroll = {
                                x: 0,
                                y: 0
                            };
                        }
                    }
                }
            }
            this._idx = idx;
            const { pathname  } = (0, _parseRelativeUrl).parseRelativeUrl(url);
            // Make sure we don't re-render on initial load,
            // can be caused by navigating back from an external site
            if (this.isSsr && as === addBasePath(this.asPath) && pathname === addBasePath(this.pathname)) {
                return;
            }
            // If the downstream application returns falsy, return.
            // They will then be responsible for handling the event.
            if (this._bps && !this._bps(state)) {
                return;
            }
            this.change('replaceState', url, as, Object.assign({
            }, options, {
                shallow: options.shallow && this._shallow,
                locale: options.locale || this.defaultLocale
            }), forcedScroll);
        };
        // represents the current component key
        const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
        // set up the component cache (by route keys)
        this.components = {
        };
        // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.
        if (pathname !== '/_error') {
            var ref;
            this.components[route] = {
                Component,
                initial: true,
                props: initialProps,
                err,
                __N_SSG: initialProps && initialProps.__N_SSG,
                __N_SSP: initialProps && initialProps.__N_SSP,
                __N_RSC: !!((ref = Component) === null || ref === void 0 ? void 0 : ref.__next_rsc__)
            };
        }
        this.components['/_app'] = {
            Component: App,
            styleSheets: []
        };
        // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented
        this.events = Router.events;
        this.pageLoader = pageLoader;
        // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch
        const autoExportDynamic = (0, _isDynamic).isDynamicRoute(pathname) && self.__NEXT_DATA__.autoExport;
        this.basePath = basePath;
        this.sub = subscription;
        this.clc = null;
        this._wrapApp = wrapApp;
        // make sure to ignore extra popState in safari on navigating
        // back from external site
        this.isSsr = true;
        this.isLocaleDomain = false;
        this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !process.env.__NEXT_HAS_REWRITES);
        if (process.env.__NEXT_I18N_SUPPORT) {
            this.locales = locales;
            this.defaultLocale = defaultLocale;
            this.domainLocales = domainLocales;
            this.isLocaleDomain = !!detectDomainLocale(domainLocales, self.location.hostname);
        }
        this.state = {
            route,
            pathname,
            query,
            asPath: autoExportDynamic ? pathname : as,
            isPreview: !!isPreview,
            locale: process.env.__NEXT_I18N_SUPPORT ? locale : undefined,
            isFallback
        };
        if (typeof window !== 'undefined') {
            // make sure "as" doesn't start with double slashes or else it can
            // throw an error as it's considered invalid
            if (as.substr(0, 2) !== '//') {
                // in order for `e.state` to work on the `onpopstate` event
                // we have to register the initial route upon initialization
                const options = {
                    locale
                };
                options._shouldResolveHref = as !== pathname;
                this.changeState('replaceState', (0, _utils).formatWithValidation({
                    pathname: addBasePath(pathname),
                    query
                }), (0, _utils).getURL(), options);
            }
            window.addEventListener('popstate', this.onPopState);
            // enable custom scroll restoration handling when available
            // otherwise fallback to browser's default handling
            if (process.env.__NEXT_SCROLL_RESTORATION) {
                if (manualScrollRestoration) {
                    window.history.scrollRestoration = 'manual';
                }
            }
        }
    }
    reload() {
        window.location.reload();
    }
    /**
   * Go back in history
   */ back() {
        window.history.back();
    }
    /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ push(url, as, options = {
    }) {
        if (process.env.__NEXT_SCROLL_RESTORATION) {
            // TODO: remove in the future when we update history before route change
            // is complete, as the popstate event should handle this capture.
            if (manualScrollRestoration) {
                try {
                    // Snapshot scroll position right before navigating to a new page:
                    sessionStorage.setItem('__next_scroll_' + this._idx, JSON.stringify({
                        x: self.pageXOffset,
                        y: self.pageYOffset
                    }));
                } catch  {
                }
            }
        }
        ({ url , as  } = prepareUrlAs(this, url, as));
        return this.change('pushState', url, as, options);
    }
    /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ replace(url, as, options = {
    }) {
        ({ url , as  } = prepareUrlAs(this, url, as));
        return this.change('replaceState', url, as, options);
    }
    async change(method, url, as, options, forcedScroll) {
        if (!isLocalURL(url)) {
            window.location.href = url;
            return false;
        }
        const shouldResolveHref = options._h || options._shouldResolveHref || pathNoQueryHash(url) === pathNoQueryHash(as);
        const nextState = {
            ...this.state
        };
        // for static pages with query params in the URL we delay
        // marking the router ready until after the query is updated
        if (options._h) {
            this.isReady = true;
        }
        const prevLocale = nextState.locale;
        if (process.env.__NEXT_I18N_SUPPORT) {
            nextState.locale = options.locale === false ? this.defaultLocale : options.locale || nextState.locale;
            if (typeof options.locale === 'undefined') {
                options.locale = nextState.locale;
            }
            const parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(hasBasePath(as) ? delBasePath(as) : as);
            const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(parsedAs.pathname, this.locales);
            if (localePathResult.detectedLocale) {
                nextState.locale = localePathResult.detectedLocale;
                parsedAs.pathname = addBasePath(parsedAs.pathname);
                as = (0, _utils).formatWithValidation(parsedAs);
                url = addBasePath((0, _normalizeLocalePath).normalizeLocalePath(hasBasePath(url) ? delBasePath(url) : url, this.locales).pathname);
            }
            let didNavigate = false;
            // we need to wrap this in the env check again since regenerator runtime
            // moves this on its own due to the return
            if (process.env.__NEXT_I18N_SUPPORT) {
                var ref;
                // if the locale isn't configured hard navigate to show 404 page
                if (!((ref = this.locales) === null || ref === void 0 ? void 0 : ref.includes(nextState.locale))) {
                    parsedAs.pathname = addLocale(parsedAs.pathname, nextState.locale);
                    window.location.href = (0, _utils).formatWithValidation(parsedAs);
                    // this was previously a return but was removed in favor
                    // of better dead code elimination with regenerator runtime
                    didNavigate = true;
                }
            }
            const detectedDomain = detectDomainLocale(this.domainLocales, undefined, nextState.locale);
            // we need to wrap this in the env check again since regenerator runtime
            // moves this on its own due to the return
            if (process.env.__NEXT_I18N_SUPPORT) {
                // if we are navigating to a domain locale ensure we redirect to the
                // correct domain
                if (!didNavigate && detectedDomain && this.isLocaleDomain && self.location.hostname !== detectedDomain.domain) {
                    const asNoBasePath = delBasePath(as);
                    window.location.href = `http${detectedDomain.http ? '' : 's'}://${detectedDomain.domain}${addBasePath(`${nextState.locale === detectedDomain.defaultLocale ? '' : `/${nextState.locale}`}${asNoBasePath === '/' ? '' : asNoBasePath}` || '/')}`;
                    // this was previously a return but was removed in favor
                    // of better dead code elimination with regenerator runtime
                    didNavigate = true;
                }
            }
            if (didNavigate) {
                return new Promise(()=>{
                });
            }
        }
        if (!options._h) {
            this.isSsr = false;
        }
        // marking route changes as a navigation start entry
        if (_utils.ST) {
            performance.mark('routeChange');
        }
        const { shallow =false , scroll =true  } = options;
        const routeProps = {
            shallow
        };
        if (this._inFlightRoute) {
            this.abortComponentLoad(this._inFlightRoute, routeProps);
        }
        as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, this.defaultLocale));
        const cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, nextState.locale);
        this._inFlightRoute = as;
        let localeChange = prevLocale !== nextState.locale;
        // If the url change is only related to a hash change
        // We should not proceed. We should only change the state.
        // WARNING: `_h` is an internal option for handing Next.js client-side
        // hydration. Your app should _never_ use this property. It may change at
        // any time without notice.
        if (!options._h && this.onlyAHashChange(cleanedAs) && !localeChange) {
            nextState.asPath = cleanedAs;
            Router.events.emit('hashChangeStart', as, routeProps);
            // TODO: do we need the resolved href when only a hash change?
            this.changeState(method, url, as, {
                ...options,
                scroll: false
            });
            if (scroll) {
                this.scrollToHash(cleanedAs);
            }
            this.set(nextState, this.components[nextState.route], null);
            Router.events.emit('hashChangeComplete', as, routeProps);
            return true;
        }
        let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
        let { pathname , query  } = parsed;
        // The build manifest needs to be loaded before auto-static dynamic pages
        // get their query parameters to allow ensuring they can be parsed properly
        // when rewritten to
        let pages, rewrites;
        try {
            [pages, { __rewrites: rewrites  }] = await Promise.all([
                this.pageLoader.getPageList(),
                (0, _routeLoader).getClientBuildManifest(),
                this.pageLoader.getMiddlewareList(), 
            ]);
        } catch (err) {
            // If we fail to resolve the page list or client-build manifest, we must
            // do a server-side transition:
            window.location.href = as;
            return false;
        }
        // If asked to change the current URL we should reload the current page
        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
        // We also need to set the method = replaceState always
        // as this should not go into the history (That's how browsers work)
        // We should compare the new asPath to the current asPath, not the url
        if (!this.urlIsNew(cleanedAs) && !localeChange) {
            method = 'replaceState';
        }
        // we need to resolve the as value using rewrites for dynamic SSG
        // pages to allow building the data URL correctly
        let resolvedAs = as;
        // url and as should always be prefixed with basePath by this
        // point by either next/link or router.push/replace so strip the
        // basePath from the pathname to match the pages dir 1-to-1
        pathname = pathname ? (0, _normalizeTrailingSlash).removePathTrailingSlash(delBasePath(pathname)) : pathname;
        if (shouldResolveHref && pathname !== '/_error') {
            options._shouldResolveHref = true;
            if (process.env.__NEXT_HAS_REWRITES && as.startsWith('/')) {
                const rewritesResult = (0, _resolveRewrites).default(addBasePath(addLocale(cleanedAs, nextState.locale)), pages, rewrites, query, (p)=>resolveDynamicRoute(p, pages)
                , this.locales);
                if (rewritesResult.externalDest) {
                    location.href = as;
                    return true;
                }
                resolvedAs = rewritesResult.asPath;
                if (rewritesResult.matchedPage && rewritesResult.resolvedHref) {
                    // if this directly matches a page we need to update the href to
                    // allow the correct page chunk to be loaded
                    pathname = rewritesResult.resolvedHref;
                    parsed.pathname = addBasePath(pathname);
                    url = (0, _utils).formatWithValidation(parsed);
                }
            } else {
                parsed.pathname = resolveDynamicRoute(pathname, pages);
                if (parsed.pathname !== pathname) {
                    pathname = parsed.pathname;
                    parsed.pathname = addBasePath(pathname);
                    url = (0, _utils).formatWithValidation(parsed);
                }
            }
        }
        if (!isLocalURL(as)) {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error(`Invalid href: "${url}" and as: "${as}", received relative href and external as` + `\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as`);
            }
            window.location.href = as;
            return false;
        }
        resolvedAs = delLocale(delBasePath(resolvedAs), nextState.locale);
        /**
     * If the route update was triggered for client-side hydration and
     * the rendered route is not dynamic do not check the preflight
     * request as it is not necessary.
     */ if (options._h !== 1 || (0, _isDynamic).isDynamicRoute((0, _normalizeTrailingSlash).removePathTrailingSlash(pathname))) {
            const effect = await this._preflightRequest({
                as,
                cache: process.env.NODE_ENV === 'production',
                pages,
                pathname,
                query,
                locale: nextState.locale,
                isPreview: nextState.isPreview
            });
            if (effect.type === 'rewrite') {
                query = {
                    ...query,
                    ...effect.parsedAs.query
                };
                resolvedAs = effect.asPath;
                pathname = effect.resolvedHref;
                parsed.pathname = effect.resolvedHref;
                url = (0, _utils).formatWithValidation(parsed);
            } else if (effect.type === 'redirect' && effect.newAs) {
                return this.change(method, effect.newUrl, effect.newAs, options);
            } else if (effect.type === 'redirect' && effect.destination) {
                window.location.href = effect.destination;
                return new Promise(()=>{
                });
            } else if (effect.type === 'refresh' && as !== window.location.pathname) {
                window.location.href = as;
                return new Promise(()=>{
                });
            }
        }
        const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
        if ((0, _isDynamic).isDynamicRoute(route)) {
            const parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs);
            const asPathname = parsedAs.pathname;
            const routeRegex = (0, _routeRegex).getRouteRegex(route);
            const routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(asPathname);
            const shouldInterpolate = route === asPathname;
            const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {
            };
            if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param]
                );
                if (missingParams.length > 0) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.warn(`${shouldInterpolate ? `Interpolating href` : `Mismatching \`as\` and \`href\``} failed to manually provide ` + `the params: ${missingParams.join(', ')} in the \`href\`'s \`query\``);
                    }
                    throw new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(', ')}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'}`);
                }
            } else if (shouldInterpolate) {
                as = (0, _utils).formatWithValidation(Object.assign({
                }, parsedAs, {
                    pathname: interpolatedAs.result,
                    query: omitParmsFromQuery(query, interpolatedAs.params)
                }));
            } else {
                // Merge params into `query`, overwriting any specified in search
                Object.assign(query, routeMatch);
            }
        }
        Router.events.emit('routeChangeStart', as, routeProps);
        try {
            var ref, ref1;
            let routeInfo = await this.getRouteInfo(route, pathname, query, as, resolvedAs, routeProps, nextState.locale, nextState.isPreview);
            let { error , props , __N_SSG , __N_SSP  } = routeInfo;
            // handle redirect on client-transition
            if ((__N_SSG || __N_SSP) && props) {
                if (props.pageProps && props.pageProps.__N_REDIRECT) {
                    const destination = props.pageProps.__N_REDIRECT;
                    // check if destination is internal (resolves to a page) and attempt
                    // client-navigation if it is falling back to hard navigation if
                    // it's not
                    if (destination.startsWith('/') && props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                        const parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(destination);
                        parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                        const { url: newUrl , as: newAs  } = prepareUrlAs(this, destination, destination);
                        return this.change(method, newUrl, newAs, options);
                    }
                    window.location.href = destination;
                    return new Promise(()=>{
                    });
                }
                nextState.isPreview = !!props.__N_PREVIEW;
                // handle SSG data 404
                if (props.notFound === SSG_DATA_NOT_FOUND) {
                    let notFoundRoute;
                    try {
                        await this.fetchComponent('/404');
                        notFoundRoute = '/404';
                    } catch (_) {
                        notFoundRoute = '/_error';
                    }
                    routeInfo = await this.getRouteInfo(notFoundRoute, notFoundRoute, query, as, resolvedAs, {
                        shallow: false
                    }, nextState.locale, nextState.isPreview);
                }
            }
            Router.events.emit('beforeHistoryChange', as, routeProps);
            this.changeState(method, url, as, options);
            if (options._h && pathname === '/_error' && ((ref = self.__NEXT_DATA__.props) === null || ref === void 0 ? void 0 : (ref1 = ref.pageProps) === null || ref1 === void 0 ? void 0 : ref1.statusCode) === 500 && (props === null || props === void 0 ? void 0 : props.pageProps)) {
                // ensure statusCode is still correct for static 500 page
                // when updating query information
                props.pageProps.statusCode = 500;
            }
            // shallow routing is only allowed for same page URL changes.
            const isValidShallowRoute = options.shallow && nextState.route === route;
            var _scroll;
            const shouldScroll = (_scroll = options.scroll) !== null && _scroll !== void 0 ? _scroll : !isValidShallowRoute;
            const resetScroll = shouldScroll ? {
                x: 0,
                y: 0
            } : null;
            await this.set({
                ...nextState,
                route,
                pathname,
                query,
                asPath: cleanedAs,
                isFallback: false
            }, routeInfo, forcedScroll !== null && forcedScroll !== void 0 ? forcedScroll : resetScroll).catch((e)=>{
                if (e.cancelled) error = error || e;
                else throw e;
            });
            if (error) {
                Router.events.emit('routeChangeError', error, cleanedAs, routeProps);
                throw error;
            }
            if (process.env.__NEXT_I18N_SUPPORT) {
                if (nextState.locale) {
                    document.documentElement.lang = nextState.locale;
                }
            }
            Router.events.emit('routeChangeComplete', as, routeProps);
            return true;
        } catch (err1) {
            if ((0, _isError).default(err1) && err1.cancelled) {
                return false;
            }
            throw err1;
        }
    }
    changeState(method, url, as, options = {
    }) {
        if (process.env.NODE_ENV !== 'production') {
            if (typeof window.history === 'undefined') {
                console.error(`Warning: window.history is not available.`);
                return;
            }
            if (typeof window.history[method] === 'undefined') {
                console.error(`Warning: window.history.${method} is not available`);
                return;
            }
        }
        if (method !== 'pushState' || (0, _utils).getURL() !== as) {
            this._shallow = options.shallow;
            window.history[method]({
                url,
                as,
                options,
                __N: true,
                idx: this._idx = method !== 'pushState' ? this._idx : this._idx + 1
            }, // Most browsers currently ignores this parameter, although they may use it in the future.
            // Passing the empty string here should be safe against future changes to the method.
            // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
            '', as);
        }
    }
    async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
        if (err.cancelled) {
            // bubble up cancellation errors
            throw err;
        }
        if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
            Router.events.emit('routeChangeError', err, as, routeProps);
            // If we can't load the page it could be one of following reasons
            //  1. Page doesn't exists
            //  2. Page does exist in a different zone
            //  3. Internal error while loading the page
            // So, doing a hard reload is the proper way to deal with this.
            window.location.href = as;
            // Changing the URL doesn't block executing the current code path.
            // So let's throw a cancellation error stop the routing logic.
            throw buildCancellationError();
        }
        try {
            let Component;
            let styleSheets;
            let props;
            if (typeof Component === 'undefined' || typeof styleSheets === 'undefined') {
                ({ page: Component , styleSheets  } = await this.fetchComponent('/_error'));
            }
            const routeInfo = {
                props,
                Component,
                styleSheets,
                err,
                error: err
            };
            if (!routeInfo.props) {
                try {
                    routeInfo.props = await this.getInitialProps(Component, {
                        err,
                        pathname,
                        query
                    });
                } catch (gipErr) {
                    console.error('Error in error page `getInitialProps`: ', gipErr);
                    routeInfo.props = {
                    };
                }
            }
            return routeInfo;
        } catch (routeInfoErr) {
            return this.handleRouteInfoError((0, _isError).default(routeInfoErr) ? routeInfoErr : new Error(routeInfoErr + ''), pathname, query, as, routeProps, true);
        }
    }
    async getRouteInfo(route, pathname, query, as, resolvedAs, routeProps, locale, isPreview) {
        try {
            const existingRouteInfo = this.components[route];
            if (routeProps.shallow && existingRouteInfo && this.route === route) {
                return existingRouteInfo;
            }
            let cachedRouteInfo = undefined;
            // can only use non-initial route info
            // cannot reuse route info in development since it can change after HMR
            if (process.env.NODE_ENV !== 'development' && existingRouteInfo && !('initial' in existingRouteInfo)) {
                cachedRouteInfo = existingRouteInfo;
            }
            const routeInfo = cachedRouteInfo || await this.fetchComponent(route).then((res)=>({
                    Component: res.page,
                    styleSheets: res.styleSheets,
                    __N_SSG: res.mod.__N_SSG,
                    __N_SSP: res.mod.__N_SSP,
                    __N_RSC: !!res.page.__next_rsc__
                })
            );
            const { Component , __N_SSG , __N_SSP , __N_RSC  } = routeInfo;
            if (process.env.NODE_ENV !== 'production') {
                const { isValidElementType  } = require('next/dist/compiled/react-is');
                if (!isValidElementType(Component)) {
                    throw new Error(`The default export is not a React Component in page: "${pathname}"`);
                }
            }
            let dataHref;
            if (__N_SSG || __N_SSP || __N_RSC) {
                dataHref = this.pageLoader.getDataHref({
                    href: (0, _utils).formatWithValidation({
                        pathname,
                        query
                    }),
                    asPath: resolvedAs,
                    ssg: __N_SSG,
                    rsc: __N_RSC,
                    locale
                });
            }
            const props = await this._getData(()=>__N_SSG || __N_SSP ? fetchNextData(dataHref, this.isSsr, false, __N_SSG ? this.sdc : this.sdr, !!__N_SSG && !isPreview) : this.getInitialProps(Component, // we provide AppTree later so this needs to be `any`
                {
                    pathname,
                    query,
                    asPath: as,
                    locale,
                    locales: this.locales,
                    defaultLocale: this.defaultLocale
                })
            );
            if (__N_RSC) {
                const { fresh , data  } = await this._getData(()=>this._getFlightData(dataHref)
                );
                props.pageProps = Object.assign(props.pageProps, {
                    __flight_serialized__: data,
                    __flight_fresh__: fresh
                });
            }
            routeInfo.props = props;
            this.components[route] = routeInfo;
            return routeInfo;
        } catch (err) {
            return this.handleRouteInfoError((0, _isError).getProperError(err), pathname, query, as, routeProps);
        }
    }
    set(state, data, resetScroll) {
        this.state = state;
        return this.sub(data, this.components['/_app'].Component, resetScroll);
    }
    /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ beforePopState(cb) {
        this._bps = cb;
    }
    onlyAHashChange(as) {
        if (!this.asPath) return false;
        const [oldUrlNoHash, oldHash] = this.asPath.split('#');
        const [newUrlNoHash, newHash] = as.split('#');
        // Makes sure we scroll to the provided hash if the url/hash are the same
        if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
            return true;
        }
        // If the urls are change, there's more than a hash change
        if (oldUrlNoHash !== newUrlNoHash) {
            return false;
        }
        // If the hash has changed, then it's a hash only change.
        // This check is necessary to handle both the enter and
        // leave hash === '' cases. The identity case falls through
        // and is treated as a next reload.
        return oldHash !== newHash;
    }
    scrollToHash(as) {
        const [, hash = ''] = as.split('#');
        // Scroll to top if the hash is just `#` with no value or `#top`
        // To mirror browsers
        if (hash === '' || hash === 'top') {
            window.scrollTo(0, 0);
            return;
        }
        // First we check if the element by id is found
        const idEl = document.getElementById(hash);
        if (idEl) {
            idEl.scrollIntoView();
            return;
        }
        // If there's no element with the id, we check the `name` property
        // To mirror browsers
        const nameEl = document.getElementsByName(hash)[0];
        if (nameEl) {
            nameEl.scrollIntoView();
        }
    }
    urlIsNew(asPath) {
        return this.asPath !== asPath;
    }
    /**
   * Prefetch page code, you may wait for the data during page rendering.
   * This feature only works in production!
   * @param url the href of prefetched page
   * @param asPath the as path of the prefetched page
   */ async prefetch(url, asPath = url, options = {
    }) {
        let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
        let { pathname , query  } = parsed;
        if (process.env.__NEXT_I18N_SUPPORT) {
            if (options.locale === false) {
                pathname = (0, _normalizeLocalePath).normalizeLocalePath(pathname, this.locales).pathname;
                parsed.pathname = pathname;
                url = (0, _utils).formatWithValidation(parsed);
                let parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
                const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(parsedAs.pathname, this.locales);
                parsedAs.pathname = localePathResult.pathname;
                options.locale = localePathResult.detectedLocale || this.defaultLocale;
                asPath = (0, _utils).formatWithValidation(parsedAs);
            }
        }
        const pages = await this.pageLoader.getPageList();
        let resolvedAs = asPath;
        if (process.env.__NEXT_HAS_REWRITES && asPath.startsWith('/')) {
            let rewrites;
            ({ __rewrites: rewrites  } = await (0, _routeLoader).getClientBuildManifest());
            const rewritesResult = (0, _resolveRewrites).default(addBasePath(addLocale(asPath, this.locale)), pages, rewrites, parsed.query, (p)=>resolveDynamicRoute(p, pages)
            , this.locales);
            if (rewritesResult.externalDest) {
                return;
            }
            resolvedAs = delLocale(delBasePath(rewritesResult.asPath), this.locale);
            if (rewritesResult.matchedPage && rewritesResult.resolvedHref) {
                // if this directly matches a page we need to update the href to
                // allow the correct page chunk to be loaded
                pathname = rewritesResult.resolvedHref;
                parsed.pathname = pathname;
                url = (0, _utils).formatWithValidation(parsed);
            }
        } else {
            parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);
            if (parsed.pathname !== pathname) {
                pathname = parsed.pathname;
                parsed.pathname = pathname;
                url = (0, _utils).formatWithValidation(parsed);
            }
        }
        // Prefetch is not supported in development mode because it would trigger on-demand-entries
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        const effects = await this._preflightRequest({
            as: addBasePath(asPath),
            cache: true,
            pages,
            pathname,
            query,
            locale: this.locale,
            isPreview: this.isPreview
        });
        if (effects.type === 'rewrite') {
            parsed.pathname = effects.resolvedHref;
            pathname = effects.resolvedHref;
            query = {
                ...query,
                ...effects.parsedAs.query
            };
            resolvedAs = effects.asPath;
            url = (0, _utils).formatWithValidation(parsed);
        }
        const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
        await Promise.all([
            this.pageLoader._isSsg(route).then((isSsg)=>{
                return isSsg ? fetchNextData(this.pageLoader.getDataHref({
                    href: url,
                    asPath: resolvedAs,
                    ssg: true,
                    locale: typeof options.locale !== 'undefined' ? options.locale : this.locale
                }), false, false, this.sdc, true) : false;
            }),
            this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route), 
        ]);
    }
    async fetchComponent(route) {
        let cancelled = false;
        const cancel = this.clc = ()=>{
            cancelled = true;
        };
        const handleCancelled = ()=>{
            if (cancelled) {
                const error = new Error(`Abort fetching component for route: "${route}"`);
                error.cancelled = true;
                throw error;
            }
            if (cancel === this.clc) {
                this.clc = null;
            }
        };
        try {
            const componentResult = await this.pageLoader.loadPage(route);
            handleCancelled();
            return componentResult;
        } catch (err) {
            handleCancelled();
            throw err;
        }
    }
    _getData(fn) {
        let cancelled = false;
        const cancel = ()=>{
            cancelled = true;
        };
        this.clc = cancel;
        return fn().then((data)=>{
            if (cancel === this.clc) {
                this.clc = null;
            }
            if (cancelled) {
                const err = new Error('Loading initial props cancelled');
                err.cancelled = true;
                throw err;
            }
            return data;
        });
    }
    _getFlightData(dataHref) {
        // Do not cache RSC flight response since it's not a static resource
        return fetchNextData(dataHref, true, true, this.sdc, false).then((serialized)=>{
            return {
                fresh: true,
                data: serialized
            };
        });
    }
    async _preflightRequest(options) {
        const cleanedAs = delLocale(hasBasePath(options.as) ? delBasePath(options.as) : options.as, options.locale);
        const fns = await this.pageLoader.getMiddlewareList();
        const requiresPreflight = fns.some(([middleware, isSSR])=>{
            return (0, _routeMatcher).getRouteMatcher((0, _getMiddlewareRegex).getMiddlewareRegex(middleware, !isSSR))(cleanedAs);
        });
        if (!requiresPreflight) {
            return {
                type: 'next'
            };
        }
        const preflight = await this._getPreflightData({
            preflightHref: options.as,
            shouldCache: options.cache,
            isPreview: options.isPreview
        });
        if (preflight.rewrite) {
            // for external rewrites we need to do a hard navigation
            // to the resource
            if (!preflight.rewrite.startsWith('/')) {
                return {
                    type: 'redirect',
                    destination: options.as
                };
            }
            const parsed = (0, _parseRelativeUrl).parseRelativeUrl((0, _normalizeLocalePath).normalizeLocalePath(hasBasePath(preflight.rewrite) ? delBasePath(preflight.rewrite) : preflight.rewrite, this.locales).pathname);
            const fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash(parsed.pathname);
            let matchedPage;
            let resolvedHref;
            if (options.pages.includes(fsPathname)) {
                matchedPage = true;
                resolvedHref = fsPathname;
            } else {
                resolvedHref = resolveDynamicRoute(fsPathname, options.pages);
                if (resolvedHref !== parsed.pathname && options.pages.includes(resolvedHref)) {
                    matchedPage = true;
                }
            }
            return {
                type: 'rewrite',
                asPath: parsed.pathname,
                parsedAs: parsed,
                matchedPage,
                resolvedHref
            };
        }
        if (preflight.redirect) {
            if (preflight.redirect.startsWith('/')) {
                const cleanRedirect = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath(hasBasePath(preflight.redirect) ? delBasePath(preflight.redirect) : preflight.redirect, this.locales).pathname);
                const { url: newUrl , as: newAs  } = prepareUrlAs(this, cleanRedirect, cleanRedirect);
                return {
                    type: 'redirect',
                    newUrl,
                    newAs
                };
            }
            return {
                type: 'redirect',
                destination: preflight.redirect
            };
        }
        // For SSR requests, they will be handled like normal pages.
        if (preflight.refresh && !preflight.ssr) {
            return {
                type: 'refresh'
            };
        }
        return {
            type: 'next'
        };
    }
    _getPreflightData(params) {
        const { preflightHref , shouldCache =false , isPreview  } = params;
        const { href: cacheKey  } = new URL(preflightHref, window.location.href);
        if (process.env.NODE_ENV === 'production' && !isPreview && shouldCache && this.sde[cacheKey]) {
            return Promise.resolve(this.sde[cacheKey]);
        }
        return fetch(preflightHref, {
            method: 'HEAD',
            credentials: 'same-origin',
            headers: {
                'x-middleware-preflight': '1'
            }
        }).then((res)=>{
            if (!res.ok) {
                throw new Error(`Failed to preflight request`);
            }
            return {
                cache: res.headers.get('x-middleware-cache'),
                redirect: res.headers.get('Location'),
                refresh: res.headers.has('x-middleware-refresh'),
                rewrite: res.headers.get('x-middleware-rewrite'),
                ssr: !!res.headers.get('x-middleware-ssr')
            };
        }).then((data)=>{
            if (shouldCache && data.cache !== 'no-cache') {
                this.sde[cacheKey] = data;
            }
            return data;
        }).catch((err)=>{
            delete this.sde[cacheKey];
            throw err;
        });
    }
    getInitialProps(Component, ctx) {
        const { Component: App  } = this.components['/_app'];
        const AppTree = this._wrapApp(App);
        ctx.AppTree = AppTree;
        return (0, _utils).loadGetInitialProps(App, {
            AppTree,
            Component,
            router: this,
            ctx
        });
    }
    abortComponentLoad(as, routeProps) {
        if (this.clc) {
            Router.events.emit('routeChangeError', buildCancellationError(), as, routeProps);
            this.clc();
            this.clc = null;
        }
    }
    get route() {
        return this.state.route;
    }
    get pathname() {
        return this.state.pathname;
    }
    get query() {
        return this.state.query;
    }
    get asPath() {
        return this.state.asPath;
    }
    get locale() {
        return this.state.locale;
    }
    get isFallback() {
        return this.state.isFallback;
    }
    get isPreview() {
        return this.state.isPreview;
    }
}
Router.events = (0, _mitt).default();
exports.default = Router;

//# sourceMappingURL=router.js.map