"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var path = _interopRequireWildcard(require("path"));
var _webpack = require("next/dist/compiled/webpack/webpack");
var _pLimit = _interopRequireDefault(require("next/dist/compiled/p-limit"));
var _jestWorker = require("next/dist/compiled/jest-worker");
var _profilingPlugin = require("../../profiling-plugin");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function getEcmaVersion(environment) {
    // ES 6th
    if (environment.arrowFunction || environment.const || environment.destructuring || environment.forOf || environment.module) {
        return 2015;
    }
    // ES 11th
    if (environment.bigIntLiteral || environment.dynamicImport) {
        return 2020;
    }
    return 5;
}
function buildError(error, file) {
    if (error.line) {
        return new Error(`${file} from Terser\n${error.message} [${file}:${error.line},${error.col}]${error.stack ? `\n${error.stack.split('\n').slice(1).join('\n')}` : ''}`);
    }
    if (error.stack) {
        return new Error(`${file} from Terser\n${error.message}\n${error.stack}`);
    }
    return new Error(`${file} from Terser\n${error.message}`);
}
const debugMinify = process.env.NEXT_DEBUG_MINIFY;
class TerserPlugin {
    constructor(options = {
    }){
        const { terserOptions ={
        } , parallel , swcMinify  } = options;
        this.options = {
            swcMinify,
            parallel,
            terserOptions
        };
    }
    async optimize(compiler, compilation, assets, optimizeOptions, cache, { SourceMapSource , RawSource  }) {
        const compilationSpan = _profilingPlugin.spans.get(compilation) || _profilingPlugin.spans.get(compiler);
        const terserSpan = compilationSpan.traceChild('terser-webpack-plugin-optimize');
        terserSpan.setAttribute('compilationName', compilation.name);
        return terserSpan.traceAsyncFn(async ()=>{
            let numberOfAssetsForMinify = 0;
            const assetsList = Object.keys(assets);
            const assetsForMinify = await Promise.all(assetsList.filter((name)=>{
                if (!_webpack.ModuleFilenameHelpers.matchObject.bind(// eslint-disable-next-line no-undefined
                undefined, {
                    test: /\.[cm]?js(\?.*)?$/i
                })(name)) {
                    return false;
                }
                const res = compilation.getAsset(name);
                if (!res) {
                    console.log(name);
                    return false;
                }
                // don't minify _middleware as it can break in some cases
                // and doesn't provide too much of a benefit as it's server-side
                if (name.match(/(middleware-runtime\.js|middleware-chunks|_middleware\.js$)/)) {
                    return false;
                }
                const { info  } = res;
                // Skip double minimize assets from child compilation
                if (info.minimized) {
                    return false;
                }
                return true;
            }).map(async (name)=>{
                const { info , source  } = compilation.getAsset(name);
                const eTag = cache.getLazyHashedEtag(source);
                const output = await cache.getPromise(name, eTag);
                if (!output) {
                    numberOfAssetsForMinify += 1;
                }
                if (debugMinify && debugMinify === '1') {
                    console.dir({
                        name,
                        source: source.source().toString()
                    }, {
                        breakLength: Infinity,
                        maxStringLength: Infinity
                    });
                }
                return {
                    name,
                    info,
                    inputSource: source,
                    output,
                    eTag
                };
            }));
            const numberOfWorkers = Math.min(numberOfAssetsForMinify, optimizeOptions.availableNumberOfCores);
            let initializedWorker;
            // eslint-disable-next-line consistent-return
            const getWorker = ()=>{
                if (this.options.swcMinify) {
                    return {
                        minify: async (options)=>{
                            const result = await require('../../../../swc').minify(options.input, {
                                ...options.inputSourceMap ? {
                                    sourceMap: {
                                        content: JSON.stringify(options.inputSourceMap)
                                    }
                                } : {
                                },
                                compress: true,
                                mangle: true
                            });
                            return result;
                        }
                    };
                }
                if (initializedWorker) {
                    return initializedWorker;
                }
                initializedWorker = new _jestWorker.Worker(path.join(__dirname, './minify.js'), {
                    numWorkers: numberOfWorkers,
                    enableWorkerThreads: true
                });
                initializedWorker.getStdout().pipe(process.stdout);
                initializedWorker.getStderr().pipe(process.stderr);
                return initializedWorker;
            };
            const limit = (0, _pLimit).default(// When using the SWC minifier the limit will be handled by Node.js
            this.options.swcMinify ? Infinity : numberOfAssetsForMinify > 0 ? numberOfWorkers : Infinity);
            const scheduledTasks = [];
            for (const asset of assetsForMinify){
                scheduledTasks.push(limit(async ()=>{
                    const { name , inputSource , info , eTag  } = asset;
                    let { output  } = asset;
                    const minifySpan = terserSpan.traceChild('minify-js');
                    minifySpan.setAttribute('name', name);
                    minifySpan.setAttribute('cache', typeof output === 'undefined' ? 'MISS' : 'HIT');
                    return minifySpan.traceAsyncFn(async ()=>{
                        if (!output) {
                            const { source: sourceFromInputSource , map: inputSourceMap  } = inputSource.sourceAndMap();
                            const input = Buffer.isBuffer(sourceFromInputSource) ? sourceFromInputSource.toString() : sourceFromInputSource;
                            const options = {
                                name,
                                input,
                                inputSourceMap,
                                terserOptions: {
                                    ...this.options.terserOptions
                                }
                            };
                            if (typeof options.terserOptions.module === 'undefined') {
                                if (typeof info.javascriptModule !== 'undefined') {
                                    options.terserOptions.module = info.javascriptModule;
                                } else if (/\.mjs(\?.*)?$/i.test(name)) {
                                    options.terserOptions.module = true;
                                } else if (/\.cjs(\?.*)?$/i.test(name)) {
                                    options.terserOptions.module = false;
                                }
                            }
                            try {
                                output = await getWorker().minify(options);
                            } catch (error) {
                                compilation.errors.push(buildError(error, name));
                                return;
                            }
                            if (output.map) {
                                output.source = new SourceMapSource(output.code, name, output.map, input, /** @type {SourceMapRawSourceMap} */ (inputSourceMap), true);
                            } else {
                                output.source = new RawSource(output.code);
                            }
                            await cache.storePromise(name, eTag, {
                                source: output.source
                            });
                        }
                        /** @type {AssetInfo} */ const newInfo = {
                            minimized: true
                        };
                        const { source  } = output;
                        compilation.updateAsset(name, source, newInfo);
                    });
                }));
            }
            await Promise.all(scheduledTasks);
            if (initializedWorker) {
                await initializedWorker.end();
            }
        });
    }
    /**
   * @param {Compiler} compiler
   * @returns {void}
   */ apply(compiler) {
        var ref;
        const { SourceMapSource , RawSource  } = (compiler === null || compiler === void 0 ? void 0 : (ref = compiler.webpack) === null || ref === void 0 ? void 0 : ref.sources) || _webpack.sources;
        const { output  } = compiler.options;
        if (typeof this.options.terserOptions.ecma === 'undefined') {
            this.options.terserOptions.ecma = getEcmaVersion(output.environment || {
            });
        }
        const pluginName = this.constructor.name;
        const availableNumberOfCores = this.options.parallel;
        compiler.hooks.thisCompilation.tap(pluginName, (compilation)=>{
            const cache = compilation.getCache('TerserWebpackPlugin');
            const handleHashForChunk = (hash, chunk)=>{
                // increment 'c' to invalidate cache
                hash.update('c');
            };
            const JSModulesHooks = _webpack.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);
            JSModulesHooks.chunkHash.tap(pluginName, (chunk, hash)=>{
                if (!chunk.hasRuntime()) return;
                return handleHashForChunk(hash, chunk);
            });
            compilation.hooks.processAssets.tapPromise({
                name: pluginName,
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
            }, (assets)=>this.optimize(compiler, compilation, assets, {
                    availableNumberOfCores
                }, cache, {
                    SourceMapSource,
                    RawSource
                })
            );
            compilation.hooks.statsPrinter.tap(pluginName, (stats)=>{
                stats.hooks.print.for('asset.info.minimized').tap('terser-webpack-plugin', (minimized, { green , formatFlag  })=>// eslint-disable-next-line no-undefined
                    minimized ? green(formatFlag('minimized')) : undefined
                );
            });
        });
    }
}
exports.TerserPlugin = TerserPlugin;

//# sourceMappingURL=index.js.map