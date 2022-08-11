/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { Context } from 'vm';
import type { EnvironmentContext, JestEnvironment } from '@jest/environment';
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers';
import type { Config, Global } from '@jest/types';
import { ModuleMocker } from 'jest-mock';
declare type Win = Window & Global.Global & {
    Error: {
        stackTraceLimit: number;
    };
};
declare class JSDOMEnvironment implements JestEnvironment<number> {
    private dom;
    fakeTimers: LegacyFakeTimers<number> | null;
    fakeTimersModern: ModernFakeTimers | null;
    global: Win;
    private errorEventListener;
    moduleMocker: ModuleMocker | null;
    constructor(config: Config.ProjectConfig, options?: EnvironmentContext);
    setup(): Promise<void>;
    teardown(): Promise<void>;
    getVmContext(): Context | null;
}
export = JSDOMEnvironment;
