/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Reporter } from '@jest/reporters';
import { AggregatedResult, Test } from '@jest/test-result';
import type { Config } from '@jest/types';
import type TestWatcher from './TestWatcher';
export declare type TestSchedulerOptions = {
    startRun: (globalConfig: Config.GlobalConfig) => void;
};
export declare type TestSchedulerContext = {
    firstRun: boolean;
    previousSuccess: boolean;
    changedFiles?: Set<Config.Path>;
    sourcesRelatedToTestsInChangedFiles?: Set<Config.Path>;
};
export declare function createTestScheduler(globalConfig: Config.GlobalConfig, options: TestSchedulerOptions, context: TestSchedulerContext): Promise<TestScheduler>;
declare class TestScheduler {
    private readonly _dispatcher;
    private readonly _globalConfig;
    private readonly _options;
    private readonly _context;
    constructor(globalConfig: Config.GlobalConfig, options: TestSchedulerOptions, context: TestSchedulerContext);
    addReporter(reporter: Reporter): void;
    removeReporter(ReporterClass: Function): void;
    scheduleTests(tests: Array<Test>, watcher: TestWatcher): Promise<AggregatedResult>;
    private _partitionTests;
    private _shouldAddDefaultReporters;
    _setupReporters(): Promise<void>;
    private _setupDefaultReporters;
    private _addCustomReporters;
    /**
     * Get properties of a reporter in an object
     * to make dealing with them less painful.
     */
    private _getReporterProps;
    private _bailIfNeeded;
}
export {};
