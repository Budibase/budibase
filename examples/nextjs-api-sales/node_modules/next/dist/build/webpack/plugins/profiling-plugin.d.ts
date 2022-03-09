import { Span } from '../../../trace';
import type { webpack5 as webpack } from 'next/dist/compiled/webpack/webpack';
export declare const spans: WeakMap<webpack.Compiler | webpack.Compilation, Span>;
export declare const webpackInvalidSpans: WeakMap<any, Span>;
export declare class ProfilingPlugin {
    compiler: any;
    runWebpackSpan: Span;
    constructor({ runWebpackSpan }: {
        runWebpackSpan: Span;
    });
    apply(compiler: any): void;
    traceHookPair(spanName: string | (() => string), startHook: any, stopHook: any, { parentSpan, attrs, onStart, onStop, }?: {
        parentSpan?: () => Span;
        attrs?: any;
        onStart?: (span: Span, ...params: any[]) => void;
        onStop?: () => void;
    }): void;
    traceTopLevelHooks(compiler: any): void;
    traceCompilationHooks(compiler: any): void;
}
