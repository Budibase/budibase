"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _getLocaleMetadata = require("../../shared/lib/i18n/get-locale-metadata");
var _router = require("../router");
var _cookie = _interopRequireDefault(require("next/dist/compiled/cookie"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Internal = Symbol('NextURLInternal');
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === 'object' && 'pathname' in baseOrOpts || typeof baseOrOpts === 'string') {
            base = baseOrOpts;
            options = opts || {
            };
        } else {
            options = opts || baseOrOpts || {
            };
        }
        this[Internal] = {
            url: parseURL(input, base !== null && base !== void 0 ? base : options.base),
            options: options,
            basePath: ''
        };
        this.analyzeUrl();
    }
    analyzeUrl() {
        const { headers ={
        } , basePath , i18n  } = this[Internal].options;
        if (basePath && this[Internal].url.pathname.startsWith(basePath)) {
            this[Internal].url.pathname = (0, _router).replaceBasePath(this[Internal].url.pathname, basePath);
            this[Internal].basePath = basePath;
        } else {
            this[Internal].basePath = '';
        }
        if (i18n) {
            var ref;
            this[Internal].locale = (0, _getLocaleMetadata).getLocaleMetadata({
                cookies: ()=>{
                    const value = headers['cookie'];
                    return value ? _cookie.default.parse(Array.isArray(value) ? value.join(';') : value) : {
                    };
                },
                headers: headers,
                nextConfig: {
                    basePath: basePath,
                    i18n: i18n
                },
                url: {
                    hostname: this[Internal].url.hostname || null,
                    pathname: this[Internal].url.pathname
                }
            });
            if ((ref = this[Internal].locale) === null || ref === void 0 ? void 0 : ref.path.detectedLocale) {
                this[Internal].url.pathname = this[Internal].locale.path.pathname;
            }
        }
    }
    formatPathname() {
        var ref, ref1;
        const { i18n  } = this[Internal].options;
        let pathname = this[Internal].url.pathname;
        if (((ref = this[Internal].locale) === null || ref === void 0 ? void 0 : ref.locale) && (i18n === null || i18n === void 0 ? void 0 : i18n.defaultLocale) !== ((ref1 = this[Internal].locale) === null || ref1 === void 0 ? void 0 : ref1.locale)) {
            var ref5;
            pathname = `/${(ref5 = this[Internal].locale) === null || ref5 === void 0 ? void 0 : ref5.locale}${pathname}`;
        }
        if (this[Internal].basePath) {
            pathname = `${this[Internal].basePath}${pathname}`;
        }
        return pathname;
    }
    get locale() {
        var ref;
        var ref6;
        return (ref6 = (ref = this[Internal].locale) === null || ref === void 0 ? void 0 : ref.locale) !== null && ref6 !== void 0 ? ref6 : '';
    }
    set locale(locale) {
        var ref;
        if (!this[Internal].locale || !((ref = this[Internal].options.i18n) === null || ref === void 0 ? void 0 : ref.locales.includes(locale))) {
            throw new TypeError(`The NextURL configuration includes no locale "${locale}"`);
        }
        this[Internal].locale.locale = locale;
    }
    get defaultLocale() {
        var ref;
        return (ref = this[Internal].locale) === null || ref === void 0 ? void 0 : ref.defaultLocale;
    }
    get domainLocale() {
        var ref;
        return (ref = this[Internal].locale) === null || ref === void 0 ? void 0 : ref.domain;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        return `${this.protocol}//${this.host}${pathname}${this[Internal].url.search}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyzeUrl();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith('/') ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
}
exports.NextURL = NextURL;
const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|::1|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, 'localhost'), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, 'localhost'));
}

//# sourceMappingURL=next-url.js.map