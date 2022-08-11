import { Logger } from 'bs-logger';
import type { TranspileOutput, CompilerOptions, Program, CustomTransformers } from 'typescript';
import type { ConfigSet } from '../config';
import type { StringMap, TsCompilerInstance, TsJestAstTransformer, TsJestCompileOptions, TTypeScript } from '../types';
export declare class TsCompiler implements TsCompilerInstance {
    readonly configSet: ConfigSet;
    readonly runtimeCacheFS: StringMap;
    protected readonly _logger: Logger;
    protected readonly _ts: TTypeScript;
    protected readonly _initialCompilerOptions: CompilerOptions;
    protected _compilerOptions: CompilerOptions;
    private _runtimeCacheFS;
    private _fileContentCache;
    program: Program | undefined;
    constructor(configSet: ConfigSet, runtimeCacheFS: StringMap);
    getResolvedModules(fileContent: string, fileName: string, runtimeCacheFS: StringMap): string[];
    getCompiledOutput(fileContent: string, fileName: string, options: TsJestCompileOptions): string;
    protected _transpileOutput(fileContent: string, fileName: string): TranspileOutput;
    protected _makeTransformers(customTransformers: TsJestAstTransformer): CustomTransformers;
}
