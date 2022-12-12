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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsCompiler = void 0;
var path_1 = require("path");
var bs_logger_1 = require("bs-logger");
var lodash_memoize_1 = __importDefault(require("lodash.memoize"));
var constants_1 = require("../../constants");
var utils_1 = require("../../utils");
var messages_1 = require("../../utils/messages");
var compiler_utils_1 = require("./compiler-utils");
var TsCompiler = (function () {
    function TsCompiler(configSet, runtimeCacheFS) {
        var _a;
        var _this = this;
        this.configSet = configSet;
        this.runtimeCacheFS = runtimeCacheFS;
        this._projectVersion = 1;
        this._ts = configSet.compilerModule;
        this._logger = utils_1.rootLogger.child({ namespace: 'ts-compiler' });
        this._parsedTsConfig = this.configSet.parsedTsConfig;
        this._initialCompilerOptions = __assign({}, this._parsedTsConfig.options);
        this._compilerOptions = __assign({}, this._initialCompilerOptions);
        this._runtimeCacheFS = runtimeCacheFS;
        if (!this.configSet.isolatedModules) {
            this._fileContentCache = new Map();
            this._fileVersionCache = new Map();
            this._cachedReadFile = this._logger.wrap((_a = {
                    namespace: 'ts:serviceHost',
                    call: null
                },
                _a[bs_logger_1.LogContexts.logLevel] = bs_logger_1.LogLevels.trace,
                _a), 'readFile', (0, lodash_memoize_1.default)(this._ts.sys.readFile));
            this._moduleResolutionHost = {
                fileExists: (0, lodash_memoize_1.default)(this._ts.sys.fileExists),
                readFile: this._cachedReadFile,
                directoryExists: (0, lodash_memoize_1.default)(this._ts.sys.directoryExists),
                getCurrentDirectory: function () { return _this.configSet.cwd; },
                realpath: this._ts.sys.realpath && (0, lodash_memoize_1.default)(this._ts.sys.realpath),
                getDirectories: (0, lodash_memoize_1.default)(this._ts.sys.getDirectories),
            };
            this._moduleResolutionCache = this._ts.createModuleResolutionCache(this.configSet.cwd, function (x) { return x; }, this._compilerOptions);
            this._createLanguageService();
        }
    }
    TsCompiler.prototype.getResolvedModules = function (fileContent, fileName, runtimeCacheFS) {
        var _this = this;
        if (!this.runtimeCacheFS.size) {
            this._runtimeCacheFS = runtimeCacheFS;
        }
        this._logger.debug({ fileName: fileName }, 'getResolvedModules(): resolve direct imported module paths');
        var importedModulePaths = Array.from(new Set(this._getImportedModulePaths(fileContent, fileName)));
        this._logger.debug({ fileName: fileName }, 'getResolvedModules(): resolve nested imported module paths from directed imported module paths');
        importedModulePaths.forEach(function (importedModulePath) {
            var resolvedFileContent = _this._getFileContentFromCache(importedModulePath);
            importedModulePaths.push.apply(importedModulePaths, __spreadArray([], __read(_this._getImportedModulePaths(resolvedFileContent, importedModulePath).filter(function (modulePath) { return !importedModulePaths.includes(modulePath); })), false));
        });
        return importedModulePaths;
    };
    TsCompiler.prototype.getCompiledOutput = function (fileContent, fileName, options) {
        var moduleKind = this._initialCompilerOptions.module;
        var esModuleInterop = this._initialCompilerOptions.esModuleInterop;
        var allowSyntheticDefaultImports = this._initialCompilerOptions.allowSyntheticDefaultImports;
        var currentModuleKind = this._compilerOptions.module;
        if ((this.configSet.babelJestTransformer || (!this.configSet.babelJestTransformer && options.supportsStaticESM)) &&
            this.configSet.useESM) {
            moduleKind =
                !moduleKind ||
                    (moduleKind &&
                        ![this._ts.ModuleKind.ES2015, this._ts.ModuleKind.ES2020, this._ts.ModuleKind.ESNext].includes(moduleKind))
                    ? this._ts.ModuleKind.ESNext
                    : moduleKind;
            esModuleInterop = true;
            allowSyntheticDefaultImports = true;
        }
        else {
            moduleKind = this._ts.ModuleKind.CommonJS;
        }
        this._compilerOptions = __assign(__assign({}, this._compilerOptions), { allowSyntheticDefaultImports: allowSyntheticDefaultImports, esModuleInterop: esModuleInterop, module: moduleKind });
        if (this._languageService) {
            this._logger.debug({ fileName: fileName }, 'getCompiledOutput(): compiling using language service');
            this._updateMemoryCache(fileContent, fileName, currentModuleKind === moduleKind);
            var output = this._languageService.getEmitOutput(fileName);
            this._doTypeChecking(fileName, options.depGraphs, options.watchMode);
            if (output.emitSkipped) {
                if (constants_1.TS_TSX_REGEX.test(fileName)) {
                    throw new Error((0, messages_1.interpolate)("Unable to process '{{file}}', please make sure that `outDir` in your tsconfig is neither `''` or `'.'`. You can also configure Jest config option `transformIgnorePatterns` to inform `ts-jest` to transform {{file}}", { file: fileName }));
                }
                else {
                    this._logger.warn((0, messages_1.interpolate)("Unable to process '{{file}}', falling back to original file content. You can also configure Jest config option `transformIgnorePatterns` to ignore {{file}} from transformation or make sure that `outDir` in your tsconfig is neither `''` or `'.'`", { file: fileName }));
                    return {
                        code: fileContent,
                    };
                }
            }
            if (!output.outputFiles.length) {
                throw new TypeError((0, messages_1.interpolate)("Unable to require `.d.ts` file for file: {{file}}.\nThis is usually the result of a faulty configuration or import. Make sure there is a `.js`, `.json` or another executable extension available alongside `{{file}}`.", {
                    file: (0, path_1.basename)(fileName),
                }));
            }
            var outputFiles = output.outputFiles;
            return this._compilerOptions.sourceMap
                ? {
                    code: (0, compiler_utils_1.updateOutput)(outputFiles[1].text, fileName, outputFiles[0].text),
                }
                : {
                    code: (0, compiler_utils_1.updateOutput)(outputFiles[0].text, fileName),
                };
        }
        else {
            this._logger.debug({ fileName: fileName }, 'getCompiledOutput(): compiling as isolated module');
            var result = this._transpileOutput(fileContent, fileName);
            if (result.diagnostics && this.configSet.shouldReportDiagnostics(fileName)) {
                this.configSet.raiseDiagnostics(result.diagnostics, fileName, this._logger);
            }
            return {
                code: (0, compiler_utils_1.updateOutput)(result.outputText, fileName, result.sourceMapText),
            };
        }
    };
    TsCompiler.prototype._transpileOutput = function (fileContent, fileName) {
        return this._ts.transpileModule(fileContent, {
            fileName: fileName,
            transformers: this._makeTransformers(this.configSet.resolvedTransformers),
            compilerOptions: this._compilerOptions,
            reportDiagnostics: this.configSet.shouldReportDiagnostics(fileName),
        });
    };
    TsCompiler.prototype._makeTransformers = function (customTransformers) {
        var _this = this;
        return {
            before: customTransformers.before.map(function (beforeTransformer) {
                return beforeTransformer.factory(_this, beforeTransformer.options);
            }),
            after: customTransformers.after.map(function (afterTransformer) {
                return afterTransformer.factory(_this, afterTransformer.options);
            }),
            afterDeclarations: customTransformers.afterDeclarations.map(function (afterDeclarations) {
                return afterDeclarations.factory(_this, afterDeclarations.options);
            }),
        };
    };
    TsCompiler.prototype._createLanguageService = function () {
        var _this = this;
        this._parsedTsConfig.fileNames
            .filter(function (fileName) { return constants_1.TS_TSX_REGEX.test(fileName) && !_this.configSet.isTestFile(fileName); })
            .forEach(function (fileName) { return _this._fileVersionCache.set(fileName, 0); });
        var serviceHost = {
            getProjectVersion: function () { return String(_this._projectVersion); },
            getScriptFileNames: function () { return __spreadArray([], __read(_this._fileVersionCache.keys()), false); },
            getScriptVersion: function (fileName) {
                var normalizedFileName = (0, path_1.normalize)(fileName);
                var version = _this._fileVersionCache.get(normalizedFileName);
                return version === undefined ? undefined : String(version);
            },
            getScriptSnapshot: function (fileName) {
                var _a, _b, _c, _d;
                var normalizedFileName = (0, path_1.normalize)(fileName);
                var hit = _this._isFileInCache(normalizedFileName);
                _this._logger.trace({ normalizedFileName: normalizedFileName, cacheHit: hit }, 'getScriptSnapshot():', 'cache', hit ? 'hit' : 'miss');
                if (!hit) {
                    var fileContent = (_d = (_b = (_a = _this._fileContentCache.get(normalizedFileName)) !== null && _a !== void 0 ? _a : _this._runtimeCacheFS.get(normalizedFileName)) !== null && _b !== void 0 ? _b : (_c = _this._cachedReadFile) === null || _c === void 0 ? void 0 : _c.call(_this, normalizedFileName)) !== null && _d !== void 0 ? _d : undefined;
                    if (fileContent !== undefined) {
                        _this._fileContentCache.set(normalizedFileName, fileContent);
                        _this._fileVersionCache.set(normalizedFileName, 1);
                    }
                }
                var contents = _this._fileContentCache.get(normalizedFileName);
                if (contents === undefined)
                    return;
                return _this._ts.ScriptSnapshot.fromString(contents);
            },
            fileExists: (0, lodash_memoize_1.default)(this._ts.sys.fileExists),
            readFile: this._cachedReadFile,
            readDirectory: (0, lodash_memoize_1.default)(this._ts.sys.readDirectory),
            getDirectories: (0, lodash_memoize_1.default)(this._ts.sys.getDirectories),
            directoryExists: (0, lodash_memoize_1.default)(this._ts.sys.directoryExists),
            realpath: this._ts.sys.realpath && (0, lodash_memoize_1.default)(this._ts.sys.realpath),
            getNewLine: function () { return constants_1.LINE_FEED; },
            getCurrentDirectory: function () { return _this.configSet.cwd; },
            getCompilationSettings: function () { return _this._compilerOptions; },
            getDefaultLibFileName: function () { return _this._ts.getDefaultLibFilePath(_this._compilerOptions); },
            getCustomTransformers: function () { return _this._makeTransformers(_this.configSet.resolvedTransformers); },
            resolveModuleNames: function (moduleNames, containingFile) {
                return moduleNames.map(function (moduleName) { return _this._resolveModuleName(moduleName, containingFile).resolvedModule; });
            },
        };
        this._logger.debug('created language service');
        this._languageService = this._ts.createLanguageService(serviceHost, this._ts.createDocumentRegistry());
        this.program = this._languageService.getProgram();
    };
    TsCompiler.prototype._getFileContentFromCache = function (filePath) {
        var normalizedFilePath = (0, path_1.normalize)(filePath);
        var resolvedFileContent = this._runtimeCacheFS.get(normalizedFilePath);
        if (!resolvedFileContent) {
            resolvedFileContent = this._moduleResolutionHost.readFile(normalizedFilePath);
            this._runtimeCacheFS.set(normalizedFilePath, resolvedFileContent);
        }
        return resolvedFileContent;
    };
    TsCompiler.prototype._getImportedModulePaths = function (resolvedFileContent, containingFile) {
        var _this = this;
        return this._ts
            .preProcessFile(resolvedFileContent, true, true)
            .importedFiles.map(function (importedFile) {
            var resolvedModule = _this._resolveModuleName(importedFile.fileName, containingFile).resolvedModule;
            var resolvedFileName = resolvedModule === null || resolvedModule === void 0 ? void 0 : resolvedModule.resolvedFileName;
            return resolvedFileName && !(resolvedModule === null || resolvedModule === void 0 ? void 0 : resolvedModule.isExternalLibraryImport) ? resolvedFileName : '';
        })
            .filter(function (resolveFileName) { return !!resolveFileName; });
    };
    TsCompiler.prototype._resolveModuleName = function (moduleNameToResolve, containingFile) {
        return this._ts.resolveModuleName(moduleNameToResolve, containingFile, this._compilerOptions, this._moduleResolutionHost, this._moduleResolutionCache);
    };
    TsCompiler.prototype._isFileInCache = function (fileName) {
        return (this._fileContentCache.has(fileName) &&
            this._fileVersionCache.has(fileName) &&
            this._fileVersionCache.get(fileName) !== 0);
    };
    TsCompiler.prototype._updateMemoryCache = function (contents, fileName, isModuleKindTheSame) {
        if (isModuleKindTheSame === void 0) { isModuleKindTheSame = true; }
        this._logger.debug({ fileName: fileName }, 'updateMemoryCache: update memory cache for language service');
        var shouldIncrementProjectVersion = false;
        var hit = this._isFileInCache(fileName);
        if (!hit) {
            this._fileVersionCache.set(fileName, 1);
            shouldIncrementProjectVersion = true;
        }
        else {
            var prevVersion = this._fileVersionCache.get(fileName);
            var previousContents = this._fileContentCache.get(fileName);
            if (previousContents !== contents) {
                this._fileVersionCache.set(fileName, prevVersion + 1);
                this._fileContentCache.set(fileName, contents);
                shouldIncrementProjectVersion = true;
            }
            if (!this._parsedTsConfig.fileNames.includes(fileName) || !isModuleKindTheSame) {
                shouldIncrementProjectVersion = true;
            }
        }
        if (shouldIncrementProjectVersion)
            this._projectVersion++;
    };
    TsCompiler.prototype._doTypeChecking = function (fileName, depGraphs, watchMode) {
        var e_1, _a;
        if (this.configSet.shouldReportDiagnostics(fileName)) {
            this._logger.debug({ fileName: fileName }, '_doTypeChecking(): computing diagnostics using language service');
            var diagnostics = __spreadArray(__spreadArray([], __read(this._languageService.getSemanticDiagnostics(fileName)), false), __read(this._languageService.getSyntacticDiagnostics(fileName)), false);
            this.configSet.raiseDiagnostics(diagnostics, fileName, this._logger);
        }
        if (watchMode) {
            this._logger.debug({ fileName: fileName }, '_doTypeChecking(): starting watch mode computing diagnostics');
            try {
                for (var _b = __values(depGraphs.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var entry = _c.value;
                    var normalizedModuleNames = entry[1].resolvedModuleNames.map(function (moduleName) { return (0, path_1.normalize)(moduleName); });
                    var fileToReTypeCheck = entry[0];
                    if (normalizedModuleNames.includes(fileName) && this.configSet.shouldReportDiagnostics(fileToReTypeCheck)) {
                        this._logger.debug({ fileToReTypeCheck: fileToReTypeCheck }, '_doTypeChecking(): computing diagnostics using language service');
                        this._updateMemoryCache(this._getFileContentFromCache(fileToReTypeCheck), fileToReTypeCheck);
                        var importedModulesDiagnostics = __spreadArray(__spreadArray([], __read(this._languageService.getSemanticDiagnostics(fileToReTypeCheck)), false), __read(this._languageService.getSyntacticDiagnostics(fileToReTypeCheck)), false);
                        this.configSet.raiseDiagnostics(importedModulesDiagnostics, fileName, this._logger);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    return TsCompiler;
}());
exports.TsCompiler = TsCompiler;
