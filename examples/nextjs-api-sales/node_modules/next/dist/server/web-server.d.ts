import type { WebNextRequest, WebNextResponse } from './base-http/web';
import type { RenderOpts } from './render';
import type RenderResult from './render-result';
import type { NextParsedUrlQuery } from './request-meta';
import type { Params } from './router';
import type { PayloadOptions } from './send-payload';
import type { LoadComponentsReturnType } from './load-components';
import BaseServer, { Options } from './base-server';
interface WebServerConfig {
    loadComponent: (pathname: string) => Promise<LoadComponentsReturnType | null>;
    extendRenderOpts?: Partial<BaseServer['renderOpts']>;
}
export default class NextWebServer extends BaseServer {
    webServerConfig: WebServerConfig;
    constructor(options: Options & {
        webServerConfig: WebServerConfig;
    });
    protected generateRewrites(): {
        beforeFiles: never[];
        afterFiles: never[];
        fallback: never[];
    };
    protected handleCompression(): void;
    protected getRoutesManifest(): {
        headers: never[];
        rewrites: {
            fallback: never[];
            afterFiles: never[];
            beforeFiles: never[];
        };
        redirects: never[];
    };
    protected getPagePath(): string;
    protected getPublicDir(): string;
    protected getBuildId(): any;
    protected loadEnvConfig(): void;
    protected getHasStaticDir(): boolean;
    protected hasMiddleware(): Promise<boolean>;
    protected generateImageRoutes(): never[];
    protected generateStaticRoutes(): never[];
    protected generateFsStaticRoutes(): never[];
    protected generatePublicRoutes(): never[];
    protected getMiddleware(): never[];
    protected generateCatchAllMiddlewareRoute(): undefined;
    protected getFontManifest(): undefined;
    protected getMiddlewareManifest(): undefined;
    protected getPagesManifest(): {
        [x: number]: string;
    };
    protected getFilesystemPaths(): Set<string>;
    protected getPrerenderManifest(): {
        version: 3;
        routes: {};
        dynamicRoutes: {};
        notFoundRoutes: never[];
        preview: {
            previewModeId: string;
            previewModeSigningKey: string;
            previewModeEncryptionKey: string;
        };
    };
    protected getServerComponentManifest(): undefined;
    protected renderHTML(req: WebNextRequest, _res: WebNextResponse, pathname: string, query: NextParsedUrlQuery, renderOpts: RenderOpts): Promise<RenderResult | null>;
    protected sendRenderResult(_req: WebNextRequest, res: WebNextResponse, options: {
        result: RenderResult;
        type: 'html' | 'json';
        generateEtags: boolean;
        poweredByHeader: boolean;
        options?: PayloadOptions | undefined;
    }): Promise<void>;
    protected runApi(): Promise<boolean>;
    protected findPageComponents(pathname: string, query?: NextParsedUrlQuery, params?: Params | null): Promise<{
        query: {
            [x: string]: any;
            __nextNotFoundSrcPage?: string | undefined;
            __nextDefaultLocale?: string | undefined;
            __nextFallback?: "true" | undefined;
            __nextLocale?: string | undefined;
            __nextSsgPath?: string | undefined;
            _nextBubbleNoFallback?: "1" | undefined;
            _nextDataReq?: "1" | undefined;
            amp?: "1" | undefined;
        };
        components: LoadComponentsReturnType;
    } | null>;
    updateRenderOpts(renderOpts: Partial<BaseServer['renderOpts']>): void;
}
export {};
