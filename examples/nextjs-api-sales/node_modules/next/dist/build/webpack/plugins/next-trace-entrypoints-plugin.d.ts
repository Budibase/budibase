import { Span } from '../../../trace';
import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
import { NextConfigComplete } from '../../../server/config-shared';
export declare class TraceEntryPointsPlugin implements webpack5.WebpackPluginInstance {
    private appDir;
    private tracingRoot;
    private entryTraces;
    private excludeFiles;
    private esmExternals?;
    private staticImageImports?;
    constructor({ appDir, excludeFiles, esmExternals, staticImageImports, outputFileTracingRoot, }: {
        appDir: string;
        excludeFiles?: string[];
        staticImageImports: boolean;
        outputFileTracingRoot?: string;
        esmExternals?: NextConfigComplete['experimental']['esmExternals'];
    });
    createTraceAssets(compilation: any, assets: any, span: Span, readlink: any, stat: any): Promise<void>;
    tapfinishModules(compilation: webpack5.Compilation, traceEntrypointsPluginSpan: Span, doResolve: (request: string, parent: string, job: import('@vercel/nft/out/node-file-trace').Job, isEsmRequested: boolean) => Promise<string>, readlink: any, stat: any): void;
    apply(compiler: webpack5.Compiler): void;
}
