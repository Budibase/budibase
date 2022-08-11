/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { CoverageMapData } from 'istanbul-lib-coverage';
export declare type ValidTestReturnValues = void | undefined;
declare type TestReturnValuePromise = Promise<unknown>;
declare type TestReturnValueGenerator = Generator<void, unknown, void>;
export declare type TestReturnValue = ValidTestReturnValues | TestReturnValuePromise;
export declare type TestContext = Record<string, unknown>;
export declare type DoneFn = (reason?: string | Error) => void;
export declare type DoneTakingTestFn = (this: TestContext | undefined, done: DoneFn) => ValidTestReturnValues;
export declare type PromiseReturningTestFn = (this: TestContext | undefined) => TestReturnValue;
export declare type GeneratorReturningTestFn = (this: TestContext | undefined) => TestReturnValueGenerator;
export declare type TestName = string;
export declare type TestFn = PromiseReturningTestFn | GeneratorReturningTestFn | DoneTakingTestFn;
export declare type ConcurrentTestFn = () => TestReturnValuePromise;
export declare type BlockFn = () => void;
export declare type BlockName = string;
export declare type HookFn = TestFn;
export declare type Col = unknown;
export declare type Row = ReadonlyArray<Col>;
export declare type Table = ReadonlyArray<Row>;
export declare type ArrayTable = Table | Row;
export declare type TemplateTable = TemplateStringsArray;
export declare type TemplateData = ReadonlyArray<unknown>;
export declare type EachTable = ArrayTable | TemplateTable;
export declare type TestCallback = BlockFn | TestFn | ConcurrentTestFn;
export declare type EachTestFn<EachCallback extends TestCallback> = (...args: ReadonlyArray<any>) => ReturnType<EachCallback>;
declare type Jasmine = {
    _DEFAULT_TIMEOUT_INTERVAL?: number;
    addMatchers: (matchers: Record<string, unknown>) => void;
};
declare type Each<EachCallback extends TestCallback> = ((table: EachTable, ...taggedTemplateData: TemplateData) => (name: BlockName | TestName, test: EachTestFn<EachCallback>, timeout?: number) => void) | (() => () => void);
export interface HookBase {
    (fn: HookFn, timeout?: number): void;
}
export interface ItBase {
    (testName: TestName, fn: TestFn, timeout?: number): void;
    each: Each<TestFn>;
}
export interface It extends ItBase {
    only: ItBase;
    skip: ItBase;
    todo: (testName: TestName) => void;
}
export interface ItConcurrentBase {
    (testName: TestName, testFn: ConcurrentTestFn, timeout?: number): void;
    each: Each<ConcurrentTestFn>;
}
export interface ItConcurrentExtended extends ItConcurrentBase {
    only: ItConcurrentBase;
    skip: ItConcurrentBase;
}
export interface ItConcurrent extends It {
    concurrent: ItConcurrentExtended;
}
export interface DescribeBase {
    (blockName: BlockName, blockFn: BlockFn): void;
    each: Each<BlockFn>;
}
export interface Describe extends DescribeBase {
    only: DescribeBase;
    skip: DescribeBase;
}
export interface TestFrameworkGlobals {
    it: ItConcurrent;
    test: ItConcurrent;
    fit: ItBase & {
        concurrent?: ItConcurrentBase;
    };
    xit: ItBase;
    xtest: ItBase;
    describe: Describe;
    xdescribe: DescribeBase;
    fdescribe: DescribeBase;
    beforeAll: HookBase;
    beforeEach: HookBase;
    afterEach: HookBase;
    afterAll: HookBase;
}
export interface GlobalAdditions extends TestFrameworkGlobals {
    __coverage__: CoverageMapData;
    jasmine: Jasmine;
    fail: () => void;
    pending: () => void;
    spyOn: () => void;
    spyOnProperty: () => void;
}
export interface Global extends GlobalAdditions, Omit<typeof globalThis, keyof GlobalAdditions> {
    [extras: string]: unknown;
}
export {};
