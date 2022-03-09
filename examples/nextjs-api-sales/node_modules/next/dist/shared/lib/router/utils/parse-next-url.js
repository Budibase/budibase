"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNextUrl = parseNextUrl;
var _apiUtils = require("../../../../server/api-utils");
var _getLocaleMetadata = require("../../i18n/get-locale-metadata");
var _parseUrl = require("./parse-url");
var _router = require("../../../../server/router");
function parseNextUrl({ headers , nextConfig , url ='/'  }) {
    const urlParsed = (0, _parseUrl).parseUrl(url);
    const { basePath  } = nextConfig;
    if (basePath && (0, _router).hasBasePath(urlParsed.pathname, basePath)) {
        urlParsed.pathname = (0, _router).replaceBasePath(urlParsed.pathname, basePath);
        urlParsed.basePath = basePath;
    }
    if (nextConfig.i18n) {
        var ref;
        urlParsed.locale = (0, _getLocaleMetadata).getLocaleMetadata({
            cookies: (0, _apiUtils).getCookieParser(headers || {
            }),
            headers: headers,
            nextConfig: {
                basePath: nextConfig.basePath,
                i18n: nextConfig.i18n,
                trailingSlash: nextConfig.trailingSlash
            },
            url: urlParsed
        });
        if ((ref = urlParsed.locale) === null || ref === void 0 ? void 0 : ref.path.detectedLocale) {
            urlParsed.pathname = urlParsed.locale.path.pathname;
        }
    }
    return urlParsed;
}

//# sourceMappingURL=parse-next-url.js.map