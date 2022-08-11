import type { SyncTransformer, TransformedSource } from '@jest/transform';
import type { Config } from '@jest/types';
import { ConfigSet } from './config';
import type { CompilerInstance, ProjectConfigTsJest, TransformOptionsTsJest } from './types';
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
    process(fileContent: string, filePath: Config.Path, transformOptions: TransformOptionsTsJest): TransformedSource | string;
    processAsync(sourceText: string, sourcePath: Config.Path, transformOptions: TransformOptionsTsJest): Promise<TransformedSource | string>;
    getCacheKey(fileContent: string, filePath: string, transformOptions: TransformOptionsTsJest): string;
    getCacheKeyAsync(sourceText: string, sourcePath: string, transformOptions: TransformOptionsTsJest): Promise<string>;
    private _getFsCachedResolvedModules;
}
