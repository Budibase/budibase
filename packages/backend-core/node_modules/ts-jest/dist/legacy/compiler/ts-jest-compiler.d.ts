import type { TransformedSource } from '@jest/transform';
import type { CompilerInstance, StringMap, TsJestCompileOptions } from '../../types';
import type { ConfigSet } from '../config/config-set';
export declare class TsJestCompiler implements CompilerInstance {
    private readonly _compilerInstance;
    constructor(configSet: ConfigSet, runtimeCacheFS: StringMap);
    getResolvedModules(fileContent: string, fileName: string, runtimeCacheFS: StringMap): string[];
    getCompiledOutput(fileContent: string, fileName: string, options: TsJestCompileOptions): TransformedSource;
}
