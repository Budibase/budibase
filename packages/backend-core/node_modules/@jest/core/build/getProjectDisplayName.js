'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = getProjectDisplayName;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getProjectDisplayName(projectConfig) {
  var _projectConfig$displa;

  return (
    ((_projectConfig$displa = projectConfig.displayName) === null ||
    _projectConfig$displa === void 0
      ? void 0
      : _projectConfig$displa.name) || undefined
  );
}
