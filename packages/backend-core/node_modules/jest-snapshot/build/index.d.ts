/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import type { FS as HasteFS } from 'jest-haste-map';
import { SnapshotResolver as JestSnapshotResolver } from './SnapshotResolver';
import SnapshotState from './State';
import type { Context, ExpectationResult } from './types';
import * as utils from './utils';
declare const JestSnapshot: {
    EXTENSION: string;
    SnapshotState: typeof SnapshotState;
    addSerializer: (plugin: import("pretty-format").Plugin) => void;
    buildSnapshotResolver: (config: Config.ProjectConfig, localRequire?: ((module: string) => unknown) | Promise<(module: string) => unknown>) => Promise<JestSnapshotResolver>;
    cleanup: (hasteFS: HasteFS, update: Config.SnapshotUpdateState, snapshotResolver: JestSnapshotResolver, testPathIgnorePatterns?: string[] | undefined) => {
        filesRemoved: number;
        filesRemovedList: Array<string>;
    };
    getSerializers: () => import("pretty-format").Plugins;
    isSnapshotPath: (path: string) => boolean;
    toMatchInlineSnapshot: (this: Context, received: unknown, propertiesOrSnapshot?: string | object | undefined, inlineSnapshot?: string | undefined) => ExpectationResult;
    toMatchSnapshot: (this: Context, received: unknown, propertiesOrHint?: string | object | undefined, hint?: string | undefined) => ExpectationResult;
    toThrowErrorMatchingInlineSnapshot: (this: Context, received: unknown, inlineSnapshot?: string | undefined, fromPromise?: boolean | undefined) => ExpectationResult;
    toThrowErrorMatchingSnapshot: (this: Context, received: unknown, hint: string | undefined, fromPromise: boolean) => ExpectationResult;
    utils: typeof utils;
};
declare namespace JestSnapshot {
    type SnapshotResolver = JestSnapshotResolver;
    type SnapshotStateType = SnapshotState;
}
export = JestSnapshot;
