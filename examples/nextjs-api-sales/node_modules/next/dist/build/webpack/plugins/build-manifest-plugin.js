"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _devalue = _interopRequireDefault(require("next/dist/compiled/devalue"));
var _webpack = require("next/dist/compiled/webpack/webpack");
var _constants = require("../../../shared/lib/constants");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../../../server/get-route-from-entrypoint"));
var _nextDropClientPagePlugin = require("./next-drop-client-page-plugin");
var _utils = require("../../../shared/lib/router/utils");
var _profilingPlugin = require("./profiling-plugin");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// This function takes the asset map generated in BuildManifestPlugin and creates a
// reduced version to send to the client.
function generateClientManifest(compiler, compilation, assetMap, rewrites) {
    const compilationSpan = _profilingPlugin.spans.get(compilation) || _profilingPlugin.spans.get(compiler);
    const genClientManifestSpan = compilationSpan === null || compilationSpan === void 0 ? void 0 : compilationSpan.traceChild('NextJsBuildManifest-generateClientManifest');
    return genClientManifestSpan === null || genClientManifestSpan === void 0 ? void 0 : genClientManifestSpan.traceFn(()=>{
        const clientManifest = {
            // TODO: update manifest type to include rewrites
            __rewrites: rewrites
        };
        const appDependencies = new Set(assetMap.pages['/_app']);
        const sortedPageKeys = (0, _utils).getSortedRoutes(Object.keys(assetMap.pages));
        sortedPageKeys.forEach((page)=>{
            const dependencies = assetMap.pages[page];
            if (page === '/_app') return;
            // Filter out dependencies in the _app entry, because those will have already
            // been loaded by the client prior to a navigation event
            const filteredDeps = dependencies.filter((dep)=>!appDependencies.has(dep)
            );
            // The manifest can omit the page if it has no requirements
            if (filteredDeps.length) {
                clientManifest[page] = filteredDeps;
            }
        });
        // provide the sorted pages as an array so we don't rely on the object's keys
        // being in order and we don't slow down look-up time for page assets
        clientManifest.sortedPages = sortedPageKeys;
        return (0, _devalue).default(clientManifest);
    });
}
function getEntrypointFiles(entrypoint) {
    var ref;
    return (ref = entrypoint === null || entrypoint === void 0 ? void 0 : entrypoint.getFiles().filter((file)=>{
        // We don't want to include `.hot-update.js` files into the initial page
        return /(?<!\.hot-update)\.(js|css)($|\?)/.test(file);
    }).map((file)=>file.replace(/\\/g, '/')
    )) !== null && ref !== void 0 ? ref : [];
}
const processRoute = (r)=>{
    const rewrite = {
        ...r
    };
    // omit external rewrite destinations since these aren't
    // handled client-side
    if (!rewrite.destination.startsWith('/')) {
        delete rewrite.destination;
    }
    return rewrite;
};
class BuildManifestPlugin {
    constructor(options){
        this.buildId = options.buildId;
        this.isDevFallback = !!options.isDevFallback;
        this.rewrites = {
            beforeFiles: [],
            afterFiles: [],
            fallback: []
        };
        this.rewrites.beforeFiles = options.rewrites.beforeFiles.map(processRoute);
        this.rewrites.afterFiles = options.rewrites.afterFiles.map(processRoute);
        this.rewrites.fallback = options.rewrites.fallback.map(processRoute);
        this.exportRuntime = !!options.exportRuntime;
    }
    createAssets(compiler, compilation, assets) {
        const compilationSpan = _profilingPlugin.spans.get(compilation) || _profilingPlugin.spans.get(compiler);
        const createAssetsSpan = compilationSpan === null || compilationSpan === void 0 ? void 0 : compilationSpan.traceChild('NextJsBuildManifest-createassets');
        return createAssetsSpan === null || createAssetsSpan === void 0 ? void 0 : createAssetsSpan.traceFn(()=>{
            const entrypoints = compilation.entrypoints;
            const assetMap = {
                polyfillFiles: [],
                devFiles: [],
                ampDevFiles: [],
                lowPriorityFiles: [],
                pages: {
                    '/_app': []
                },
                ampFirstPages: []
            };
            const ampFirstEntryNames = _nextDropClientPagePlugin.ampFirstEntryNamesMap.get(compilation);
            if (ampFirstEntryNames) {
                for (const entryName of ampFirstEntryNames){
                    const pagePath = (0, _getRouteFromEntrypoint).default(entryName);
                    if (!pagePath) {
                        continue;
                    }
                    assetMap.ampFirstPages.push(pagePath);
                }
            }
            const mainFiles = new Set(getEntrypointFiles(entrypoints.get(_constants.CLIENT_STATIC_FILES_RUNTIME_MAIN)));
            const compilationAssets = compilation.getAssets();
            assetMap.polyfillFiles = compilationAssets.filter((p)=>{
                // Ensure only .js files are passed through
                if (!p.name.endsWith('.js')) {
                    return false;
                }
                return p.info && _constants.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL in p.info;
            }).map((v)=>v.name
            );
            assetMap.devFiles = getEntrypointFiles(entrypoints.get(_constants.CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH)).filter((file)=>!mainFiles.has(file)
            );
            assetMap.ampDevFiles = getEntrypointFiles(entrypoints.get(_constants.CLIENT_STATIC_FILES_RUNTIME_AMP));
            const systemEntrypoints = new Set([
                _constants.CLIENT_STATIC_FILES_RUNTIME_MAIN,
                _constants.CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
                _constants.CLIENT_STATIC_FILES_RUNTIME_AMP, 
            ]);
            for (const entrypoint of compilation.entrypoints.values()){
                if (systemEntrypoints.has(entrypoint.name)) continue;
                const pagePath = (0, _getRouteFromEntrypoint).default(entrypoint.name);
                if (!pagePath) {
                    continue;
                }
                const filesForPage = getEntrypointFiles(entrypoint);
                assetMap.pages[pagePath] = [
                    ...new Set([
                        ...mainFiles,
                        ...filesForPage
                    ])
                ];
            }
            if (!this.isDevFallback) {
                // Add the runtime build manifest file (generated later in this file)
                // as a dependency for the app. If the flag is false, the file won't be
                // downloaded by the client.
                assetMap.lowPriorityFiles.push(`${_constants.CLIENT_STATIC_FILES_PATH}/${this.buildId}/_buildManifest.js`);
                // Add the runtime ssg manifest file as a lazy-loaded file dependency.
                // We also stub this file out for development mode (when it is not
                // generated).
                const srcEmptySsgManifest = `self.__SSG_MANIFEST=new Set;self.__SSG_MANIFEST_CB&&self.__SSG_MANIFEST_CB()`;
                const ssgManifestPath = `${_constants.CLIENT_STATIC_FILES_PATH}/${this.buildId}/_ssgManifest.js`;
                assetMap.lowPriorityFiles.push(ssgManifestPath);
                assets[ssgManifestPath] = new _webpack.sources.RawSource(srcEmptySsgManifest);
                const srcEmptyMiddlewareManifest = `self.__MIDDLEWARE_MANIFEST=[];self.__MIDDLEWARE_MANIFEST_CB&&self.__MIDDLEWARE_MANIFEST_CB()`;
                const middlewareManifestPath = `${_constants.CLIENT_STATIC_FILES_PATH}/${this.buildId}/_middlewareManifest.js`;
                assetMap.lowPriorityFiles.push(middlewareManifestPath);
                assets[middlewareManifestPath] = new _webpack.sources.RawSource(srcEmptyMiddlewareManifest);
            }
            assetMap.pages = Object.keys(assetMap.pages).sort()// eslint-disable-next-line
            .reduce((a, c)=>(a[c] = assetMap.pages[c], a)
            , {
            });
            let buildManifestName = _constants.BUILD_MANIFEST;
            if (this.isDevFallback) {
                buildManifestName = `fallback-${_constants.BUILD_MANIFEST}`;
            }
            assets[buildManifestName] = new _webpack.sources.RawSource(JSON.stringify(assetMap, null, 2));
            if (this.exportRuntime) {
                assets[`server/${_constants.MIDDLEWARE_BUILD_MANIFEST}.js`] = new _webpack.sources.RawSource(`self.__BUILD_MANIFEST=${JSON.stringify(assetMap)}`);
            }
            if (!this.isDevFallback) {
                const clientManifestPath = `${_constants.CLIENT_STATIC_FILES_PATH}/${this.buildId}/_buildManifest.js`;
                assets[clientManifestPath] = new _webpack.sources.RawSource(`self.__BUILD_MANIFEST = ${generateClientManifest(compiler, compilation, assetMap, this.rewrites)};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()`);
            }
            return assets;
        });
    }
    apply(compiler) {
        compiler.hooks.make.tap('NextJsBuildManifest', (compilation)=>{
            // @ts-ignore TODO: Remove ignore when webpack 5 is stable
            compilation.hooks.processAssets.tap({
                name: 'NextJsBuildManifest',
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>{
                this.createAssets(compiler, compilation, assets);
            });
        });
        return;
    }
}
exports.default = BuildManifestPlugin;

//# sourceMappingURL=build-manifest-plugin.js.map