/// <reference types="node" />
import type { __ApiPreviewProps } from '../api-utils';
import type { CustomRoutes } from '../../lib/load-custom-routes';
import type { FetchEventResult } from '../web/types';
import type { FindComponentsResult } from '../next-server';
import type { LoadComponentsReturnType } from '../load-components';
import type { Options as ServerOptions } from '../next-server';
import type { Params } from '../router';
import type { ParsedNextUrl } from '../../shared/lib/router/utils/parse-next-url';
import type { ParsedUrlQuery } from 'querystring';
import type { Server as HTTPServer } from 'http';
import type { UrlWithParsedQuery } from 'url';
import type { BaseNextRequest, BaseNextResponse } from '../base-http';
import Server from '../next-server';
import { NodeNextResponse, NodeNextRequest } from '../base-http/node';
export interface Options extends ServerOptions {
    /**
     * The HTTP Server that Next.js is running behind
     */
    httpServer?: HTTPServer;
    /**
     * Tells of Next.js is running from the `next dev` command
     */
    isNextDevCommand?: boolean;
}
export default class DevServer extends Server {
    private devReady;
    private setDevReady?;
    private webpackWatcher?;
    private hotReloader?;
    private isCustomServer;
    protected sortedRoutes?: string[];
    private addedUpgradeListener;
    protected staticPathsWorker?: {
        [key: string]: any;
    } & {
        loadStaticPaths: typeof import('./static-paths-worker').loadStaticPaths;
    };
    private getStaticPathsWorker;
    constructor(options: Options);
    protected getBuildId(): string;
    addExportPathMapRoutes(): Promise<void>;
    startWatcher(): Promise<void>;
    stopWatcher(): Promise<void>;
    prepare(): Promise<void>;
    protected close(): Promise<void>;
    protected hasPage(pathname: string): Promise<boolean>;
    protected _beforeCatchAllRender(req: BaseNextRequest, res: BaseNextResponse, params: Params, parsedUrl: UrlWithParsedQuery): Promise<boolean>;
    private setupWebSocketHandler;
    runMiddleware(params: {
        request: BaseNextRequest;
        response: BaseNextResponse;
        parsedUrl: ParsedNextUrl;
        parsed: UrlWithParsedQuery;
    }): Promise<FetchEventResult | null>;
    run(req: NodeNextRequest, res: NodeNextResponse, parsedUrl: UrlWithParsedQuery): Promise<void>;
    private logErrorWithOriginalStack;
    protected getCustomRoutes(): CustomRoutes;
    private _devCachedPreviewProps;
    protected getPreviewProps(): __ApiPreviewProps;
    protected getPagesManifest(): undefined;
    protected getMiddleware(): never[];
    protected getMiddlewareManifest(): undefined;
    protected getServerComponentManifest(): undefined;
    protected hasMiddleware(pathname: string, isSSR?: boolean): Promise<boolean>;
    protected ensureMiddleware(pathname: string, isSSR?: boolean): Promise<any>;
    generateRoutes(): {
        basePath: string;
        headers: import("../router").Route[];
        rewrites: {
            beforeFiles: import("../router").Route[];
            afterFiles: import("../router").Route[];
            fallback: import("../router").Route[];
        };
        redirects: import("../router").Route[];
        catchAllRoute: import("../router").Route;
        catchAllMiddleware?: import("../router").Route | undefined;
        pageChecker: import("../router").PageChecker;
        useFileSystemPublicRoutes: boolean;
        dynamicRoutes: import("../router").DynamicRoutes | undefined;
        locales: string[];
        fsRoutes: import("../router").Route[];
    };
    protected generatePublicRoutes(): never[];
    protected getDynamicRoutes(): never[];
    _filterAmpDevelopmentScript(html: string, event: {
        line: number;
        col: number;
        code: string;
    }): boolean;
    protected getStaticPaths(pathname: string): Promise<{
        staticPaths: string[] | undefined;
        fallbackMode: false | 'static' | 'blocking';
    }>;
    protected ensureApiPage(pathname: string): Promise<any>;
    protected findPageComponents(pathname: string, query?: ParsedUrlQuery, params?: Params | null): Promise<FindComponentsResult | null>;
    protected getFallbackErrorComponents(): Promise<LoadComponentsReturnType | null>;
    protected setImmutableAssetCacheControl(res: BaseNextResponse): void;
    private servePublic;
    hasPublicFile(path: string): Promise<boolean>;
    getCompilationError(page: string): Promise<any>;
    protected isServeableUrl(untrustedFileUrl: string): boolean;
}
