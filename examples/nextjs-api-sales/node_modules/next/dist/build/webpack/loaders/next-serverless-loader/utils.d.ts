/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { Rewrite } from '../../../../lib/load-custom-routes';
import type { BuildManifest } from '../../../../server/get-page-files';
import type { NextConfig } from '../../../../server/config';
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from '../../../../types';
import type { BaseNextRequest } from '../../../../server/base-http';
import { UrlWithParsedQuery } from 'url';
import { ParsedUrlQuery } from 'querystring';
import { __ApiPreviewProps } from '../../../../server/api-utils';
export declare const vercelHeader = "x-vercel-id";
export declare type ServerlessHandlerCtx = {
    page: string;
    pageModule: any;
    pageComponent?: any;
    pageConfig?: any;
    pageGetStaticProps?: GetStaticProps;
    pageGetStaticPaths?: GetStaticPaths;
    pageGetServerSideProps?: GetServerSideProps;
    appModule?: any;
    errorModule?: any;
    documentModule?: any;
    notFoundModule?: any;
    runtimeConfig: any;
    buildManifest?: BuildManifest;
    reactLoadableManifest?: any;
    basePath: string;
    rewrites: Rewrite[];
    pageIsDynamic: boolean;
    generateEtags: boolean;
    distDir: string;
    buildId: string;
    escapedBuildId: string;
    assetPrefix: string;
    poweredByHeader: boolean;
    canonicalBase: string;
    encodedPreviewProps: __ApiPreviewProps;
    i18n?: NextConfig['i18n'];
};
export declare function getUtils({ page, i18n, basePath, rewrites, pageIsDynamic, }: {
    page: ServerlessHandlerCtx['page'];
    i18n?: ServerlessHandlerCtx['i18n'];
    basePath: ServerlessHandlerCtx['basePath'];
    rewrites: ServerlessHandlerCtx['rewrites'];
    pageIsDynamic: ServerlessHandlerCtx['pageIsDynamic'];
}): {
    handleLocale: (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery, routeNoAssetPath: string, shouldNotRedirect: boolean) => {
        defaultLocale: string;
        detectedLocale: string;
        routeNoAssetPath: string;
    } | undefined;
    handleRewrites: (req: BaseNextRequest | IncomingMessage, parsedUrl: UrlWithParsedQuery) => UrlWithParsedQuery;
    handleBasePath: (req: BaseNextRequest | IncomingMessage, parsedUrl: UrlWithParsedQuery) => void;
    defaultRouteRegex: import("../../../../shared/lib/router/utils/route-regex").RouteRegex | undefined;
    normalizeVercelUrl: (req: BaseNextRequest | IncomingMessage, trustQuery: boolean) => void;
    dynamicRouteMatcher: ((pathname: string | null | undefined) => false | {
        [paramName: string]: string | string[];
    }) | undefined;
    defaultRouteMatches: ParsedUrlQuery | undefined;
    interpolateDynamicPath: (pathname: string, params: ParsedUrlQuery) => string;
    getParamsFromRouteMatches: (req: BaseNextRequest | IncomingMessage, renderOpts?: any, detectedLocale?: string | undefined) => ParsedUrlQuery;
    normalizeDynamicRouteParams: (params: ParsedUrlQuery) => {
        params: ParsedUrlQuery;
        hasValidParams: boolean;
    };
};
