/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { JestEnvironment } from '@jest/environment';
import { TestFileEvent, TestResult } from '@jest/test-result';
import type { Config, Global } from '@jest/types';
import { SnapshotStateType } from 'jest-snapshot';
import globals from '..';
import { Expect } from './jestExpect';
declare type Process = NodeJS.Process;
interface JestGlobals extends Global.TestFrameworkGlobals {
    expect: Expect;
}
export declare const initialize: ({ config, environment, globalConfig, localRequire, parentProcess, sendMessageToJest, setGlobalsForRuntime, testPath, }: {
    config: Config.ProjectConfig;
    environment: JestEnvironment;
    globalConfig: Config.GlobalConfig;
    localRequire: <T = unknown>(path: Config.Path) => T;
    testPath: Config.Path;
    parentProcess: Process;
    sendMessageToJest?: TestFileEvent<"test-file-start" | "test-file-success" | "test-file-failure" | "test-case-result"> | undefined;
    setGlobalsForRuntime: (globals: JestGlobals) => void;
}) => Promise<{
    globals: Global.TestFrameworkGlobals;
    snapshotState: SnapshotStateType;
}>;
export declare const runAndTransformResultsToJestFormat: ({ config, globalConfig, testPath, }: {
    config: Config.ProjectConfig;
    globalConfig: Config.GlobalConfig;
    testPath: string;
}) => Promise<TestResult>;
export {};
