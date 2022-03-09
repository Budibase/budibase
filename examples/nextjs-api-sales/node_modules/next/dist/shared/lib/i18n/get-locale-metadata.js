"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLocaleMetadata = getLocaleMetadata;
var _acceptHeader = require("../../../server/accept-header");
var _denormalizePagePath = require("../../../server/denormalize-page-path");
var _detectDomainLocale = require("./detect-domain-locale");
var _formatUrl = require("../router/utils/format-url");
var _normalizeLocalePath = require("./normalize-locale-path");
function getLocaleMetadata(params) {
    const { i18n  } = params.nextConfig;
    const { cookies , headers , nextConfig , url  } = params;
    const path = (0, _normalizeLocalePath).normalizeLocalePath(url.pathname, i18n.locales);
    const domain = (0, _detectDomainLocale).detectDomainLocale(i18n.domains, getHostname(url, headers));
    const defaultLocale = (domain === null || domain === void 0 ? void 0 : domain.defaultLocale) || i18n.defaultLocale;
    const preferredLocale = getAcceptPreferredLocale(i18n, headers);
    return {
        path,
        domain,
        defaultLocale,
        locale: (path === null || path === void 0 ? void 0 : path.detectedLocale) || defaultLocale,
        redirect: getRedirect({
            locale: {
                preferred: preferredLocale,
                default: defaultLocale,
                detected: (path === null || path === void 0 ? void 0 : path.detectedLocale) || (domain === null || domain === void 0 ? void 0 : domain.defaultLocale) || getLocaleFromCookie(i18n, cookies) || preferredLocale || i18n.defaultLocale
            },
            domain,
            nextConfig,
            url
        }),
        trailingSlash: url.pathname !== '/' ? url.pathname.endsWith('/') : nextConfig.trailingSlash
    };
}
function getLocaleFromCookie(i18n, cookies) {
    var ref, ref1;
    const nextLocale = (ref = cookies()) === null || ref === void 0 ? void 0 : (ref1 = ref.NEXT_LOCALE) === null || ref1 === void 0 ? void 0 : ref1.toLowerCase();
    return nextLocale ? i18n.locales.find((locale)=>nextLocale === locale.toLowerCase()
    ) : undefined;
}
function getAcceptPreferredLocale(i18n, headers) {
    const value = headers === null || headers === void 0 ? void 0 : headers['accept-language'];
    if (i18n.localeDetection !== false && value && !Array.isArray(value)) {
        try {
            return (0, _acceptHeader).acceptLanguage(value, i18n.locales);
        } catch (err) {
        }
    }
}
function getHostname(parsed, headers) {
    var ref;
    return (ref = !Array.isArray(headers === null || headers === void 0 ? void 0 : headers.host) && (headers === null || headers === void 0 ? void 0 : headers.host) || parsed.hostname) === null || ref === void 0 ? void 0 : ref.split(':')[0].toLowerCase();
}
function getRedirect({ domain , locale , nextConfig , url  }) {
    const isRootPath = (0, _denormalizePagePath).denormalizePagePath(url.pathname) === '/';
    if (nextConfig.i18n.localeDetection !== false && isRootPath) {
        const preferredDomain = (0, _detectDomainLocale).detectDomainLocale(nextConfig.i18n.domains, undefined, locale.preferred);
        if (domain && preferredDomain) {
            const isPDomain = preferredDomain.domain === domain.domain;
            const isPLocale = preferredDomain.defaultLocale === locale.preferred;
            if (!isPDomain || !isPLocale) {
                const scheme = `http${preferredDomain.http ? '' : 's'}`;
                const rlocale = isPLocale ? '' : locale.preferred;
                return `${scheme}://${preferredDomain.domain}/${rlocale}`;
            }
        }
        if (locale.detected.toLowerCase() !== locale.default.toLowerCase()) {
            return (0, _formatUrl).formatUrl({
                ...url,
                pathname: `${nextConfig.basePath || ''}/${locale.detected}`
            });
        }
    }
}

//# sourceMappingURL=get-locale-metadata.js.map