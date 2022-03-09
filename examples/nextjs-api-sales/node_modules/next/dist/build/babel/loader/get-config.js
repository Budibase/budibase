"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getConfig;
var _fs = require("fs");
var _json5 = _interopRequireDefault(require("next/dist/compiled/json5"));
var _core = require("next/dist/compiled/babel/core");
var _coreLibConfig = _interopRequireDefault(require("next/dist/compiled/babel/core-lib-config"));
var _util = require("./util");
var Log = _interopRequireWildcard(require("../../output/log"));
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
const nextDistPath = /(next[\\/]dist[\\/]shared[\\/]lib)|(next[\\/]dist[\\/]client)|(next[\\/]dist[\\/]pages)/;
const fileExtensionRegex = /\.([a-z]+)$/;
function getCacheCharacteristics(loaderOptions, source, filename) {
    var ref;
    const { isServer , pagesDir  } = loaderOptions;
    const isPageFile = filename.startsWith(pagesDir);
    const isNextDist = nextDistPath.test(filename);
    const hasModuleExports = source.indexOf('module.exports') !== -1;
    const fileExt = ((ref = fileExtensionRegex.exec(filename)) === null || ref === void 0 ? void 0 : ref[1]) || 'unknown';
    return {
        isServer,
        isPageFile,
        isNextDist,
        hasModuleExports,
        fileExt
    };
}
/**
 * Return an array of Babel plugins, conditioned upon loader options and
 * source file characteristics.
 */ function getPlugins(loaderOptions, cacheCharacteristics) {
    const { isServer , isPageFile , isNextDist , hasModuleExports  } = cacheCharacteristics;
    const { hasReactRefresh , development  } = loaderOptions;
    const applyCommonJsItem = hasModuleExports ? (0, _core).createConfigItem(require('../plugins/commonjs'), {
        type: 'plugin'
    }) : null;
    const reactRefreshItem = hasReactRefresh ? (0, _core).createConfigItem([
        require('next/dist/compiled/react-refresh/babel'),
        {
            skipEnvCheck: true
        }, 
    ], {
        type: 'plugin'
    }) : null;
    const pageConfigItem = !isServer && isPageFile ? (0, _core).createConfigItem([
        require('../plugins/next-page-config')
    ], {
        type: 'plugin'
    }) : null;
    const disallowExportAllItem = !isServer && isPageFile ? (0, _core).createConfigItem([
        require('../plugins/next-page-disallow-re-export-all-exports')
    ], {
        type: 'plugin'
    }) : null;
    const transformDefineItem = (0, _core).createConfigItem([
        require.resolve('next/dist/compiled/babel/plugin-transform-define'),
        {
            'process.env.NODE_ENV': development ? 'development' : 'production',
            'typeof window': isServer ? 'undefined' : 'object',
            'process.browser': isServer ? false : true
        },
        'next-js-transform-define-instance', 
    ], {
        type: 'plugin'
    });
    const nextSsgItem = !isServer && isPageFile ? (0, _core).createConfigItem([
        require.resolve('../plugins/next-ssg-transform')
    ], {
        type: 'plugin'
    }) : null;
    const commonJsItem = isNextDist ? (0, _core).createConfigItem(require('next/dist/compiled/babel/plugin-transform-modules-commonjs'), {
        type: 'plugin'
    }) : null;
    return [
        reactRefreshItem,
        pageConfigItem,
        disallowExportAllItem,
        applyCommonJsItem,
        transformDefineItem,
        nextSsgItem,
        commonJsItem, 
    ].filter(Boolean);
}
const isJsonFile = /\.(json|babelrc)$/;
const isJsFile = /\.js$/;
/**
 * While this function does block execution while reading from disk, it
 * should not introduce any issues.  The function is only invoked when
 * generating a fresh config, and only a small handful of configs should
 * be generated during compilation.
 */ function getCustomBabelConfig(configFilePath) {
    if (isJsonFile.exec(configFilePath)) {
        const babelConfigRaw = (0, _fs).readFileSync(configFilePath, 'utf8');
        return _json5.default.parse(babelConfigRaw);
    } else if (isJsFile.exec(configFilePath)) {
        return require(configFilePath);
    }
    throw new Error('The Next.js Babel loader does not support .mjs or .cjs config files.');
}
/**
 * Generate a new, flat Babel config, ready to be handed to Babel-traverse.
 * This config should have no unresolved overrides, presets, etc.
 */ function getFreshConfig(cacheCharacteristics, loaderOptions, target, filename, inputSourceMap) {
    let { isServer , pagesDir , development , hasJsxRuntime , configFile  } = loaderOptions;
    let customConfig = configFile ? getCustomBabelConfig(configFile) : undefined;
    let options = {
        babelrc: false,
        cloneInputAst: false,
        filename,
        inputSourceMap: inputSourceMap || undefined,
        // Set the default sourcemap behavior based on Webpack's mapping flag,
        // but allow users to override if they want.
        sourceMaps: loaderOptions.sourceMaps === undefined ? this.sourceMap : loaderOptions.sourceMaps,
        // Ensure that Webpack will get a full absolute path in the sourcemap
        // so that it can properly map the module back to its internal cached
        // modules.
        sourceFileName: filename,
        plugins: [
            ...getPlugins(loaderOptions, cacheCharacteristics),
            ...(customConfig === null || customConfig === void 0 ? void 0 : customConfig.plugins) || [], 
        ],
        // target can be provided in babelrc
        target: isServer ? undefined : customConfig === null || customConfig === void 0 ? void 0 : customConfig.target,
        // env can be provided in babelrc
        env: customConfig === null || customConfig === void 0 ? void 0 : customConfig.env,
        presets: (()=>{
            // If presets is defined the user will have next/babel in their babelrc
            if (customConfig === null || customConfig === void 0 ? void 0 : customConfig.presets) {
                return customConfig.presets;
            }
            // If presets is not defined the user will likely have "env" in their babelrc
            if (customConfig) {
                return undefined;
            }
            // If no custom config is provided the default is to use next/babel
            return [
                'next/babel'
            ];
        })(),
        overrides: loaderOptions.overrides,
        caller: {
            name: 'next-babel-turbo-loader',
            supportsStaticESM: true,
            supportsDynamicImport: true,
            // Provide plugins with insight into webpack target.
            // https://github.com/babel/babel-loader/issues/787
            target: target,
            // Webpack 5 supports TLA behind a flag. We enable it by default
            // for Babel, and then webpack will throw an error if the experimental
            // flag isn't enabled.
            supportsTopLevelAwait: true,
            isServer,
            pagesDir,
            isDev: development,
            hasJsxRuntime,
            ...loaderOptions.caller
        }
    };
    // Babel does strict checks on the config so undefined is not allowed
    if (typeof options.target === 'undefined') {
        delete options.target;
    }
    Object.defineProperty(options.caller, 'onWarning', {
        enumerable: false,
        writable: false,
        value: (reason)=>{
            if (!(reason instanceof Error)) {
                reason = new Error(reason);
            }
            this.emitWarning(reason);
        }
    });
    const loadedOptions = (0, _core).loadOptions(options);
    const config = (0, _util).consumeIterator((0, _coreLibConfig).default(loadedOptions));
    return config;
}
/**
 * Each key returned here corresponds with a Babel config that can be shared.
 * The conditions of permissible sharing between files is dependent on specific
 * file attributes and Next.js compiler states: `CharacteristicsGermaneToCaching`.
 */ function getCacheKey(cacheCharacteristics) {
    const { isServer , isPageFile , isNextDist , hasModuleExports , fileExt  } = cacheCharacteristics;
    const flags = 0 | (isServer ? 1 : 0) | (isPageFile ? 2 : 0) | (isNextDist ? 4 : 0) | (hasModuleExports ? 8 : 0);
    return fileExt + flags;
}
const configCache = new Map();
const configFiles = new Set();
function getConfig({ source , target , loaderOptions , filename , inputSourceMap  }) {
    const cacheCharacteristics = getCacheCharacteristics(loaderOptions, source, filename);
    if (loaderOptions.configFile) {
        // Ensures webpack invalidates the cache for this loader when the config file changes
        this.addDependency(loaderOptions.configFile);
    }
    const cacheKey = getCacheKey(cacheCharacteristics);
    if (configCache.has(cacheKey)) {
        const cachedConfig = configCache.get(cacheKey);
        return {
            ...cachedConfig,
            options: {
                ...cachedConfig.options,
                cwd: loaderOptions.cwd,
                root: loaderOptions.cwd,
                filename,
                sourceFileName: filename
            }
        };
    }
    if (loaderOptions.configFile && !configFiles.has(loaderOptions.configFile)) {
        configFiles.add(loaderOptions.configFile);
        Log.info(`Using external babel configuration from ${loaderOptions.configFile}`);
    }
    const freshConfig = getFreshConfig.call(this, cacheCharacteristics, loaderOptions, target, filename, inputSourceMap);
    configCache.set(cacheKey, freshConfig);
    return freshConfig;
}

//# sourceMappingURL=get-config.js.map