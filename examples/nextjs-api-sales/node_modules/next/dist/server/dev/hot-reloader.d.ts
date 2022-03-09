/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlObject } from 'url';
import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
import { __ApiPreviewProps } from '../api-utils';
import { NextConfigComplete } from '../config-shared';
import { CustomRoutes } from '../../lib/load-custom-routes';
export declare function renderScriptError(res: ServerResponse, error: Error, { verbose }?: {
    verbose?: boolean | undefined;
}): Promise<void>;
export default class HotReloader {
    private dir;
    private buildId;
    private middlewares;
    private pagesDir;
    private webpackHotMiddleware?;
    private config;
    private runtime?;
    private hasServerComponents;
    clientStats: webpack5.Stats | null;
    serverStats: webpack5.Stats | null;
    private clientError;
    private serverError;
    private serverPrevDocumentHash;
    private prevChunkNames?;
    private onDemandEntries?;
    private previewProps;
    private watcher;
    private rewrites;
    private fallbackWatcher;
    private hotReloaderSpan;
    private pagesMapping;
    constructor(dir: string, { config, pagesDir, buildId, previewProps, rewrites, }: {
        config: NextConfigComplete;
        pagesDir: string;
        buildId: string;
        previewProps: __ApiPreviewProps;
        rewrites: CustomRoutes['rewrites'];
    });
    run(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlObject): Promise<{
        finished?: true;
    }>;
    onHMR(req: IncomingMessage, _res: ServerResponse, head: Buffer): void;
    private clean;
    private getWebpackConfig;
    buildFallbackError(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getCompilationErrors(page: string): Promise<any[]>;
    send(action?: string | any, ...args: any[]): void;
    ensurePage(page: string, clientOnly?: boolean): Promise<any>;
}
