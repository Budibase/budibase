/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { RawSourceMap } from 'source-map';
import type { Config, TransformTypes } from '@jest/types';
export interface ShouldInstrumentOptions extends Pick<Config.GlobalConfig, 'collectCoverage' | 'collectCoverageFrom' | 'collectCoverageOnlyFrom' | 'coverageProvider'> {
    changedFiles?: Set<Config.Path>;
    sourcesRelatedToTestsInChangedFiles?: Set<Config.Path>;
}
export interface Options extends ShouldInstrumentOptions, CallerTransformOptions {
    isInternalModule?: boolean;
}
interface FixedRawSourceMap extends Omit<RawSourceMap, 'version'> {
    version: number;
}
export declare type TransformedSource = {
    code: string;
    map?: FixedRawSourceMap | string | null;
} | string;
export declare type TransformResult = TransformTypes.TransformResult;
export interface CallerTransformOptions {
    supportsDynamicImport: boolean;
    supportsExportNamespaceFrom: boolean;
    supportsStaticESM: boolean;
    supportsTopLevelAwait: boolean;
}
export interface ReducedTransformOptions extends CallerTransformOptions {
    instrument: boolean;
}
export interface RequireAndTranspileModuleOptions extends ReducedTransformOptions {
    applyInteropRequireDefault: boolean;
}
export declare type StringMap = Map<string, string>;
export interface TransformOptions<OptionType = unknown> extends ReducedTransformOptions {
    /** a cached file system which is used in jest-runtime - useful to improve performance */
    cacheFS: StringMap;
    config: Config.ProjectConfig;
    /** A stringified version of the configuration - useful in cache busting */
    configString: string;
    /** the options passed through Jest's config by the user */
    transformerConfig: OptionType;
}
export interface SyncTransformer<OptionType = unknown> {
    /**
     * Indicates if the transformer is capable of instrumenting the code for code coverage.
     *
     * If V8 coverage is _not_ active, and this is `true`, Jest will assume the code is instrumented.
     * If V8 coverage is _not_ active, and this is `false`. Jest will instrument the code returned by this transformer using Babel.
     */
    canInstrument?: boolean;
    createTransformer?: (options?: OptionType) => SyncTransformer<OptionType>;
    getCacheKey?: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => string;
    getCacheKeyAsync?: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => Promise<string>;
    process: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => TransformedSource;
    processAsync?: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => Promise<TransformedSource>;
}
export interface AsyncTransformer<OptionType = unknown> {
    /**
     * Indicates if the transformer is capable of instrumenting the code for code coverage.
     *
     * If V8 coverage is _not_ active, and this is `true`, Jest will assume the code is instrumented.
     * If V8 coverage is _not_ active, and this is `false`. Jest will instrument the code returned by this transformer using Babel.
     */
    canInstrument?: boolean;
    createTransformer?: (options?: OptionType) => AsyncTransformer<OptionType>;
    getCacheKey?: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => string;
    getCacheKeyAsync?: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => Promise<string>;
    process?: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => TransformedSource;
    processAsync: (sourceText: string, sourcePath: Config.Path, options: TransformOptions<OptionType>) => Promise<TransformedSource>;
}
export declare type Transformer<OptionType = unknown> = SyncTransformer<OptionType> | AsyncTransformer<OptionType>;
export {};
