"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.build = build;
var _base = require("./blocks/base");
var _css = require("./blocks/css");
var _images = require("./blocks/images");
var _utils = require("./utils");
async function build(config, { supportedBrowsers , rootDirectory , customAppFile , isDevelopment , isServer , isEdgeRuntime , targetWeb , assetPrefix , sassOptions , productionBrowserSourceMaps , future , experimental , disableStaticImages  }) {
    const ctx = {
        supportedBrowsers,
        rootDirectory,
        customAppFile,
        isDevelopment,
        isProduction: !isDevelopment,
        isServer,
        isEdgeRuntime,
        isClient: !isServer,
        targetWeb,
        assetPrefix: assetPrefix ? assetPrefix.endsWith('/') ? assetPrefix.slice(0, -1) : assetPrefix : '',
        sassOptions,
        productionBrowserSourceMaps,
        future,
        experimental
    };
    let fns = [
        (0, _base).base(ctx),
        (0, _css).css(ctx)
    ];
    if (!disableStaticImages) {
        fns.push((0, _images).images(ctx));
    }
    const fn = (0, _utils).pipe(...fns);
    return fn(config);
}

//# sourceMappingURL=index.js.map