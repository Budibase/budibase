/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { AssertionResult } from '@jest/test-result';
import type { Circus } from '@jest/types';
export declare const makeDescribe: (name: Circus.BlockName, parent?: Circus.DescribeBlock | undefined, mode?: void | "skip" | "only" | "todo" | undefined) => Circus.DescribeBlock;
export declare const makeTest: (fn: Circus.TestFn, mode: Circus.TestMode, name: Circus.TestName, parent: Circus.DescribeBlock, timeout: number | undefined, asyncError: Circus.Exception) => Circus.TestEntry;
declare type DescribeHooks = {
    beforeAll: Array<Circus.Hook>;
    afterAll: Array<Circus.Hook>;
};
export declare const getAllHooksForDescribe: (describe: Circus.DescribeBlock) => DescribeHooks;
declare type TestHooks = {
    beforeEach: Array<Circus.Hook>;
    afterEach: Array<Circus.Hook>;
};
export declare const getEachHooksForTest: (test: Circus.TestEntry) => TestHooks;
export declare const describeBlockHasTests: (describe: Circus.DescribeBlock) => boolean;
export declare const callAsyncCircusFn: (testOrHook: Circus.TestEntry | Circus.Hook, testContext: Circus.TestContext | undefined, { isHook, timeout }: {
    isHook: boolean;
    timeout: number;
}) => Promise<unknown>;
export declare const getTestDuration: (test: Circus.TestEntry) => number | null;
export declare const makeRunResult: (describeBlock: Circus.DescribeBlock, unhandledErrors: Array<Error>) => Circus.RunResult;
export declare const makeSingleTestResult: (test: Circus.TestEntry) => Circus.TestResult;
export declare const getTestID: (test: Circus.TestEntry) => string;
export declare const addErrorToEachTestUnderDescribe: (describeBlock: Circus.DescribeBlock, error: Circus.Exception, asyncError: Circus.Exception) => void;
export declare function invariant(condition: unknown, message?: string): asserts condition;
export declare const parseSingleTestResult: (testResult: Circus.TestResult) => AssertionResult;
export {};
