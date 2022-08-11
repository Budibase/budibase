/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { AggregatedResult, AssertionLocation } from '@jest/test-result';
declare type RunnerUpdateFunction = (failure?: AssertionLocation) => void;
export default class FailedTestsInteractiveMode {
    private _pipe;
    private _isActive;
    private _countPaths;
    private _skippedNum;
    private _testAssertions;
    private _updateTestRunnerConfig?;
    constructor(_pipe: NodeJS.WritableStream);
    isActive(): boolean;
    put(key: string): void;
    run(failedTestAssertions: Array<AssertionLocation>, updateConfig: RunnerUpdateFunction): void;
    updateWithResults(results: AggregatedResult): void;
    private _clearTestSummary;
    private _drawUIDone;
    private _drawUIDoneWithSkipped;
    private _drawUIProgress;
    private _drawUIOverlay;
    private _run;
    private abort;
    private restart;
}
export {};
