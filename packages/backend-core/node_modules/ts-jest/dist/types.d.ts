import type { TransformOptions } from '@jest/transform';
import type { Config } from '@jest/types';
import type * as _babel from 'babel__core';
import type * as _ts from 'typescript';
import type { ConfigSet } from './config';
import type { RawCompilerOptions } from './raw-compiler-options';
declare module '@jest/types' {
    namespace Config {
        interface ConfigGlobals {
            'ts-jest': TsJestGlobalOptions;
        }
    }
}
export declare type TTypeScript = typeof _ts;
export interface TEsBuild {
    transformSync(input: string, options?: {
        loader: 'ts' | 'js';
        format: 'cjs' | 'esm';
        target: string;
    }): {
        code: string;
        map: string;
    };
}
export declare type BabelConfig = _babel.TransformOptions;
export declare type TsJestPresets = Pick<Config.InitialOptions, 'extensionsToTreatAsEsm' | 'moduleFileExtensions' | 'transform' | 'testMatch'>;
export interface AstTransformer<T = Record<string, unknown>> {
    path: string;
    options?: T;
}
export interface ConfigCustomTransformer {
    before?: Array<string | AstTransformer>;
    after?: Array<string | AstTransformer>;
    afterDeclarations?: Array<string | AstTransformer>;
}
export interface TsJestGlobalOptions {
    tsconfig?: boolean | string | RawCompilerOptions;
    isolatedModules?: boolean;
    compiler?: 'typescript' | 'ttypescript' | string;
    astTransformers?: ConfigCustomTransformer;
    diagnostics?: boolean | {
        pretty?: boolean;
        ignoreCodes?: number | string | Array<number | string>;
        exclude?: Config.Glob[];
        warnOnly?: boolean;
    };
    babelConfig?: boolean | string | BabelConfig;
    stringifyContentPathRegex?: string | RegExp;
    useESM?: boolean;
}
export interface TsJestDiagnosticsCfg {
    pretty: boolean;
    ignoreCodes: number[];
    exclude: Config.Glob[];
    throws: boolean;
    warnOnly?: boolean;
}
export interface ProjectConfigTsJest extends Config.ProjectConfig {
    globals: GlobalConfigTsJest;
}
export interface TransformOptionsTsJest extends TransformOptions {
    config: ProjectConfigTsJest;
}
export interface GlobalConfigTsJest extends Config.ConfigGlobals {
    'ts-jest': TsJestGlobalOptions;
}
export interface InitialOptionsTsJest extends Config.InitialOptions {
    globals?: GlobalConfigTsJest;
}
export declare type StringMap = Map<string, string>;
export interface DepGraphInfo {
    fileContent: string;
    resolvedModuleNames: string[];
}
export interface TsJestCompileOptions {
    depGraphs: Map<string, DepGraphInfo>;
    watchMode: boolean;
    supportsStaticESM: boolean;
}
export interface CompilerInstance {
    getResolvedModules(fileContent: string, fileName: string, runtimeCacheFS: StringMap): string[];
    getCompiledOutput(fileContent: string, fileName: string, options: TsJestCompileOptions): string;
}
export interface TsCompilerInstance extends CompilerInstance {
    configSet: ConfigSet;
    program: _ts.Program | undefined;
}
export interface AstTransformerDesc<T = Record<string, unknown>> {
    name: string;
    version: number;
    factory(tsCompiler: TsCompilerInstance, opts?: T): _ts.TransformerFactory<_ts.SourceFile> | _ts.TransformerFactory<_ts.Bundle | _ts.SourceFile>;
    options?: T;
}
export interface TsJestAstTransformer {
    before: AstTransformerDesc[];
    after: AstTransformerDesc[];
    afterDeclarations: AstTransformerDesc[];
}
