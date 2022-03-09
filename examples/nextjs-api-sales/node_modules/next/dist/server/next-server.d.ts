/// <reference types="node" />
import './node-polyfill-fetch';
import type { Params, Route } from './router';
import type { CacheFs } from '../shared/lib/utils';
import type { MiddlewareManifest } from '../build/webpack/plugins/middleware-plugin';
import type RenderResult from './render-result';
import type { FetchEventResult } from './web/types';
import type { ParsedNextUrl } from '../shared/lib/router/utils/parse-next-url';
import type { PrerenderManifest } from '../build';
import type { BaseNextRequest, BaseNextResponse } from './base-http';
import { NextParsedUrlQuery, NextUrlWithParsedQuery } from './request-meta';
import { IncomingMessage, ServerResponse } from 'http';
import { PagesManifest } from '../build/webpack/plugins/pages-manifest-plugin';
import { UrlWithParsedQuery } from 'url';
import { NodeNextRequest, NodeNextResponse } from './base-http/node';
import { PayloadOptions } from './send-payload';
import { ParsedUrlQuery } from 'querystring';
import { RenderOpts } from './render';
import { ParsedUrl } from '../shared/lib/router/utils/parse-url';
import BaseServer, { Options, FindComponentsResult } from './base-server';
import { FontManifest } from './font-utils';
export * from './base-server';
export interface NodeRequestHandler {
    (req: IncomingMessage | BaseNextRequest, res: ServerResponse | BaseNextResponse, parsedUrl?: NextUrlWithParsedQuery | undefined): Promise<void>;
}
export default class NextNodeServer extends BaseServer {
    private imageResponseCache?;
    constructor(options: Options);
    private compression;
    protected loadEnvConfig({ dev }: {
        dev: boolean;
    }): void;
    protected getPublicDir(): string;
    protected getHasStaticDir(): boolean;
    protected getPagesManifest(): PagesManifest | undefined;
    protected getBuildId(): string;
    protected generateImageRoutes(): Route[];
    protected generateStaticRoutes(): Route[];
    protected setImmutableAssetCacheControl(res: BaseNextResponse): void;
    protected generateFsStaticRoutes(): Route[];
    protected generatePublicRoutes(): Route[];
    private _validFilesystemPathSet;
    protected getFilesystemPaths(): Set<string>;
    protected sendRenderResult(req: NodeNextRequest, res: NodeNextResponse, options: {
        result: RenderResult;
        type: 'html' | 'json';
        generateEtags: boolean;
        poweredByHeader: boolean;
        options?: PayloadOptions | undefined;
    }): Promise<void>;
    protected sendStatic(req: NodeNextRequest, res: NodeNextResponse, path: string): Promise<void>;
    protected handleCompression(req: NodeNextRequest, res: NodeNextResponse): void;
    protected proxyRequest(req: NodeNextRequest, res: NodeNextResponse, parsedUrl: ParsedUrl): Promise<{
        finished: boolean;
    }>;
    protected runApi(req: NodeNextRequest, res: NodeNextResponse, query: ParsedUrlQuery, params: Params | false, page: string, builtPagePath: string): Promise<boolean>;
    protected renderHTML(req: NodeNextRequest, res: NodeNextResponse, pathname: string, query: NextParsedUrlQuery, renderOpts: RenderOpts): Promise<RenderResult | null>;
    protected streamResponseChunk(res: NodeNextResponse, chunk: any): void;
    protected imageOptimizer(req: NodeNextRequest, res: NodeNextResponse, paramsResult: import('./image-optimizer').ImageParamsResult): Promise<{
        buffer: Buffer;
        contentType: string;
        maxAge: number;
    }>;
    protected getPagePath(pathname: string, locales?: string[]): string;
    protected findPageComponents(pathname: string, query?: NextParsedUrlQuery, params?: Params | null): Promise<FindComponentsResult | null>;
    protected getFontManifest(): FontManifest;
    protected getServerComponentManifest(): any;
    protected getCacheFilesystem(): CacheFs;
    private normalizeReq;
    private normalizeRes;
    getRequestHandler(): NodeRequestHandler;
    render(req: BaseNextRequest | IncomingMessage, res: BaseNextResponse | ServerResponse, pathname: string, query?: NextParsedUrlQuery, parsedUrl?: NextUrlWithParsedQuery, internal?: boolean): Promise<void>;
    renderToHTML(req: BaseNextRequest | IncomingMessage, res: BaseNextResponse | ServerResponse, pathname: string, query?: ParsedUrlQuery): Promise<string | null>;
    renderError(err: Error | null, req: BaseNextRequest | IncomingMessage, res: BaseNextResponse | ServerResponse, pathname: string, query?: NextParsedUrlQuery, setHeaders?: boolean): Promise<void>;
    renderErrorToHTML(err: Error | null, req: BaseNextRequest | IncomingMessage, res: BaseNextResponse | ServerResponse, pathname: string, query?: ParsedUrlQuery): Promise<string | null>;
    render404(req: BaseNextRequest | IncomingMessage, res: BaseNextResponse | ServerResponse, parsedUrl?: NextUrlWithParsedQuery, setHeaders?: boolean): Promise<void>;
    protected hasMiddleware(pathname: string, _isSSR?: boolean): Promise<boolean>;
    serveStatic(req: BaseNextRequest | IncomingMessage, res: BaseNextResponse | ServerResponse, path: string, parsedUrl?: UrlWithParsedQuery): Promise<void>;
    protected getStaticRoutes(): Route[];
    protected isServeableUrl(untrustedFileUrl: string): boolean;
    protected getMiddlewareInfo(page: string): {
        name: string;
        paths: string[];
        env: string[];
    };
    protected getMiddlewareManifest(): MiddlewareManifest | undefined;
    protected generateRewrites({ restrictedRedirectPaths, }: {
        restrictedRedirectPaths: string[];
    }): {
        beforeFiles: Route[];
        afterFiles: Route[];
        fallback: Route[];
    };
    protected generateCatchAllMiddlewareRoute(): Route | undefined;
    protected getMiddleware(): {
        match: (pathname: string | null | undefined) => false | {
            [paramName: string]: string | string[];
        };
        page: string;
    }[];
    private middlewareBetaWarning;
    protected runMiddleware(params: {
        request: BaseNextRequest;
        response: BaseNextResponse;
        parsedUrl: ParsedNextUrl;
        parsed: UrlWithParsedQuery;
        onWarning?: (warning: Error) => void;
    }): Promise<FetchEventResult | null>;
    private _cachedPreviewManifest;
    protected getPrerenderManifest(): PrerenderManifest;
    protected getRoutesManifest(): any;
    private warnIfQueryParametersWereDeleted;
}
