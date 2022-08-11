/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TestFileEvent, TestResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import Resolver from 'jest-resolve';
import type { TestRunnerContext } from './types';
export default function runTest(path: Config.Path, globalConfig: Config.GlobalConfig, config: Config.ProjectConfig, resolver: Resolver, context?: TestRunnerContext, sendMessageToJest?: TestFileEvent): Promise<TestResult>;
