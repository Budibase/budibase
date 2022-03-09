"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEntrypointInfo = getEntrypointInfo;
exports.collectAssets = collectAssets;
exports.default = exports.ssrEntries = void 0;
var _webpack = require("next/dist/compiled/webpack/webpack");
var _utils = require("../../../shared/lib/router/utils");
var _constants = require("../../../shared/lib/constants");
var _nonNullable = require("../../../lib/non-nullable");
const PLUGIN_NAME = 'MiddlewarePlugin';
const MIDDLEWARE_FULL_ROUTE_REGEX = /^pages[/\\]?(.*)\/_middleware$/;
const ssrEntries = new Map();
exports.ssrEntries = ssrEntries;
const middlewareManifest = {
    sortedMiddleware: [],
    clientInfo: [],
    middleware: {
    },
    version: 1
};
function getPageFromEntrypointName(pagePath) {
    const ssrEntryInfo = ssrEntries.get(pagePath);
    const result = MIDDLEWARE_FULL_ROUTE_REGEX.exec(pagePath);
    const page = result ? `/${result[1]}` : ssrEntryInfo ? pagePath.slice('pages'.length).replace(/\/index$/, '') || '/' : null;
    return page;
}
function getEntrypointInfo(compilation, envPerRoute, isEdgeRuntime) {
    const entrypoints = compilation.entrypoints;
    const infos = [];
    for (const entrypoint of entrypoints.values()){
        if (!entrypoint.name) continue;
        const ssrEntryInfo = ssrEntries.get(entrypoint.name);
        if (ssrEntryInfo && !isEdgeRuntime) continue;
        if (!ssrEntryInfo && isEdgeRuntime) continue;
        const page = getPageFromEntrypointName(entrypoint.name);
        if (!page) {
            continue;
        }
        const entryFiles = entrypoint.getFiles().filter((file)=>!file.endsWith('.hot-update.js')
        );
        const files = ssrEntryInfo ? [
            ssrEntryInfo.requireFlightManifest ? `server/${_constants.MIDDLEWARE_FLIGHT_MANIFEST}.js` : null,
            `server/${_constants.MIDDLEWARE_BUILD_MANIFEST}.js`,
            `server/${_constants.MIDDLEWARE_REACT_LOADABLE_MANIFEST}.js`,
            ...entryFiles.map((file)=>'server/' + file
            ), 
        ].filter(_nonNullable.nonNullable) : entryFiles.map((file)=>file
        );
        infos.push({
            env: envPerRoute.get(entrypoint.name) || [],
            files,
            name: entrypoint.name,
            page,
            regexp: (0, _utils).getMiddlewareRegex(page, !ssrEntryInfo).namedRegex
        });
    }
    return infos;
}
class MiddlewarePlugin {
    constructor({ dev , isEdgeRuntime  }){
        this.dev = dev;
        this.isEdgeRuntime = isEdgeRuntime;
    }
    createAssets(compilation, assets, envPerRoute, isEdgeRuntime) {
        const infos = getEntrypointInfo(compilation, envPerRoute, isEdgeRuntime);
        infos.forEach((info)=>{
            middlewareManifest.middleware[info.page] = info;
        });
        middlewareManifest.sortedMiddleware = (0, _utils).getSortedRoutes(Object.keys(middlewareManifest.middleware));
        middlewareManifest.clientInfo = middlewareManifest.sortedMiddleware.map((key)=>{
            const middleware = middlewareManifest.middleware[key];
            const ssrEntryInfo = ssrEntries.get(middleware.name);
            return [
                key,
                !!ssrEntryInfo
            ];
        });
        assets[this.isEdgeRuntime ? _constants.MIDDLEWARE_MANIFEST : `server/${_constants.MIDDLEWARE_MANIFEST}`] = new _webpack.sources.RawSource(JSON.stringify(middlewareManifest, null, 2));
    }
    apply(compiler) {
        collectAssets(compiler, this.createAssets.bind(this), {
            dev: this.dev,
            pluginName: PLUGIN_NAME,
            isEdgeRuntime: this.isEdgeRuntime
        });
    }
}
exports.default = MiddlewarePlugin;
function collectAssets(compiler, createAssets, options) {
    const wp = compiler.webpack;
    compiler.hooks.compilation.tap(options.pluginName, (compilation, { normalModuleFactory  })=>{
        compilation.hooks.afterChunks.tap(options.pluginName, ()=>{
            const middlewareRuntimeChunk = compilation.namedChunks.get(_constants.MIDDLEWARE_RUNTIME_WEBPACK);
            if (middlewareRuntimeChunk) {
                middlewareRuntimeChunk.filenameTemplate = 'server/[name].js';
            }
        });
        const envPerRoute = new Map();
        compilation.hooks.afterOptimizeModules.tap(PLUGIN_NAME, ()=>{
            const { moduleGraph  } = compilation;
            envPerRoute.clear();
            for (const [name, info] of compilation.entries){
                if (info.options.runtime === _constants.MIDDLEWARE_SSR_RUNTIME_WEBPACK || info.options.runtime === _constants.MIDDLEWARE_RUNTIME_WEBPACK) {
                    const middlewareEntries = new Set();
                    const env = new Set();
                    const addEntriesFromDependency = (dep)=>{
                        const module = moduleGraph.getModule(dep);
                        if (module) {
                            middlewareEntries.add(module);
                        }
                    };
                    const runtime = wp.util.runtime.getEntryRuntime(compilation, name);
                    info.dependencies.forEach(addEntriesFromDependency);
                    info.includeDependencies.forEach(addEntriesFromDependency);
                    const queue = new Set(middlewareEntries);
                    for (const module of queue){
                        const { buildInfo  } = module;
                        if (!options.dev && buildInfo && isUsedByExports({
                            module,
                            moduleGraph,
                            runtime,
                            usedByExports: buildInfo.usingIndirectEval
                        })) {
                            if (/node_modules[\\/]regenerator-runtime[\\/]runtime\.js/.test(module.identifier())) continue;
                            const error = new wp.WebpackError(`Dynamic Code Evaluation (e. g. 'eval', 'new Function') not allowed in Middleware ${name}${typeof buildInfo.usingIndirectEval !== 'boolean' ? `\nUsed by ${Array.from(buildInfo.usingIndirectEval).join(', ')}` : ''}`);
                            error.module = module;
                            compilation.errors.push(error);
                        }
                        if ((buildInfo === null || buildInfo === void 0 ? void 0 : buildInfo.nextUsedEnvVars) !== undefined) {
                            for (const envName of buildInfo.nextUsedEnvVars){
                                env.add(envName);
                            }
                        }
                        const connections = moduleGraph.getOutgoingConnections(module);
                        for (const connection of connections){
                            if (connection.module) {
                                queue.add(connection.module);
                            }
                        }
                    }
                    envPerRoute.set(name, Array.from(env));
                }
            }
        });
        const handler = (parser)=>{
            const isMiddlewareModule = ()=>parser.state.module && parser.state.module.layer === 'middleware'
            ;
            const wrapExpression = (expr)=>{
                if (!isMiddlewareModule()) return;
                if (options.dev) {
                    const dep1 = new wp.dependencies.ConstDependency('__next_eval__(function() { return ', expr.range[0]);
                    dep1.loc = expr.loc;
                    parser.state.module.addPresentationalDependency(dep1);
                    const dep2 = new wp.dependencies.ConstDependency('})', expr.range[1]);
                    dep2.loc = expr.loc;
                    parser.state.module.addPresentationalDependency(dep2);
                }
                expressionHandler();
                return true;
            };
            const flagModule = (usedByExports)=>{
                if (usedByExports === undefined) usedByExports = true;
                const old = parser.state.module.buildInfo.usingIndirectEval;
                if (old === true || usedByExports === false) return;
                if (!old || usedByExports === true) {
                    parser.state.module.buildInfo.usingIndirectEval = usedByExports;
                    return;
                }
                const set = new Set(old);
                for (const item of usedByExports){
                    set.add(item);
                }
                parser.state.module.buildInfo.usingIndirectEval = set;
            };
            const expressionHandler = ()=>{
                if (!isMiddlewareModule()) return;
                wp.optimize.InnerGraph.onUsage(parser.state, flagModule);
            };
            const ignore = ()=>{
                if (!isMiddlewareModule()) return;
                return true;
            };
            // wrapping
            parser.hooks.call.for('eval').tap(PLUGIN_NAME, wrapExpression);
            parser.hooks.call.for('global.eval').tap(PLUGIN_NAME, wrapExpression);
            parser.hooks.call.for('Function').tap(PLUGIN_NAME, wrapExpression);
            parser.hooks.call.for('global.Function').tap(PLUGIN_NAME, wrapExpression);
            parser.hooks.new.for('Function').tap(PLUGIN_NAME, wrapExpression);
            parser.hooks.new.for('global.Function').tap(PLUGIN_NAME, wrapExpression);
            // fallbacks
            parser.hooks.expression.for('eval').tap(PLUGIN_NAME, expressionHandler);
            parser.hooks.expression.for('Function').tap(PLUGIN_NAME, expressionHandler);
            parser.hooks.expression.for('Function.prototype').tap(PLUGIN_NAME, ignore);
            parser.hooks.expression.for('global.eval').tap(PLUGIN_NAME, expressionHandler);
            parser.hooks.expression.for('global.Function').tap(PLUGIN_NAME, expressionHandler);
            parser.hooks.expression.for('global.Function.prototype').tap(PLUGIN_NAME, ignore);
            const memberChainHandler = (_expr, members)=>{
                if (members.length >= 2 && members[0] === 'env') {
                    const envName = members[1];
                    const { buildInfo  } = parser.state.module;
                    if (buildInfo.nextUsedEnvVars === undefined) {
                        buildInfo.nextUsedEnvVars = new Set();
                    }
                    buildInfo.nextUsedEnvVars.add(envName);
                    if (isMiddlewareModule()) return true;
                }
            };
            parser.hooks.callMemberChain.for('process').tap(PLUGIN_NAME, memberChainHandler);
            parser.hooks.expressionMemberChain.for('process').tap(PLUGIN_NAME, memberChainHandler);
        };
        normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, handler);
        normalModuleFactory.hooks.parser.for('javascript/dynamic').tap(PLUGIN_NAME, handler);
        normalModuleFactory.hooks.parser.for('javascript/esm').tap(PLUGIN_NAME, handler);
        // @ts-ignore TODO: Remove ignore when webpack 5 is stable
        compilation.hooks.processAssets.tap({
            name: 'NextJsMiddlewareManifest',
            // @ts-ignore TODO: Remove ignore when webpack 5 is stable
            stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        }, (assets)=>{
            createAssets(compilation, assets, envPerRoute, options.isEdgeRuntime);
        });
    });
}
function isUsedByExports(args) {
    const { moduleGraph , runtime , module , usedByExports  } = args;
    if (usedByExports === undefined) return false;
    if (typeof usedByExports === 'boolean') return usedByExports;
    const exportsInfo = moduleGraph.getExportsInfo(module);
    const wp = _webpack.webpack;
    for (const exportName of usedByExports){
        if (exportsInfo.getUsed(exportName, runtime) !== wp.UsageState.Unused) return true;
    }
    return false;
}

//# sourceMappingURL=middleware-plugin.js.map