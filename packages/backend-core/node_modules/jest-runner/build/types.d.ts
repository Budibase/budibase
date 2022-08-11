/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Emittery = require('emittery');
import type { JestEnvironment } from '@jest/environment';
import type { SerializableError, Test, TestFileEvent, TestResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import type RuntimeType from 'jest-runtime';
export declare type ErrorWithCode = Error & {
    code?: string;
};
export declare type OnTestStart = (test: Test) => Promise<void>;
export declare type OnTestFailure = (test: Test, serializableError: SerializableError) => Promise<void>;
export declare type OnTestSuccess = (test: Test, testResult: TestResult) => Promise<void>;
export declare type TestFramework = (globalConfig: Config.GlobalConfig, config: Config.ProjectConfig, environment: JestEnvironment, runtime: RuntimeType, testPath: string, sendMessageToJest?: TestFileEvent) => Promise<TestResult>;
export declare type TestRunnerOptions = {
    serial: boolean;
};
export declare type TestRunnerContext = {
    changedFiles?: Set<Config.Path>;
    sourcesRelatedToTestsInChangedFiles?: Set<Config.Path>;
};
export declare type TestRunnerSerializedContext = {
    changedFiles?: Array<Config.Path>;
    sourcesRelatedToTestsInChangedFiles?: Array<Config.Path>;
};
declare type WatcherState = {
    interrupted: boolean;
};
export interface TestWatcher extends Emittery<{
    change: WatcherState;
}> {
    state: WatcherState;
    setState(state: WatcherState): void;
    isInterrupted(): boolean;
    isWatchMode(): boolean;
}
export {};
