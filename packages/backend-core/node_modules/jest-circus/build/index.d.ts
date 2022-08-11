/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Circus, Global } from '@jest/types';
export { setState, getState, resetState } from './state';
export { default as run } from './run';
declare type THook = (fn: Circus.HookFn, timeout?: number) => void;
declare const describe: {
    (blockName: Circus.BlockName, blockFn: Circus.BlockFn): void;
    each: (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<Global.TestCallback>, timeout?: number | undefined) => void;
    only: {
        (blockName: Circus.BlockName, blockFn: Circus.BlockFn): void;
        each: (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<Global.TestCallback>, timeout?: number | undefined) => void;
    };
    skip: {
        (blockName: Circus.BlockName, blockFn: Circus.BlockFn): void;
        each: (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<Global.TestCallback>, timeout?: number | undefined) => void;
    };
};
declare const beforeEach: THook;
declare const beforeAll: THook;
declare const afterEach: THook;
declare const afterAll: THook;
declare const test: Global.It;
declare const it: Global.It;
export declare type Event = Circus.Event;
export declare type State = Circus.State;
export { afterAll, afterEach, beforeAll, beforeEach, describe, it, test };
declare const _default: {
    afterAll: THook;
    afterEach: THook;
    beforeAll: THook;
    beforeEach: THook;
    describe: {
        (blockName: string, blockFn: Global.BlockFn): void;
        each: (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<Global.TestCallback>, timeout?: number | undefined) => void;
        only: {
            (blockName: string, blockFn: Global.BlockFn): void;
            each: (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<Global.TestCallback>, timeout?: number | undefined) => void;
        };
        skip: {
            (blockName: string, blockFn: Global.BlockFn): void;
            each: (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<Global.TestCallback>, timeout?: number | undefined) => void;
        };
    };
    it: Global.It;
    test: Global.It;
};
export default _default;
