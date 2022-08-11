/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { JestEnvironment } from '@jest/environment';
import type * as JestGlobals from '@jest/globals';
import type { SourceMapRegistry } from '@jest/source-map';
import type { V8CoverageResult } from '@jest/test-result';
import { CallerTransformOptions, ScriptTransformer, ShouldInstrumentOptions, shouldInstrument } from '@jest/transform';
import type { Config, Global } from '@jest/types';
import type { IModuleMap } from 'jest-haste-map';
import HasteMap from 'jest-haste-map';
import Resolver from 'jest-resolve';
import type { Context } from './types';
export type { Context } from './types';
interface JestGlobals extends Global.TestFrameworkGlobals {
    expect: typeof JestGlobals.expect;
}
declare type HasteMapOptions = {
    console?: Console;
    maxWorkers: number;
    resetCache: boolean;
    watch?: boolean;
    watchman: boolean;
};
interface InternalModuleOptions extends Required<CallerTransformOptions> {
    isInternalModule: boolean;
}
export default class Runtime {
    private readonly _cacheFS;
    private readonly _config;
    private readonly _coverageOptions;
    private _currentlyExecutingModulePath;
    private readonly _environment;
    private readonly _explicitShouldMock;
    private readonly _explicitShouldMockModule;
    private _fakeTimersImplementation;
    private readonly _internalModuleRegistry;
    private _isCurrentlyExecutingManualMock;
    private _mainModule;
    private readonly _mockFactories;
    private readonly _mockMetaDataCache;
    private _mockRegistry;
    private _isolatedMockRegistry;
    private _moduleMockRegistry;
    private readonly _moduleMockFactories;
    private readonly _moduleMocker;
    private _isolatedModuleRegistry;
    private _moduleRegistry;
    private readonly _esmoduleRegistry;
    private readonly _cjsNamedExports;
    private readonly _esmModuleLinkingMap;
    private readonly _testPath;
    private readonly _resolver;
    private _shouldAutoMock;
    private readonly _shouldMockModuleCache;
    private readonly _shouldUnmockTransitiveDependenciesCache;
    private readonly _sourceMapRegistry;
    private readonly _scriptTransformer;
    private readonly _fileTransforms;
    private readonly _fileTransformsMutex;
    private _v8CoverageInstrumenter;
    private _v8CoverageResult;
    private readonly _transitiveShouldMock;
    private _unmockList;
    private readonly _virtualMocks;
    private readonly _virtualModuleMocks;
    private _moduleImplementation?;
    private readonly jestObjectCaches;
    private jestGlobals?;
    private readonly esmConditions;
    private readonly cjsConditions;
    private isTornDown;
    constructor(config: Config.ProjectConfig, environment: JestEnvironment, resolver: Resolver, transformer: ScriptTransformer, cacheFS: Map<string, string>, coverageOptions: ShouldInstrumentOptions, testPath: Config.Path);
    static shouldInstrument: typeof shouldInstrument;
    static createContext(config: Config.ProjectConfig, options: {
        console?: Console;
        maxWorkers: number;
        watch?: boolean;
        watchman: boolean;
    }): Promise<Context>;
    static createHasteMap(config: Config.ProjectConfig, options?: HasteMapOptions): HasteMap;
    static createResolver(config: Config.ProjectConfig, moduleMap: IModuleMap): Resolver;
    static runCLI(): Promise<never>;
    static getCLIOptions(): never;
    unstable_shouldLoadAsEsm(path: Config.Path): boolean;
    private loadEsmModule;
    private resolveModule;
    private linkAndEvaluateModule;
    unstable_importModule(from: Config.Path, moduleName?: string): Promise<void>;
    private loadCjsAsEsm;
    private importMock;
    private getExportsOfCjs;
    requireModule<T = unknown>(from: Config.Path, moduleName?: string, options?: InternalModuleOptions, isRequireActual?: boolean): T;
    requireInternalModule<T = unknown>(from: Config.Path, to?: string): T;
    requireActual<T = unknown>(from: Config.Path, moduleName: string): T;
    requireMock<T = unknown>(from: Config.Path, moduleName: string): T;
    private _loadModule;
    private _getFullTransformationOptions;
    requireModuleOrMock<T = unknown>(from: Config.Path, moduleName: string): T;
    isolateModules(fn: () => void): void;
    resetModules(): void;
    collectV8Coverage(): Promise<void>;
    stopCollectingV8Coverage(): Promise<void>;
    getAllCoverageInfoCopy(): JestEnvironment['global']['__coverage__'];
    getAllV8CoverageInfoCopy(): V8CoverageResult;
    getSourceMaps(): SourceMapRegistry;
    setMock(from: string, moduleName: string, mockFactory: () => unknown, options?: {
        virtual?: boolean;
    }): void;
    private setModuleMock;
    restoreAllMocks(): void;
    resetAllMocks(): void;
    clearAllMocks(): void;
    teardown(): void;
    private _resolveModule;
    private _requireResolve;
    private _requireResolvePaths;
    private _execModule;
    private transformFile;
    private transformFileAsync;
    private createScriptFromCode;
    private _requireCoreModule;
    private _importCoreModule;
    private _getMockedNativeModule;
    private _generateMock;
    private _shouldMock;
    private _createRequireImplementation;
    private _createJestObjectFor;
    private _logFormattedReferenceError;
    private wrapCodeInModuleWrapper;
    private constructModuleWrapperStart;
    private constructInjectedModuleParameters;
    private handleExecutionError;
    private getGlobalsForCjs;
    private getGlobalsForEsm;
    private getGlobalsFromEnvironment;
    private readFile;
    setGlobalsForRuntime(globals: JestGlobals): void;
}
