/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Test } from '@jest/test-result';
import type { Config } from '@jest/types';
export declare function shouldRunInBand(tests: Array<Test>, timings: Array<number>, { detectOpenHandles, maxWorkers, watch, watchAll }: Config.GlobalConfig): boolean;
