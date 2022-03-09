/// <reference types="node" />
import type { __ApiPreviewProps } from './api-utils';
import type { CustomRoutes } from '../lib/load-custom-routes';
import type { DomainLocale } from './config';
import type { DynamicRoutes, PageChecker, Params, Route } from './router';
import type { FontManifest } from './font-utils';
import type { LoadComponentsReturnType } from './load-components';
import type { MiddlewareManifest } from '../build/webpack/plugins/middleware-plugin';
import type { NextConfig, NextConfigComplete } from './config-shared';
import type { NextParsedUrlQuery, NextUrlWithParsedQuery } from './request-meta';
import type { ParsedUrlQuery } from 'querystring';
import type { RenderOpts } from './render';
import type { UrlWithParsedQuery } from 'url';
import type { CacheFs } from '../shared/lib/utils';
import type { PagesManifest } from '../build/webpack/plugins/pages-manifest-plugin';
import type { BaseNextRequest, BaseNextResponse } from './base-http';
import { getRouteMatcher } from '../shared/lib/router/utils';
import Router from './router';
import { PayloadOptions } from './send-payload';
import RenderResult from './render-result';
import { PrerenderManifest } from '../build';
import { ImageConfigComplete } from './image-config';
export declare type FindComponentsResult = {
    components: LoadComponentsReturnType;
    query: NextParsedUrlQuery;
};
interface RoutingItem {
    page: string;
    match: ReturnType<typeof getRouteMatcher>;
    ssr?: boolean;
}
export interface Options {
    /**
     * Object containing the configuration next.config.js
     */
    conf: NextConfig;
    /**
     * Set to false when the server was created by Next.js
     */
    customServer?: boolean;
    /**
     * Tells if Next.js is running in dev mode
     */
    dev?: boolean;
    /**
     * Where the Next project is located
     */
    dir?: string;
    /**
     * Tells if Next.js is running in a Serverless platform
     */
    minimalMode?: boolean;
    /**
     * Hide error messages containing server information
     */
    quiet?: boolean;
    /**
     * The hostname the server is running behind
     */
    hostname?: string;
    /**
     * The port the server is running behind
     */
    port?: number;
}
export interface BaseRequestHandler {
    (req: BaseNextRequest, res: BaseNextResponse, parsedUrl?: NextUrlWithParsedQuery | undefined): Promise<void>;
}
export default abstract class Server {
    protected dir: string;
    protected quiet: boolean;
    protected nextConfig: NextConfigComplete;
    protected distDir: string;
    protected pagesDir?: string;
    protected publicDir: string;
    protected hasStaticDir: boolean;
    protected pagesManifest?: PagesManifest;
    protected buildId: string;
    protected minimalMode: boolean;
    protected renderOpts: {
        poweredByHeader: boolean;
        buildId: string;
        generateEtags: boolean;
        runtimeConfig?: {
            [key: string]: any;
        };
        assetPrefix?: string;
        canonicalBase: string;
        dev?: boolean;
        previewProps: __ApiPreviewProps;
        customServer?: boolean;
        ampOptimizerConfig?: {
            [key: string]: any;
        };
        basePath: string;
        optimizeFonts: boolean;
        images: ImageConfigComplete;
        fontManifest?: FontManifest;
        disableOptimizedLoading?: boolean;
        optimizeCss: any;
        locale?: string;
        locales?: string[];
        defaultLocale?: string;
        domainLocales?: DomainLocale[];
        distDir: string;
        runtime?: 'nodejs' | 'edge';
        serverComponents?: boolean;
        crossOrigin?: string;
        supportsDynamicHTML?: boolean;
        serverComponentManifest?: any;
        renderServerComponentData?: boolean;
        serverComponentProps?: any;
        reactRoot: boolean;
    };
    private incrementalCache;
    private responseCache;
    protected router: Router;
    protected dynamicRoutes?: DynamicRoutes;
    protected customRoutes: CustomRoutes;
    protected middlewareManifest?: MiddlewareManifest;
    protected middleware?: RoutingItem[];
    protected serverComponentManifest?: any;
    readonly hostname?: string;
    readonly port?: number;
    protected abstract getPublicDir(): string;
    protected abstract getHasStaticDir(): boolean;
    protected abstract getPagesManifest(): PagesManifest | undefined;
    protected abstract getBuildId(): string;
    protected abstract generatePublicRoutes(): Route[];
    protected abstract generateImageRoutes(): Route[];
    protected abstract generateStaticRoutes(): Route[];
    protected abstract generateFsStaticRoutes(): Route[];
    protected abstract generateCatchAllMiddlewareRoute(): Route | undefined;
    protected abstract generateRewrites({ restrictedRedirectPaths, }: {
        restrictedRedirectPaths: string[];
    }): {
        beforeFiles: Route[];
        afterFiles: Route[];
        fallback: Route[];
    };
    protected abstract getFilesystemPaths(): Set<string>;
    protected abstract getMiddleware(): {
        match: (pathname: string | null | undefined) => false | {
            [paramName: string]: string | string[];
        };
        page: string;
    }[];
    protected abstract findPageComponents(pathname: string, query?: NextParsedUrlQuery, params?: Params | null): Promise<FindComponentsResult | null>;
    protected abstract hasMiddleware(pathname: string, _isSSR?: boolean): Promise<boolean>;
    protected abstract getPagePath(pathname: string, locales?: string[]): string;
    protected abstract getFontManifest(): FontManifest | undefined;
    protected abstract getMiddlewareManifest(): MiddlewareManifest | undefined;
    protected abstract getRoutesManifest(): CustomRoutes;
    protected abstract getPrerenderManifest(): PrerenderManifest;
    protected abstract getServerComponentManifest(): any;
    protected abstract sendRenderResult(req: BaseNextRequest, res: BaseNextResponse, options: {
        result: RenderResult;
        type: 'html' | 'json';
        generateEtags: boolean;
        poweredByHeader: boolean;
        options?: PayloadOptions;
    }): Promise<void>;
    protected abstract runApi(req: BaseNextRequest, res: BaseNextResponse, query: ParsedUrlQuery, params: Params | boolean, page: string, builtPagePath: string): Promise<boolean>;
    protected abstract renderHTML(req: BaseNextRequest, res: BaseNextResponse, pathname: string, query: NextParsedUrlQuery, renderOpts: RenderOpts): Promise<RenderResult | null>;
    protected abstract handleCompression(req: BaseNextRequest, res: BaseNextResponse): void;
    protected abstract loadEnvConfig(params: {
        dev: boolean;
    }): void;
    constructor({ dir, quiet, conf, dev, minimalMode, customServer, hostname, port, }: Options);
    logError(err: Error): void;
    private handleRequest;
    getRequestHandler(): BaseRequestHandler;
    setAssetPrefix(prefix?: string): void;
    prepare(): Promise<void>;
    protected close(): Promise<void>;
    protected getCustomRoutes(): CustomRoutes;
    protected getPreviewProps(): __ApiPreviewProps;
    protected ensureMiddleware(_pathname: string, _isSSR?: boolean): Promise<void>;
    protected generateRoutes(): {
        basePath: string;
        headers: Route[];
        rewrites: {
            beforeFiles: Route[];
            afterFiles: Route[];
            fallback: Route[];
        };
        fsRoutes: Route[];
        redirects: Route[];
        catchAllRoute: Route;
        catchAllMiddleware?: Route;
        pageChecker: PageChecker;
        useFileSystemPublicRoutes: boolean;
        dynamicRoutes: DynamicRoutes | undefined;
        locales: string[];
    };
    protected hasPage(pathname: string): Promise<boolean>;
    protected _beforeCatchAllRender(_req: BaseNextRequest, _res: BaseNextResponse, _params: Params, _parsedUrl: UrlWithParsedQuery): Promise<boolean>;
    protected ensureApiPage(_pathname: string): Promise<void>;
    /**
     * Resolves `API` request, in development builds on demand
     * @param req http request
     * @param res http response
     * @param pathname path of request
     */
    private handleApiRequest;
    protected getDynamicRoutes(): Array<RoutingItem>;
    protected run(req: BaseNextRequest, res: BaseNextResponse, parsedUrl: UrlWithParsedQuery): Promise<void>;
    private pipe;
    private getStaticHTML;
    render(req: BaseNextRequest, res: BaseNextResponse, pathname: string, query?: NextParsedUrlQuery, parsedUrl?: NextUrlWithParsedQuery, internalRender?: boolean): Promise<void>;
    protected getStaticPaths(pathname: string): Promise<{
        staticPaths: string[] | undefined;
        fallbackMode: 'static' | 'blocking' | false;
    }>;
    private renderToResponseWithComponents;
    private renderToResponse;
    renderToHTML(req: BaseNextRequest, res: BaseNextResponse, pathname: string, query?: ParsedUrlQuery): Promise<string | null>;
    renderError(err: Error | null, req: BaseNextRequest, res: BaseNextResponse, pathname: string, query?: NextParsedUrlQuery, setHeaders?: boolean): Promise<void>;
    private customErrorNo404Warn;
    private renderErrorToResponse;
    renderErrorToHTML(err: Error | null, req: BaseNextRequest, res: BaseNextResponse, pathname: string, query?: ParsedUrlQuery): Promise<string | null>;
    protected getCacheFilesystem(): CacheFs;
    protected getFallbackErrorComponents(): Promise<LoadComponentsReturnType | null>;
    render404(req: BaseNextRequest, res: BaseNextResponse, parsedUrl?: NextUrlWithParsedQuery, setHeaders?: boolean): Promise<void>;
    protected get _isLikeServerless(): boolean;
}
export declare function prepareServerlessUrl(req: BaseNextRequest, query: ParsedUrlQuery): void;
export { stringifyQuery } from './server-route-utils';
export declare class WrappedBuildError extends Error {
    innerError: Error;
    constructor(innerError: Error);
}
