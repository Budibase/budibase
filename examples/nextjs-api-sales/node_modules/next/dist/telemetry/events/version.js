"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventCliSession = eventCliSession;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const EVENT_VERSION = 'NEXT_CLI_SESSION_STARTED';
function hasBabelConfig(dir) {
    try {
        var ref, ref1, ref2, ref3;
        const noopFile = _path.default.join(dir, 'noop.js');
        const res = require('next/dist/compiled/babel/core').loadPartialConfig({
            cwd: dir,
            filename: noopFile,
            sourceFileName: noopFile
        });
        const isForTooling = ((ref = res.options) === null || ref === void 0 ? void 0 : (ref1 = ref.presets) === null || ref1 === void 0 ? void 0 : ref1.every((e)=>{
            var ref;
            return (e === null || e === void 0 ? void 0 : (ref = e.file) === null || ref === void 0 ? void 0 : ref.request) === 'next/babel';
        })) && ((ref2 = res.options) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.plugins) === null || ref3 === void 0 ? void 0 : ref3.length) === 0;
        return res.hasFilesystemConfig() && !isForTooling;
    } catch  {
        return false;
    }
}
function eventCliSession(dir, nextConfig, event) {
    // This should be an invariant, if it fails our build tooling is broken.
    if (typeof "12.1.0" !== 'string') {
        return [];
    }
    const { images , i18n  } = nextConfig || {
    };
    const payload = {
        nextVersion: "12.1.0",
        nodeVersion: process.version,
        cliCommand: event.cliCommand,
        isSrcDir: event.isSrcDir,
        hasNowJson: event.hasNowJson,
        isCustomServer: event.isCustomServer,
        hasNextConfig: nextConfig.configOrigin !== 'default',
        buildTarget: nextConfig.target === 'server' ? 'default' : nextConfig.target,
        hasWebpackConfig: typeof (nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.webpack) === 'function',
        hasBabelConfig: hasBabelConfig(dir),
        imageEnabled: !!images,
        basePathEnabled: !!(nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.basePath),
        i18nEnabled: !!i18n,
        locales: (i18n === null || i18n === void 0 ? void 0 : i18n.locales) ? i18n.locales.join(',') : null,
        localeDomainsCount: (i18n === null || i18n === void 0 ? void 0 : i18n.domains) ? i18n.domains.length : null,
        localeDetectionEnabled: !i18n ? null : i18n.localeDetection !== false,
        imageDomainsCount: (images === null || images === void 0 ? void 0 : images.domains) ? images.domains.length : null,
        imageSizes: (images === null || images === void 0 ? void 0 : images.imageSizes) ? images.imageSizes.join(',') : null,
        imageLoader: images === null || images === void 0 ? void 0 : images.loader,
        trailingSlashEnabled: !!(nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.trailingSlash),
        reactStrictMode: !!(nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.reactStrictMode),
        webpackVersion: event.webpackVersion || null
    };
    return [
        {
            eventName: EVENT_VERSION,
            payload
        }
    ];
}

//# sourceMappingURL=version.js.map