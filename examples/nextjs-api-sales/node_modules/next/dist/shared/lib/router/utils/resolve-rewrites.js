"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = resolveRewrites;
var _pathMatch = _interopRequireDefault(require("./path-match"));
var _prepareDestination = require("./prepare-destination");
var _normalizeTrailingSlash = require("../../../../client/normalize-trailing-slash");
var _normalizeLocalePath = require("../../i18n/normalize-locale-path");
var _parseRelativeUrl = require("./parse-relative-url");
var _router = require("../router");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const customRouteMatcher = (0, _pathMatch).default(true);
function resolveRewrites(asPath, pages, rewrites, query, resolveHref, locales) {
    let matchedPage = false;
    let externalDest = false;
    let parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
    let fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath((0, _router).delBasePath(parsedAs.pathname), locales).pathname);
    let resolvedHref;
    const handleRewrite = (rewrite)=>{
        const matcher = customRouteMatcher(rewrite.source);
        let params = matcher(parsedAs.pathname);
        if (rewrite.has && params) {
            const hasParams = (0, _prepareDestination).matchHas({
                headers: {
                    host: document.location.hostname
                },
                cookies: document.cookie.split('; ').reduce((acc, item)=>{
                    const [key, ...value] = item.split('=');
                    acc[key] = value.join('=');
                    return acc;
                }, {
                })
            }, rewrite.has, parsedAs.query);
            if (hasParams) {
                Object.assign(params, hasParams);
            } else {
                params = false;
            }
        }
        if (params) {
            if (!rewrite.destination) {
                // this is a proxied rewrite which isn't handled on the client
                externalDest = true;
                return true;
            }
            const destRes = (0, _prepareDestination).prepareDestination({
                appendParamsToQuery: true,
                destination: rewrite.destination,
                params: params,
                query: query
            });
            parsedAs = destRes.parsedDestination;
            asPath = destRes.newUrl;
            Object.assign(query, destRes.parsedDestination.query);
            fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath((0, _router).delBasePath(asPath), locales).pathname);
            if (pages.includes(fsPathname)) {
                // check if we now match a page as this means we are done
                // resolving the rewrites
                matchedPage = true;
                resolvedHref = fsPathname;
                return true;
            }
            // check if we match a dynamic-route, if so we break the rewrites chain
            resolvedHref = resolveHref(fsPathname);
            if (resolvedHref !== asPath && pages.includes(resolvedHref)) {
                matchedPage = true;
                return true;
            }
        }
    };
    let finished = false;
    for(let i = 0; i < rewrites.beforeFiles.length; i++){
        // we don't end after match in beforeFiles to allow
        // continuing through all beforeFiles rewrites
        finished = handleRewrite(rewrites.beforeFiles[i]) || false;
    }
    matchedPage = pages.includes(fsPathname);
    if (!matchedPage) {
        if (!finished) {
            for(let i = 0; i < rewrites.afterFiles.length; i++){
                if (handleRewrite(rewrites.afterFiles[i])) {
                    finished = true;
                    break;
                }
            }
        }
        // check dynamic route before processing fallback rewrites
        if (!finished) {
            resolvedHref = resolveHref(fsPathname);
            matchedPage = pages.includes(resolvedHref);
            finished = matchedPage;
        }
        if (!finished) {
            for(let i = 0; i < rewrites.fallback.length; i++){
                if (handleRewrite(rewrites.fallback[i])) {
                    finished = true;
                    break;
                }
            }
        }
    }
    return {
        asPath,
        parsedAs,
        matchedPage,
        resolvedHref,
        externalDest
    };
}

//# sourceMappingURL=resolve-rewrites.js.map