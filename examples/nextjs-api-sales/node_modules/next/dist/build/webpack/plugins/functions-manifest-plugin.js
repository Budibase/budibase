"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _path = require("path");
var _webpack = require("next/dist/compiled/webpack/webpack");
var _normalizePagePath = require("../../../server/normalize-page-path");
var _constants = require("../../../shared/lib/constants");
var _entries = require("../../entries");
var _middlewarePlugin = require("./middleware-plugin");
const PLUGIN_NAME = 'FunctionsManifestPlugin';
function containsPath(outer, inner) {
    const rel = (0, _path).relative(outer, inner);
    return !rel.startsWith('../') && rel !== '..';
}
class FunctionsManifestPlugin {
    constructor({ dev , pagesDir , pageExtensions , isEdgeRuntime  }){
        this.dev = dev;
        this.pagesDir = pagesDir;
        this.isEdgeRuntime = isEdgeRuntime;
        this.pageExtensions = pageExtensions;
        this.pagesRuntime = new Map();
    }
    createAssets(compilation, assets, envPerRoute, isEdgeRuntime) {
        const functionsManifest = {
            version: 1,
            pages: {
            }
        };
        const infos = (0, _middlewarePlugin).getEntrypointInfo(compilation, envPerRoute, isEdgeRuntime);
        infos.forEach((info)=>{
            const { page  } = info;
            // TODO: use global default runtime instead of 'web'
            const pageRuntime = this.pagesRuntime.get(page);
            const isWebRuntime = pageRuntime === 'edge' || this.isEdgeRuntime && !pageRuntime;
            functionsManifest.pages[page] = {
                // Not assign if it's nodejs runtime, project configured node version is used instead
                ...isWebRuntime && {
                    runtime: 'web'
                },
                ...info
            };
        });
        const assetPath = (this.isEdgeRuntime ? '' : 'server/') + _constants.FUNCTIONS_MANIFEST;
        assets[assetPath] = new _webpack.sources.RawSource(JSON.stringify(functionsManifest, null, 2));
    }
    apply(compiler) {
        const handler = (parser)=>{
            parser.hooks.exportSpecifier.tap(PLUGIN_NAME, (statement, _identifierName, exportName)=>{
                const { resource  } = parser.state.module;
                const isPagePath = containsPath(this.pagesDir, resource);
                // Only parse exported config in pages
                if (!isPagePath) {
                    return;
                }
                const { declaration  } = statement;
                if (exportName === 'config') {
                    const varDecl = declaration.declarations[0];
                    const { properties  } = varDecl.init;
                    const prop = properties.find((p)=>p.key.name === 'runtime'
                    );
                    if (!prop) return;
                    const runtime = prop.value.value;
                    if (![
                        'nodejs',
                        'edge'
                    ].includes(runtime)) throw new Error(`The runtime option can only be 'nodejs' or 'edge'`);
                    // @ts-ignore buildInfo exists on Module
                    parser.state.module.buildInfo.NEXT_runtime = runtime;
                }
            });
        };
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory: factory  })=>{
            factory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, handler);
            factory.hooks.parser.for('javascript/esm').tap(PLUGIN_NAME, handler);
            compilation.hooks.seal.tap(PLUGIN_NAME, ()=>{
                for (const entryData of compilation.entries.values()){
                    for (const dependency of entryData.dependencies){
                        // @ts-ignore TODO: webpack 5 types
                        const module = compilation.moduleGraph.getModule(dependency);
                        const outgoingConnections = compilation.moduleGraph.getOutgoingConnectionsByModule(module);
                        if (!outgoingConnections) return;
                        const entryModules = outgoingConnections.keys();
                        for (const mod of entryModules){
                            var ref;
                            const runtime = mod === null || mod === void 0 ? void 0 : (ref = mod.buildInfo) === null || ref === void 0 ? void 0 : ref.NEXT_runtime;
                            if (runtime) {
                                // @ts-ignore: TODO: webpack 5 types
                                const normalizedPagePath = (0, _normalizePagePath).normalizePagePath(mod.userRequest);
                                const pagePath = normalizedPagePath.replace(this.pagesDir, '');
                                const page = (0, _entries).getPageFromPath(pagePath, this.pageExtensions);
                                this.pagesRuntime.set(page, runtime);
                                break;
                            }
                        }
                    }
                }
            });
        });
        (0, _middlewarePlugin).collectAssets(compiler, this.createAssets.bind(this), {
            dev: this.dev,
            pluginName: PLUGIN_NAME,
            isEdgeRuntime: this.isEdgeRuntime
        });
    }
}
exports.default = FunctionsManifestPlugin;

//# sourceMappingURL=functions-manifest-plugin.js.map