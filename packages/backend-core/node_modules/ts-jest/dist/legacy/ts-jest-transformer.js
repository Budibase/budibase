"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsJestTransformer = exports.CACHE_KEY_EL_SEPARATOR = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var importer_1 = require("../utils/importer");
var messages_1 = require("../utils/messages");
var sha1_1 = require("../utils/sha1");
var version_checkers_1 = require("../utils/version-checkers");
var compiler_1 = require("./compiler");
var config_set_1 = require("./config/config-set");
exports.CACHE_KEY_EL_SEPARATOR = '\x00';
var TsJestTransformer = (function () {
    function TsJestTransformer() {
        this._depGraphs = new Map();
        this._watchMode = false;
        this._logger = utils_1.rootLogger.child({ namespace: 'ts-jest-transformer' });
        version_checkers_1.VersionCheckers.jest.warn();
        this.getCacheKey = this.getCacheKey.bind(this);
        this.getCacheKeyAsync = this.getCacheKeyAsync.bind(this);
        this.process = this.process.bind(this);
        this.processAsync = this.processAsync.bind(this);
        this._logger.debug('created new transformer');
        process.env.TS_JEST = '1';
    }
    TsJestTransformer.prototype._configsFor = function (transformOptions) {
        var config = transformOptions.config, cacheFS = transformOptions.cacheFS;
        var ccs = TsJestTransformer._cachedConfigSets.find(function (cs) { return cs.jestConfig.value === config; });
        var configSet;
        if (ccs) {
            this._transformCfgStr = ccs.transformerCfgStr;
            this._compiler = ccs.compiler;
            this._depGraphs = ccs.depGraphs;
            this._tsResolvedModulesCachePath = ccs.tsResolvedModulesCachePath;
            this._watchMode = ccs.watchMode;
            configSet = ccs.configSet;
        }
        else {
            var serializedJestCfg_1 = (0, utils_1.stringify)(config);
            var serializedCcs = TsJestTransformer._cachedConfigSets.find(function (cs) { return cs.jestConfig.serialized === serializedJestCfg_1; });
            if (serializedCcs) {
                serializedCcs.jestConfig.value = config;
                this._transformCfgStr = serializedCcs.transformerCfgStr;
                this._compiler = serializedCcs.compiler;
                this._depGraphs = serializedCcs.depGraphs;
                this._tsResolvedModulesCachePath = serializedCcs.tsResolvedModulesCachePath;
                this._watchMode = serializedCcs.watchMode;
                configSet = serializedCcs.configSet;
            }
            else {
                this._logger.info('no matching config-set found, creating a new one');
                configSet = this._createConfigSet(config);
                var jest_1 = __assign({}, config);
                jest_1.cacheDirectory = undefined;
                this._transformCfgStr = "".concat(new utils_1.JsonableValue(jest_1).serialized).concat(configSet.cacheSuffix);
                this._createCompiler(configSet, cacheFS);
                this._getFsCachedResolvedModules(configSet);
                this._watchMode = process.argv.includes('--watch');
                TsJestTransformer._cachedConfigSets.push({
                    jestConfig: new utils_1.JsonableValue(config),
                    configSet: configSet,
                    transformerCfgStr: this._transformCfgStr,
                    compiler: this._compiler,
                    depGraphs: this._depGraphs,
                    tsResolvedModulesCachePath: this._tsResolvedModulesCachePath,
                    watchMode: this._watchMode,
                });
            }
        }
        return configSet;
    };
    TsJestTransformer.prototype._createConfigSet = function (config) {
        return new config_set_1.ConfigSet(config);
    };
    TsJestTransformer.prototype._createCompiler = function (configSet, cacheFS) {
        this._compiler = new compiler_1.TsJestCompiler(configSet, cacheFS);
    };
    TsJestTransformer.prototype.process = function (sourceText, sourcePath, transformOptions) {
        this._logger.debug({ fileName: sourcePath, transformOptions: transformOptions }, 'processing', sourcePath);
        var configs = this._configsFor(transformOptions);
        var shouldStringifyContent = configs.shouldStringifyContent(sourcePath);
        var babelJest = shouldStringifyContent ? undefined : configs.babelJestTransformer;
        var result = this.processWithTs(sourceText, sourcePath, transformOptions);
        if (babelJest) {
            this._logger.debug({ fileName: sourcePath }, 'calling babel-jest processor');
            result = babelJest.process(result.code, sourcePath, __assign(__assign({}, transformOptions), { instrument: false }));
        }
        result = this.runTsJestHook(sourcePath, sourceText, transformOptions, result);
        return result;
    };
    TsJestTransformer.prototype.processAsync = function (sourceText, sourcePath, transformOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._logger.debug({ fileName: sourcePath, transformOptions: transformOptions }, 'processing', sourcePath);
                return [2, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var configs, shouldStringifyContent, babelJest, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    configs = this._configsFor(transformOptions);
                                    shouldStringifyContent = configs.shouldStringifyContent(sourcePath);
                                    babelJest = shouldStringifyContent ? undefined : configs.babelJestTransformer;
                                    result = this.processWithTs(sourceText, sourcePath, transformOptions);
                                    if (!babelJest) return [3, 2];
                                    this._logger.debug({ fileName: sourcePath }, 'calling babel-jest processor');
                                    return [4, babelJest.processAsync(result.code, sourcePath, __assign(__assign({}, transformOptions), { instrument: false }))];
                                case 1:
                                    result = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    result = this.runTsJestHook(sourcePath, sourceText, transformOptions, result);
                                    resolve(result);
                                    return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    TsJestTransformer.prototype.processWithTs = function (sourceText, sourcePath, transformOptions) {
        var result;
        var configs = this._configsFor(transformOptions);
        var shouldStringifyContent = configs.shouldStringifyContent(sourcePath);
        var babelJest = shouldStringifyContent ? undefined : configs.babelJestTransformer;
        var isDefinitionFile = sourcePath.endsWith(constants_1.DECLARATION_TYPE_EXT);
        var isJsFile = constants_1.JS_JSX_REGEX.test(sourcePath);
        var isTsFile = !isDefinitionFile && constants_1.TS_TSX_REGEX.test(sourcePath);
        if (shouldStringifyContent) {
            result = {
                code: "module.exports=".concat((0, utils_1.stringify)(sourceText)),
            };
        }
        else if (isDefinitionFile) {
            result = {
                code: '',
            };
        }
        else if (!configs.parsedTsConfig.options.allowJs && isJsFile) {
            this._logger.warn({ fileName: sourcePath }, (0, messages_1.interpolate)("Got a `.js` file to compile while `allowJs` option is not set to `true` (file: {{path}}). To fix this:\n  - if you want TypeScript to process JS files, set `allowJs` to `true` in your TypeScript config (usually tsconfig.json)\n  - if you do not want TypeScript to process your `.js` files, in your Jest config change the `transform` key which value is `ts-jest` so that it does not match `.js` files anymore", { path: sourcePath }));
            result = {
                code: sourceText,
            };
        }
        else if (isJsFile || isTsFile) {
            result = this._compiler.getCompiledOutput(sourceText, sourcePath, {
                depGraphs: this._depGraphs,
                supportsStaticESM: transformOptions.supportsStaticESM,
                watchMode: this._watchMode,
            });
        }
        else {
            var message = babelJest ? "Got a unknown file type to compile (file: {{path}}). To fix this, in your Jest config change the `transform` key which value is `ts-jest` so that it does not match this kind of files anymore. If you still want Babel to process it, add another entry to the `transform` option with value `babel-jest` which key matches this type of files." : "Got a unknown file type to compile (file: {{path}}). To fix this, in your Jest config change the `transform` key which value is `ts-jest` so that it does not match this kind of files anymore.";
            this._logger.warn({ fileName: sourcePath }, (0, messages_1.interpolate)(message, { path: sourcePath }));
            result = {
                code: sourceText,
            };
        }
        return result;
    };
    TsJestTransformer.prototype.runTsJestHook = function (sourcePath, sourceText, transformOptions, compiledOutput) {
        var hooksFile = process.env.TS_JEST_HOOKS;
        var hooks;
        if (hooksFile) {
            hooksFile = path_1.default.resolve(this._configsFor(transformOptions).cwd, hooksFile);
            hooks = importer_1.importer.tryTheseOr(hooksFile, {});
        }
        if (hooks === null || hooks === void 0 ? void 0 : hooks.afterProcess) {
            this._logger.debug({ fileName: sourcePath, hookName: 'afterProcess' }, 'calling afterProcess hook');
            var newResult = hooks.afterProcess([sourceText, sourcePath, transformOptions.config, transformOptions], compiledOutput);
            if (newResult) {
                return newResult;
            }
        }
        return compiledOutput;
    };
    TsJestTransformer.prototype.getCacheKey = function (fileContent, filePath, transformOptions) {
        var _a;
        var configs = this._configsFor(transformOptions);
        this._logger.debug({ fileName: filePath, transformOptions: transformOptions }, 'computing cache key for', filePath);
        var _b = transformOptions.instrument, instrument = _b === void 0 ? false : _b;
        var constructingCacheKeyElements = [
            this._transformCfgStr,
            exports.CACHE_KEY_EL_SEPARATOR,
            configs.rootDir,
            exports.CACHE_KEY_EL_SEPARATOR,
            "instrument:".concat(instrument ? 'on' : 'off'),
            exports.CACHE_KEY_EL_SEPARATOR,
            fileContent,
            exports.CACHE_KEY_EL_SEPARATOR,
            filePath,
        ];
        if (!configs.isolatedModules && this._tsResolvedModulesCachePath) {
            var resolvedModuleNames = void 0;
            if (((_a = this._depGraphs.get(filePath)) === null || _a === void 0 ? void 0 : _a.fileContent) === fileContent) {
                this._logger.debug({ fileName: filePath, transformOptions: transformOptions }, 'getting resolved modules from disk caching or memory caching for', filePath);
                resolvedModuleNames = this._depGraphs
                    .get(filePath)
                    .resolvedModuleNames.filter(function (moduleName) { return (0, fs_1.existsSync)(moduleName); });
            }
            else {
                this._logger.debug({ fileName: filePath, transformOptions: transformOptions }, 'getting resolved modules from TypeScript API for', filePath);
                resolvedModuleNames = this._compiler.getResolvedModules(fileContent, filePath, transformOptions.cacheFS);
                this._depGraphs.set(filePath, {
                    fileContent: fileContent,
                    resolvedModuleNames: resolvedModuleNames,
                });
                (0, fs_1.writeFileSync)(this._tsResolvedModulesCachePath, (0, utils_1.stringify)(__spreadArray([], __read(this._depGraphs), false)));
            }
            resolvedModuleNames.forEach(function (moduleName) {
                constructingCacheKeyElements.push(exports.CACHE_KEY_EL_SEPARATOR, moduleName, exports.CACHE_KEY_EL_SEPARATOR, (0, fs_1.statSync)(moduleName).mtimeMs.toString());
            });
        }
        return sha1_1.sha1.apply(void 0, __spreadArray([], __read(constructingCacheKeyElements), false));
    };
    TsJestTransformer.prototype.getCacheKeyAsync = function (sourceText, sourcePath, transformOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve) { return resolve(_this.getCacheKey(sourceText, sourcePath, transformOptions)); })];
            });
        });
    };
    TsJestTransformer.prototype._getFsCachedResolvedModules = function (configSet) {
        var cacheDir = configSet.tsCacheDir;
        if (!configSet.isolatedModules && cacheDir) {
            (0, fs_1.mkdirSync)(cacheDir, { recursive: true });
            this._tsResolvedModulesCachePath = path_1.default.join(cacheDir, (0, sha1_1.sha1)('ts-jest-resolved-modules', exports.CACHE_KEY_EL_SEPARATOR));
            try {
                var cachedTSResolvedModules = (0, fs_1.readFileSync)(this._tsResolvedModulesCachePath, 'utf-8');
                this._depGraphs = new Map((0, utils_1.parse)(cachedTSResolvedModules));
            }
            catch (e) { }
        }
    };
    TsJestTransformer._cachedConfigSets = [];
    return TsJestTransformer;
}());
exports.TsJestTransformer = TsJestTransformer;
