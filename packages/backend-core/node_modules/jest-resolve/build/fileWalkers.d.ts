/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
export declare function clearFsCache(): void;
export declare type PkgJson = Record<string, unknown>;
export declare function readPackageCached(path: Config.Path): PkgJson;
export declare function findClosestPackageJson(start: Config.Path): Config.Path | undefined;
export declare function isFile(file: Config.Path): boolean;
export declare function isDirectory(dir: Config.Path): boolean;
export declare function realpathSync(file: Config.Path): Config.Path;
