import type { SyncTransformer, TransformedSource } from '@jest/transform';
import type { CompilerInstance, ProjectConfigTsJest, TransformOptionsTsJest } from '../types';
import { ConfigSet } from './config/config-set';
export declare class TsJestTransformer implements SyncTransformer {
    private readonly _logger;
    protected _compiler: CompilerInstance;
    private _tsResolvedModulesCachePath;
    private _transformCfgStr;
    private _depGraphs;
    private _watchMode;
    constructor();
    private _configsFor;
    protected _createConfigSet(config: ProjectConfigTsJest | undefined): ConfigSet;
    protected _createCompiler(configSet: ConfigSet, cacheFS: Map<string, string>): void;
    process(sourceText: string, sourcePath: string, transformOptions: TransformOptionsTsJest): TransformedSource;
    processAsync(sourceText: string, sourcePath: string, transformOptions: TransformOptionsTsJest): Promise<TransformedSource>;
    private processWithTs;
    private runTsJestHook;
    getCacheKey(fileContent: string, filePath: string, transformOptions: TransformOptionsTsJest): string;
    getCacheKeyAsync(sourceText: string, sourcePath: string, transformOptions: TransformOptionsTsJest): Promise<string>;
    private _getFsCachedResolvedModules;
}
