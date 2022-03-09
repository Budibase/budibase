"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _path = _interopRequireDefault(require("path"));
var _profilingPlugin = require("./profiling-plugin");
var _isError = _interopRequireDefault(require("../../../lib/is-error"));
var _nft = require("next/dist/compiled/@vercel/nft");
var _constants = require("../../../shared/lib/constants");
var _webpack = require("next/dist/compiled/webpack/webpack");
var _webpackConfig = require("../../webpack-config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PLUGIN_NAME = 'TraceEntryPointsPlugin';
const TRACE_IGNORES = [
    '**/*/next/dist/server/next.js',
    '**/*/next/dist/bin/next', 
];
function getModuleFromDependency(compilation, dep) {
    return compilation.moduleGraph.getModule(dep);
}
function getFilesMapFromReasons(fileList, reasons, ignoreFn) {
    // this uses the reasons tree to collect files specific to a
    // certain parent allowing us to not have to trace each parent
    // separately
    const parentFilesMap = new Map();
    function propagateToParents(parents, file, seen = new Set()) {
        for (const parent of parents || []){
            if (!seen.has(parent)) {
                seen.add(parent);
                let parentFiles = parentFilesMap.get(parent);
                if (!parentFiles) {
                    parentFiles = new Set();
                    parentFilesMap.set(parent, parentFiles);
                }
                if (!(ignoreFn === null || ignoreFn === void 0 ? void 0 : ignoreFn(file, parent))) {
                    parentFiles.add(file);
                }
                const parentReason = reasons.get(parent);
                if (parentReason === null || parentReason === void 0 ? void 0 : parentReason.parents) {
                    propagateToParents(parentReason.parents, file, seen);
                }
            }
        }
    }
    for (const file of fileList){
        const reason = reasons.get(file);
        if (!reason || !reason.parents || reason.type === 'initial' && reason.parents.size === 0) {
            continue;
        }
        propagateToParents(reason.parents, file);
    }
    return parentFilesMap;
}
class TraceEntryPointsPlugin {
    constructor({ appDir , excludeFiles , esmExternals , staticImageImports , outputFileTracingRoot  }){
        this.appDir = appDir;
        this.entryTraces = new Map();
        this.esmExternals = esmExternals;
        this.excludeFiles = excludeFiles || [];
        this.staticImageImports = staticImageImports;
        this.tracingRoot = outputFileTracingRoot || appDir;
    }
    // Here we output all traced assets and webpack chunks to a
    // ${page}.js.nft.json file
    async createTraceAssets(compilation, assets, span, readlink, stat) {
        const outputPath = compilation.outputOptions.path;
        await span.traceChild('create-trace-assets').traceAsyncFn(async ()=>{
            const entryFilesMap = new Map();
            const chunksToTrace = new Set();
            for (const entrypoint of compilation.entrypoints.values()){
                const entryFiles = new Set();
                for (const chunk of entrypoint.getEntrypointChunk().getAllReferencedChunks()){
                    for (const file of chunk.files){
                        const filePath = _path.default.join(outputPath, file);
                        chunksToTrace.add(filePath);
                        entryFiles.add(filePath);
                    }
                    for (const file1 of chunk.auxiliaryFiles){
                        const filePath = _path.default.join(outputPath, file1);
                        chunksToTrace.add(filePath);
                        entryFiles.add(filePath);
                    }
                }
                entryFilesMap.set(entrypoint, entryFiles);
            }
            const result = await (0, _nft).nodeFileTrace([
                ...chunksToTrace
            ], {
                base: this.tracingRoot,
                processCwd: this.appDir,
                readFile: async (path)=>{
                    if (chunksToTrace.has(path)) {
                        var ref, ref1;
                        const source = (ref = assets[_path.default.relative(outputPath, path).replace(/\\/g, '/')]) === null || ref === void 0 ? void 0 : (ref1 = ref.source) === null || ref1 === void 0 ? void 0 : ref1.call(ref);
                        if (source) return source;
                    }
                    try {
                        return await new Promise((resolve, reject)=>{
                            compilation.inputFileSystem.readFile(path, (err, data)=>{
                                if (err) return reject(err);
                                resolve(data);
                            });
                        });
                    } catch (e) {
                        if ((0, _isError).default(e) && (e.code === 'ENOENT' || e.code === 'EISDIR')) {
                            return null;
                        }
                        throw e;
                    }
                },
                readlink,
                stat,
                ignore: [
                    ...TRACE_IGNORES,
                    ...this.excludeFiles
                ],
                mixedModules: true
            });
            const reasons = result.reasons;
            const fileList = result.fileList;
            result.esmFileList.forEach((file)=>fileList.add(file)
            );
            const parentFilesMap = getFilesMapFromReasons(fileList, reasons);
            for (const [entrypoint1, entryFiles] of entryFilesMap){
                const traceOutputName = `../${entrypoint1.name}.js.nft.json`;
                const traceOutputPath = _path.default.dirname(_path.default.join(outputPath, traceOutputName));
                const allEntryFiles = new Set();
                entryFiles.forEach((file)=>{
                    var ref;
                    (ref = parentFilesMap.get(_path.default.relative(this.tracingRoot, file))) === null || ref === void 0 ? void 0 : ref.forEach((child)=>{
                        allEntryFiles.add(_path.default.join(this.tracingRoot, child));
                    });
                });
                // don't include the entry itself in the trace
                entryFiles.delete(_path.default.join(outputPath, `../${entrypoint1.name}.js`));
                assets[traceOutputName] = new _webpack.sources.RawSource(JSON.stringify({
                    version: _constants.TRACE_OUTPUT_VERSION,
                    files: [
                        ...new Set([
                            ...entryFiles,
                            ...allEntryFiles,
                            ...this.entryTraces.get(entrypoint1.name) || [], 
                        ]), 
                    ].map((file)=>{
                        return _path.default.relative(traceOutputPath, file).replace(/\\/g, '/');
                    })
                }));
            }
        });
    }
    tapfinishModules(compilation, traceEntrypointsPluginSpan, doResolve, readlink, stat) {
        compilation.hooks.finishModules.tapAsync(PLUGIN_NAME, async (_stats, callback)=>{
            const finishModulesSpan = traceEntrypointsPluginSpan.traceChild('finish-modules');
            await finishModulesSpan.traceAsyncFn(async ()=>{
                // we create entry -> module maps so that we can
                // look them up faster instead of having to iterate
                // over the compilation modules list
                const entryNameMap = new Map();
                const entryModMap = new Map();
                const additionalEntries = new Map();
                const depModMap = new Map();
                finishModulesSpan.traceChild('get-entries').traceFn(()=>{
                    compilation.entries.forEach((entry, name)=>{
                        if (name === null || name === void 0 ? void 0 : name.replace(/\\/g, '/').startsWith('pages/')) {
                            for (const dep of entry.dependencies){
                                if (!dep) continue;
                                const entryMod = getModuleFromDependency(compilation, dep);
                                if (entryMod && entryMod.resource) {
                                    if (entryMod.resource.replace(/\\/g, '/').includes('pages/')) {
                                        entryNameMap.set(entryMod.resource, name);
                                        entryModMap.set(entryMod.resource, entryMod);
                                    } else {
                                        let curMap = additionalEntries.get(name);
                                        if (!curMap) {
                                            curMap = new Map();
                                            additionalEntries.set(name, curMap);
                                        }
                                        depModMap.set(entryMod.resource, entryMod);
                                        curMap.set(entryMod.resource, entryMod);
                                    }
                                }
                            }
                        }
                    });
                });
                const readFile = async (path)=>{
                    var ref;
                    const mod = depModMap.get(path) || entryModMap.get(path);
                    // map the transpiled source when available to avoid
                    // parse errors in node-file-trace
                    const source = mod === null || mod === void 0 ? void 0 : (ref = mod.originalSource) === null || ref === void 0 ? void 0 : ref.call(mod);
                    if (source) {
                        return source.buffer();
                    }
                    // we don't want to analyze non-transpiled
                    // files here, that is done against webpack output
                    return '';
                };
                const entryPaths = Array.from(entryModMap.keys());
                const collectDependencies = (mod)=>{
                    if (!mod || !mod.dependencies) return;
                    for (const dep of mod.dependencies){
                        const depMod = getModuleFromDependency(compilation, dep);
                        if ((depMod === null || depMod === void 0 ? void 0 : depMod.resource) && !depModMap.get(depMod.resource)) {
                            depModMap.set(depMod.resource, depMod);
                            collectDependencies(depMod);
                        }
                    }
                };
                const entriesToTrace = [
                    ...entryPaths
                ];
                entryPaths.forEach((entry)=>{
                    collectDependencies(entryModMap.get(entry));
                    const entryName = entryNameMap.get(entry);
                    const curExtraEntries = additionalEntries.get(entryName);
                    if (curExtraEntries) {
                        entriesToTrace.push(...curExtraEntries.keys());
                    }
                });
                let fileList;
                let reasons;
                await finishModulesSpan.traceChild('node-file-trace', {
                    traceEntryCount: entriesToTrace.length + ''
                }).traceAsyncFn(async ()=>{
                    const result = await (0, _nft).nodeFileTrace(entriesToTrace, {
                        base: this.tracingRoot,
                        processCwd: this.appDir,
                        readFile,
                        readlink,
                        stat,
                        resolve: doResolve ? async (id, parent, job, isCjs)=>{
                            return doResolve(id, parent, job, !isCjs);
                        } : undefined,
                        ignore: [
                            ...TRACE_IGNORES,
                            ...this.excludeFiles,
                            '**/node_modules/**', 
                        ],
                        mixedModules: true
                    });
                    // @ts-ignore
                    fileList = result.fileList;
                    result.esmFileList.forEach((file)=>fileList.add(file)
                    );
                    reasons = result.reasons;
                });
                await finishModulesSpan.traceChild('collect-traced-files').traceAsyncFn(()=>{
                    const parentFilesMap = getFilesMapFromReasons(fileList, reasons, (file)=>{
                        file = _path.default.join(this.tracingRoot, file);
                        const depMod = depModMap.get(file);
                        return Array.isArray(depMod === null || depMod === void 0 ? void 0 : depMod.loaders) && depMod.loaders.length > 0;
                    });
                    entryPaths.forEach((entry)=>{
                        var ref;
                        const entryName = entryNameMap.get(entry);
                        const normalizedEntry = _path.default.relative(this.tracingRoot, entry);
                        const curExtraEntries = additionalEntries.get(entryName);
                        const finalDeps = new Set();
                        (ref = parentFilesMap.get(normalizedEntry)) === null || ref === void 0 ? void 0 : ref.forEach((dep)=>{
                            finalDeps.add(_path.default.join(this.tracingRoot, dep));
                        });
                        if (curExtraEntries) {
                            for (const extraEntry of curExtraEntries.keys()){
                                var ref7;
                                const normalizedExtraEntry = _path.default.relative(this.tracingRoot, extraEntry);
                                finalDeps.add(extraEntry);
                                (ref7 = parentFilesMap.get(normalizedExtraEntry)) === null || ref7 === void 0 ? void 0 : ref7.forEach((dep)=>{
                                    finalDeps.add(_path.default.join(this.tracingRoot, dep));
                                });
                            }
                        }
                        this.entryTraces.set(entryName, finalDeps);
                    });
                });
            }).then(()=>callback()
            , (err)=>callback(err)
            );
        });
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation)=>{
            const readlink = async (path)=>{
                try {
                    return await new Promise((resolve, reject)=>{
                        compilation.inputFileSystem.readlink(path, (err, link)=>{
                            if (err) return reject(err);
                            resolve(link);
                        });
                    });
                } catch (e) {
                    if ((0, _isError).default(e) && (e.code === 'EINVAL' || e.code === 'ENOENT' || e.code === 'UNKNOWN')) {
                        return null;
                    }
                    throw e;
                }
            };
            const stat = async (path)=>{
                try {
                    return await new Promise((resolve, reject)=>{
                        compilation.inputFileSystem.stat(path, (err, stats)=>{
                            if (err) return reject(err);
                            resolve(stats);
                        });
                    });
                } catch (e) {
                    if ((0, _isError).default(e) && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) {
                        return null;
                    }
                    throw e;
                }
            };
            const compilationSpan = _profilingPlugin.spans.get(compilation) || _profilingPlugin.spans.get(compiler);
            const traceEntrypointsPluginSpan = compilationSpan.traceChild('next-trace-entrypoint-plugin');
            traceEntrypointsPluginSpan.traceFn(()=>{
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                compilation.hooks.processAssets.tapAsync({
                    name: PLUGIN_NAME,
                    // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                    stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
                }, (assets, callback)=>{
                    this.createTraceAssets(compilation, assets, traceEntrypointsPluginSpan, readlink, stat).then(()=>callback()
                    ).catch((err)=>callback(err)
                    );
                });
                let resolver = compilation.resolverFactory.get('normal');
                function getPkgName(name) {
                    const segments = name.split('/');
                    if (name[0] === '@' && segments.length > 1) return segments.length > 1 ? segments.slice(0, 2).join('/') : null;
                    return segments.length ? segments[0] : null;
                }
                const getResolve = (options)=>{
                    const curResolver = resolver.withOptions(options);
                    return (parent, request, job)=>{
                        return new Promise((resolve, reject)=>{
                            const context = _path.default.dirname(parent);
                            curResolver.resolve({
                            }, context, request, {
                                fileDependencies: compilation.fileDependencies,
                                missingDependencies: compilation.missingDependencies,
                                contextDependencies: compilation.contextDependencies
                            }, async (err, result, resContext)=>{
                                if (err) return reject(err);
                                if (!result) {
                                    return reject(new Error('module not found'));
                                }
                                // webpack resolver doesn't strip loader query info
                                // from the result so use path instead
                                if (result.includes('?') || result.includes('!')) {
                                    result = (resContext === null || resContext === void 0 ? void 0 : resContext.path) || result;
                                }
                                try {
                                    // we need to collect all parent package.json's used
                                    // as webpack's resolve doesn't expose this and parent
                                    // package.json could be needed for resolving e.g. stylis
                                    // stylis/package.json -> stylis/dist/umd/package.json
                                    if (result.includes('node_modules')) {
                                        let requestPath = result.replace(/\\/g, '/').replace(/\0/g, '');
                                        if (!_path.default.isAbsolute(request) && request.includes('/') && (resContext === null || resContext === void 0 ? void 0 : resContext.descriptionFileRoot)) {
                                            var ref;
                                            requestPath = (resContext.descriptionFileRoot + request.substr(((ref = getPkgName(request)) === null || ref === void 0 ? void 0 : ref.length) || 0) + _path.default.sep + 'package.json').replace(/\\/g, '/').replace(/\0/g, '');
                                        }
                                        const rootSeparatorIndex = requestPath.indexOf('/');
                                        let separatorIndex;
                                        while((separatorIndex = requestPath.lastIndexOf('/')) > rootSeparatorIndex){
                                            requestPath = requestPath.substr(0, separatorIndex);
                                            const curPackageJsonPath = `${requestPath}/package.json`;
                                            if (await job.isFile(curPackageJsonPath)) {
                                                await job.emitFile(curPackageJsonPath, 'resolve', parent);
                                            }
                                        }
                                    }
                                } catch (_err) {
                                // we failed to resolve the package.json boundary,
                                // we don't block emitting the initial asset from this
                                }
                                resolve([
                                    result,
                                    options.dependencyType === 'esm'
                                ]);
                            });
                        });
                    };
                };
                const CJS_RESOLVE_OPTIONS = {
                    ..._webpackConfig.NODE_RESOLVE_OPTIONS,
                    fullySpecified: undefined,
                    modules: undefined,
                    extensions: undefined
                };
                const BASE_CJS_RESOLVE_OPTIONS = {
                    ...CJS_RESOLVE_OPTIONS,
                    alias: false
                };
                const ESM_RESOLVE_OPTIONS = {
                    ..._webpackConfig.NODE_ESM_RESOLVE_OPTIONS,
                    fullySpecified: undefined,
                    modules: undefined,
                    extensions: undefined
                };
                const BASE_ESM_RESOLVE_OPTIONS = {
                    ...ESM_RESOLVE_OPTIONS,
                    alias: false
                };
                const doResolve = async (request, parent, job, isEsmRequested)=>{
                    const context = _path.default.dirname(parent);
                    // When in esm externals mode, and using import, we resolve with
                    // ESM resolving options.
                    const { res  } = await (0, _webpackConfig).resolveExternal(this.appDir, this.esmExternals, context, request, isEsmRequested, (options)=>(_, resRequest)=>{
                            return getResolve(options)(parent, resRequest, job);
                        }
                    , undefined, undefined, ESM_RESOLVE_OPTIONS, CJS_RESOLVE_OPTIONS, BASE_ESM_RESOLVE_OPTIONS, BASE_CJS_RESOLVE_OPTIONS);
                    if (!res) {
                        throw new Error(`failed to resolve ${request} from ${parent}`);
                    }
                    return res.replace(/\0/g, '');
                };
                this.tapfinishModules(compilation, traceEntrypointsPluginSpan, doResolve, readlink, stat);
            });
        });
    }
}
exports.TraceEntryPointsPlugin = TraceEntryPointsPlugin;

//# sourceMappingURL=next-trace-entrypoints-plugin.js.map