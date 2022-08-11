/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
/**
 * Finds the test environment to use:
 *
 * 1. looks for jest-environment-<name> relative to project.
 * 1. looks for jest-environment-<name> relative to Jest.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to Jest.
 */
export declare const resolveTestEnvironment: ({ rootDir, testEnvironment: filePath, requireResolveFunction, }: {
    rootDir: Config.Path;
    testEnvironment: string;
    requireResolveFunction?: ((moduleName: string) => string) | undefined;
}) => string;
/**
 * Finds the watch plugins to use:
 *
 * 1. looks for jest-watch-<name> relative to project.
 * 1. looks for jest-watch-<name> relative to Jest.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to Jest.
 */
export declare const resolveWatchPlugin: (resolver: string | undefined | null, { filePath, rootDir, requireResolveFunction, }: {
    filePath: string;
    rootDir: Config.Path;
    requireResolveFunction?: ((moduleName: string) => string) | undefined;
}) => string;
/**
 * Finds the runner to use:
 *
 * 1. looks for jest-runner-<name> relative to project.
 * 1. looks for jest-runner-<name> relative to Jest.
 * 1. looks for <name> relative to project.
 * 1. looks for <name> relative to Jest.
 */
export declare const resolveRunner: (resolver: string | undefined | null, { filePath, rootDir, requireResolveFunction, }: {
    filePath: string;
    rootDir: Config.Path;
    requireResolveFunction?: ((moduleName: string) => string) | undefined;
}) => string;
export declare const resolveSequencer: (resolver: string | undefined | null, { filePath, rootDir, requireResolveFunction, }: {
    filePath: string;
    rootDir: Config.Path;
    requireResolveFunction?: ((moduleName: string) => string) | undefined;
}) => string;
