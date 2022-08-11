/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
export default function requireOrImportModule<T>(filePath: Config.Path, applyInteropRequireDefault?: boolean): Promise<T>;
