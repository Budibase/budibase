/// <reference types="node" />
import type { Options as DevServerOptions } from './dev/next-dev-server';
import './node-polyfill-fetch';
import { default as Server } from './next-server';
import { IncomingMessage, ServerResponse } from 'http';
import { NextUrlWithParsedQuery } from './request-meta';
export declare type NextServerOptions = Partial<DevServerOptions>;
export interface RequestHandler {
    (req: IncomingMessage, res: ServerResponse, parsedUrl?: NextUrlWithParsedQuery | undefined): Promise<void>;
}
export declare class NextServer {
    private serverPromise?;
    private server?;
    private reqHandlerPromise?;
    private preparedAssetPrefix?;
    options: NextServerOptions;
    constructor(options: NextServerOptions);
    get hostname(): string | undefined;
    get port(): number | undefined;
    getRequestHandler(): RequestHandler;
    setAssetPrefix(assetPrefix: string): void;
    logError(...args: Parameters<Server['logError']>): void;
    render(...args: Parameters<Server['render']>): Promise<void>;
    renderToHTML(...args: Parameters<Server['renderToHTML']>): Promise<string | null>;
    renderError(...args: Parameters<Server['renderError']>): Promise<void>;
    renderErrorToHTML(...args: Parameters<Server['renderErrorToHTML']>): Promise<string | null>;
    render404(...args: Parameters<Server['render404']>): Promise<void>;
    serveStatic(...args: Parameters<Server['serveStatic']>): Promise<void>;
    prepare(): Promise<void>;
    close(): Promise<any>;
    private createServer;
    private loadConfig;
    private getServer;
    private getServerRequestHandler;
}
declare function createServer(options: NextServerOptions): NextServer;
export default createServer;
