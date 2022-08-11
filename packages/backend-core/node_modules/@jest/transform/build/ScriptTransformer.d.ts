/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import type { Options, ReducedTransformOptions, RequireAndTranspileModuleOptions, StringMap, TransformResult } from './types';
declare class ScriptTransformer {
    private readonly _config;
    private readonly _cacheFS;
    private readonly _cache;
    private readonly _transformCache;
    private _transformsAreLoaded;
    constructor(_config: Config.ProjectConfig, _cacheFS: StringMap);
    private _buildCacheKeyFromFileInfo;
    private _getCacheKey;
    private _getCacheKeyAsync;
    private _createFolderFromCacheKey;
    private _getFileCachePath;
    private _getFileCachePathAsync;
    private _getTransformPath;
    loadTransformers(): Promise<void>;
    private _getTransformer;
    private _instrumentFile;
    private _buildTransformResult;
    transformSource(filepath: Config.Path, content: string, options: ReducedTransformOptions): TransformResult;
    transformSourceAsync(filepath: Config.Path, content: string, options: ReducedTransformOptions): Promise<TransformResult>;
    private _transformAndBuildScriptAsync;
    private _transformAndBuildScript;
    transformAsync(filename: Config.Path, options: Options, fileSource?: string): Promise<TransformResult>;
    transform(filename: Config.Path, options: Options, fileSource?: string): TransformResult;
    transformJson(filename: Config.Path, options: Options, fileSource: string): string;
    requireAndTranspileModule<ModuleType = unknown>(moduleName: string, callback?: (module: ModuleType) => void | Promise<void>, options?: RequireAndTranspileModuleOptions): Promise<ModuleType>;
    shouldTransform(filename: Config.Path): boolean;
}
export declare function createTranspilingRequire(config: Config.ProjectConfig): Promise<(<TModuleType = unknown>(resolverPath: string, applyInteropRequireDefault?: boolean) => Promise<TModuleType>)>;
export declare type TransformerType = ScriptTransformer;
export declare function createScriptTransformer(config: Config.ProjectConfig, cacheFS?: StringMap): Promise<TransformerType>;
export {};
