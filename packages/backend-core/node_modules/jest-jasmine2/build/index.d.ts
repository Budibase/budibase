/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { JestEnvironment } from '@jest/environment';
import type { TestResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import type Runtime from 'jest-runtime';
export type { Jasmine } from './types';
export default function jasmine2(globalConfig: Config.GlobalConfig, config: Config.ProjectConfig, environment: JestEnvironment, runtime: Runtime, testPath: string): Promise<TestResult>;
