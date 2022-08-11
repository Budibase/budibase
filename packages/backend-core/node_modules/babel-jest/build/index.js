'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _crypto() {
  const data = require('crypto');

  _crypto = function () {
    return data;
  };

  return data;
}

function path() {
  const data = _interopRequireWildcard(require('path'));

  path = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require('@babel/core');

  _core = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require('chalk'));

  _chalk = function () {
    return data;
  };

  return data;
}

function fs() {
  const data = _interopRequireWildcard(require('graceful-fs'));

  fs = function () {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require('slash'));

  _slash = function () {
    return data;
  };

  return data;
}

var _loadBabelConfig = require('./loadBabelConfig');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const THIS_FILE = fs().readFileSync(__filename);

const jestPresetPath = require.resolve('babel-preset-jest');

const babelIstanbulPlugin = require.resolve('babel-plugin-istanbul');

function assertLoadedBabelConfig(babelConfig, cwd, filename) {
  if (!babelConfig) {
    throw new Error(
      `babel-jest: Babel ignores ${_chalk().default.bold(
        (0, _slash().default)(path().relative(cwd, filename))
      )} - make sure to include the file in Jest's ${_chalk().default.bold(
        'transformIgnorePatterns'
      )} as well.`
    );
  }
}

function addIstanbulInstrumentation(babelOptions, transformOptions) {
  if (transformOptions.instrument) {
    const copiedBabelOptions = {...babelOptions};
    copiedBabelOptions.auxiliaryCommentBefore = ' istanbul ignore next '; // Copied from jest-runtime transform.js

    copiedBabelOptions.plugins = (copiedBabelOptions.plugins || []).concat([
      [
        babelIstanbulPlugin,
        {
          // files outside `cwd` will not be instrumented
          cwd: transformOptions.config.cwd,
          exclude: []
        }
      ]
    ]);
    return copiedBabelOptions;
  }

  return babelOptions;
}

function getCacheKeyFromConfig(
  sourceText,
  sourcePath,
  babelOptions,
  transformOptions
) {
  const {config, configString, instrument} = transformOptions;
  const configPath = [babelOptions.config || '', babelOptions.babelrc || ''];
  return (0, _crypto().createHash)('md5')
    .update(THIS_FILE)
    .update('\0', 'utf8')
    .update(JSON.stringify(babelOptions.options))
    .update('\0', 'utf8')
    .update(sourceText)
    .update('\0', 'utf8')
    .update(path().relative(config.rootDir, sourcePath))
    .update('\0', 'utf8')
    .update(configString)
    .update('\0', 'utf8')
    .update(configPath.join(''))
    .update('\0', 'utf8')
    .update(instrument ? 'instrument' : '')
    .update('\0', 'utf8')
    .update(process.env.NODE_ENV || '')
    .update('\0', 'utf8')
    .update(process.env.BABEL_ENV || '')
    .update('\0', 'utf8')
    .update(process.version)
    .digest('hex');
}

function loadBabelConfig(cwd, filename, transformOptions) {
  const babelConfig = (0, _loadBabelConfig.loadPartialConfig)(transformOptions);
  assertLoadedBabelConfig(babelConfig, cwd, filename);
  return babelConfig;
}

async function loadBabelConfigAsync(cwd, filename, transformOptions) {
  const babelConfig = await (0, _loadBabelConfig.loadPartialConfigAsync)(
    transformOptions
  );
  assertLoadedBabelConfig(babelConfig, cwd, filename);
  return babelConfig;
}

function loadBabelOptions(
  cwd,
  filename,
  transformOptions,
  jestTransformOptions
) {
  const {options} = loadBabelConfig(cwd, filename, transformOptions);
  return addIstanbulInstrumentation(options, jestTransformOptions);
}

async function loadBabelOptionsAsync(
  cwd,
  filename,
  transformOptions,
  jestTransformOptions
) {
  const {options} = await loadBabelConfigAsync(cwd, filename, transformOptions);
  return addIstanbulInstrumentation(options, jestTransformOptions);
}

const createTransformer = userOptions => {
  var _inputOptions$plugins, _inputOptions$presets;

  const inputOptions =
    userOptions !== null && userOptions !== void 0 ? userOptions : {};
  const options = {
    ...inputOptions,
    caller: {
      name: 'babel-jest',
      supportsDynamicImport: false,
      supportsExportNamespaceFrom: false,
      supportsStaticESM: false,
      supportsTopLevelAwait: false,
      ...inputOptions.caller
    },
    compact: false,
    plugins:
      (_inputOptions$plugins = inputOptions.plugins) !== null &&
      _inputOptions$plugins !== void 0
        ? _inputOptions$plugins
        : [],
    presets: ((_inputOptions$presets = inputOptions.presets) !== null &&
    _inputOptions$presets !== void 0
      ? _inputOptions$presets
      : []
    ).concat(jestPresetPath),
    sourceMaps: 'both'
  };

  function mergeBabelTransformOptions(filename, transformOptions) {
    var _transformOptions$sup,
      _transformOptions$sup2,
      _transformOptions$sup3,
      _transformOptions$sup4;

    const {cwd} = transformOptions.config; // `cwd` first to allow incoming options to override it

    return {
      cwd,
      ...options,
      caller: {
        ...options.caller,
        supportsDynamicImport:
          (_transformOptions$sup = transformOptions.supportsDynamicImport) !==
            null && _transformOptions$sup !== void 0
            ? _transformOptions$sup
            : options.caller.supportsDynamicImport,
        supportsExportNamespaceFrom:
          (_transformOptions$sup2 =
            transformOptions.supportsExportNamespaceFrom) !== null &&
          _transformOptions$sup2 !== void 0
            ? _transformOptions$sup2
            : options.caller.supportsExportNamespaceFrom,
        supportsStaticESM:
          (_transformOptions$sup3 = transformOptions.supportsStaticESM) !==
            null && _transformOptions$sup3 !== void 0
            ? _transformOptions$sup3
            : options.caller.supportsStaticESM,
        supportsTopLevelAwait:
          (_transformOptions$sup4 = transformOptions.supportsTopLevelAwait) !==
            null && _transformOptions$sup4 !== void 0
            ? _transformOptions$sup4
            : options.caller.supportsTopLevelAwait
      },
      filename
    };
  }

  return {
    canInstrument: true,

    getCacheKey(sourceText, sourcePath, transformOptions) {
      const babelOptions = loadBabelConfig(
        transformOptions.config.cwd,
        sourcePath,
        mergeBabelTransformOptions(sourcePath, transformOptions)
      );
      return getCacheKeyFromConfig(
        sourceText,
        sourcePath,
        babelOptions,
        transformOptions
      );
    },

    async getCacheKeyAsync(sourceText, sourcePath, transformOptions) {
      const babelOptions = await loadBabelConfigAsync(
        transformOptions.config.cwd,
        sourcePath,
        mergeBabelTransformOptions(sourcePath, transformOptions)
      );
      return getCacheKeyFromConfig(
        sourceText,
        sourcePath,
        babelOptions,
        transformOptions
      );
    },

    process(sourceText, sourcePath, transformOptions) {
      const babelOptions = loadBabelOptions(
        transformOptions.config.cwd,
        sourcePath,
        mergeBabelTransformOptions(sourcePath, transformOptions),
        transformOptions
      );
      const transformResult = (0, _core().transformSync)(
        sourceText,
        babelOptions
      );

      if (transformResult) {
        const {code, map} = transformResult;

        if (typeof code === 'string') {
          return {
            code,
            map
          };
        }
      }

      return sourceText;
    },

    async processAsync(sourceText, sourcePath, transformOptions) {
      const babelOptions = await loadBabelOptionsAsync(
        transformOptions.config.cwd,
        sourcePath,
        mergeBabelTransformOptions(sourcePath, transformOptions),
        transformOptions
      );
      const transformResult = await (0, _core().transformAsync)(
        sourceText,
        babelOptions
      );

      if (transformResult) {
        const {code, map} = transformResult;

        if (typeof code === 'string') {
          return {
            code,
            map
          };
        }
      }

      return sourceText;
    }
  };
};

const transformer = {
  ...createTransformer(),
  // Assigned here so only the exported transformer has `createTransformer`,
  // instead of all created transformers by the function
  createTransformer
};
var _default = transformer;
exports.default = _default;
