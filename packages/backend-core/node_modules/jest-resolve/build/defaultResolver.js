'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = defaultResolver;

function _path() {
  const data = require('path');

  _path = function () {
    return data;
  };

  return data;
}

function _jestPnpResolver() {
  const data = _interopRequireDefault(require('jest-pnp-resolver'));

  _jestPnpResolver = function () {
    return data;
  };

  return data;
}

function _resolve() {
  const data = require('resolve');

  _resolve = function () {
    return data;
  };

  return data;
}

var _resolve2 = require('resolve.exports');

var _fileWalkers = require('./fileWalkers');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function defaultResolver(path, options) {
  // Yarn 2 adds support to `resolve` automatically so the pnpResolver is only
  // needed for Yarn 1 which implements version 1 of the pnp spec
  if (process.versions.pnp === '1') {
    return (0, _jestPnpResolver().default)(path, options);
  }

  const result = (0, _resolve().sync)(path, {
    ...options,
    isDirectory: _fileWalkers.isDirectory,
    isFile: _fileWalkers.isFile,
    packageFilter: createPackageFilter(
      options.conditions,
      options.packageFilter
    ),
    preserveSymlinks: false,
    readPackageSync,
    realpathSync: _fileWalkers.realpathSync
  }); // Dereference symlinks to ensure we don't create a separate
  // module instance depending on how it was referenced.

  return (0, _fileWalkers.realpathSync)(result);
}
/*
 * helper functions
 */

function readPackageSync(_, file) {
  return (0, _fileWalkers.readPackageCached)(file);
}

function createPackageFilter(conditions, userFilter) {
  function attemptExportsFallback(pkg) {
    const options = conditions
      ? {
          conditions,
          unsafe: true
        } // no conditions were passed - let's assume this is Jest internal and it should be `require`
      : {
          browser: false,
          require: true
        };

    try {
      return (0, _resolve2.resolve)(pkg, '.', options);
    } catch {
      return undefined;
    }
  }

  return function packageFilter(pkg, packageDir) {
    let filteredPkg = pkg;

    if (userFilter) {
      filteredPkg = userFilter(filteredPkg, packageDir);
    }

    if (filteredPkg.main != null) {
      return filteredPkg;
    }

    const indexInRoot = (0, _path().resolve)(packageDir, './index.js'); // if the module contains an `index.js` file in root, `resolve` will request
    // that if there is no `main`. Since we don't wanna break that, add this
    // check

    if ((0, _fileWalkers.isFile)(indexInRoot)) {
      return filteredPkg;
    }

    return {...filteredPkg, main: attemptExportsFallback(filteredPkg)};
  };
}
