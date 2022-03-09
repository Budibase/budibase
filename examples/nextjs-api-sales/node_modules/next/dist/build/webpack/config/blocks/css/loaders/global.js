"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getGlobalCssLoader = getGlobalCssLoader;
var _client = require("./client");
var _fileResolve = require("./file-resolve");
function getGlobalCssLoader(ctx, postcss, preProcessors = []) {
    const loaders = [];
    if (ctx.isClient) {
        // Add appropriate development more or production mode style
        // loader
        loaders.push((0, _client).getClientStyleLoader({
            isDevelopment: ctx.isDevelopment,
            assetPrefix: ctx.assetPrefix
        }));
    }
    // Resolve CSS `@import`s and `url()`s
    loaders.push({
        loader: require.resolve('../../../../loaders/css-loader/src'),
        options: {
            postcss,
            importLoaders: 1 + preProcessors.length,
            // Next.js controls CSS Modules eligibility:
            modules: false,
            url: (url, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports)
            ,
            import: (url, _, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports)
        }
    });
    // Compile CSS
    loaders.push({
        loader: require.resolve('../../../../loaders/postcss-loader/src'),
        options: {
            postcss
        }
    });
    loaders.push(// Webpack loaders run like a stack, so we need to reverse the natural
    // order of preprocessors.
    ...preProcessors.slice().reverse());
    return loaders;
}

//# sourceMappingURL=global.js.map