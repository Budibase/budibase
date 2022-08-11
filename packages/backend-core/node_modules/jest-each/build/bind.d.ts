/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Global } from '@jest/types';
export declare type EachTests = ReadonlyArray<{
    title: string;
    arguments: ReadonlyArray<unknown>;
}>;
declare type GlobalCallback = (testName: string, fn: Global.ConcurrentTestFn, timeout?: number) => void;
export default function bind<EachCallback extends Global.TestCallback>(cb: GlobalCallback, supportsDone?: boolean): (table: Global.EachTable, ...taggedTemplateData: Global.TemplateData) => (title: string, test: Global.EachTestFn<EachCallback>, timeout?: number | undefined) => void;
export {};
