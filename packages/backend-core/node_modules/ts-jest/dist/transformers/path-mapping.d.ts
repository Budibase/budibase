import type * as _ts from 'typescript';
import type { TsCompilerInstance } from '../types';
export declare const version = 2;
export declare const name = "path-mapping";
export declare function factory({ configSet, }: TsCompilerInstance): (ctx: _ts.TransformationContext) => _ts.Transformer<_ts.SourceFile>;
