/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import { BaseWatchPlugin, JestHookSubscriber, UpdateConfigCallback, UsageData } from 'jest-watcher';
export default class FailedTestsInteractivePlugin extends BaseWatchPlugin {
    private _failedTestAssertions?;
    private readonly _manager;
    apply(hooks: JestHookSubscriber): void;
    getUsageInfo(): UsageData | null;
    onKey(key: string): void;
    run(_: Config.GlobalConfig, updateConfigAndRun: UpdateConfigCallback): Promise<void>;
    private getFailedTestAssertions;
}
