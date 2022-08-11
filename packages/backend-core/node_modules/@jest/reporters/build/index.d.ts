/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import getResultHeader from './getResultHeader';
export type { Config } from '@jest/types';
export type { AggregatedResult, SnapshotSummary, TestResult, } from '@jest/test-result';
export { default as BaseReporter } from './BaseReporter';
export { default as CoverageReporter } from './CoverageReporter';
export { default as DefaultReporter } from './DefaultReporter';
export { default as NotifyReporter } from './NotifyReporter';
export { default as SummaryReporter } from './SummaryReporter';
export { default as VerboseReporter } from './VerboseReporter';
export type { Context, Reporter, ReporterOnStartOptions, SummaryOptions, Test, } from './types';
export declare const utils: {
    formatTestPath: (config: import("@jest/types/build/Config").ProjectConfig | import("@jest/types/build/Config").GlobalConfig, testPath: string) => string;
    getResultHeader: typeof getResultHeader;
    getSummary: (aggregatedResults: import("@jest/test-result").AggregatedResult, options?: import("./types").SummaryOptions | undefined) => string;
    printDisplayName: (config: import("@jest/types/build/Config").ProjectConfig) => string;
    relativePath: (config: import("@jest/types/build/Config").ProjectConfig | import("@jest/types/build/Config").GlobalConfig, testPath: string) => {
        basename: string;
        dirname: string;
    };
    trimAndFormatPath: (pad: number, config: import("@jest/types/build/Config").ProjectConfig | import("@jest/types/build/Config").GlobalConfig, testPath: string, columns: number) => string;
};
