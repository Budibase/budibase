import '../server/node-polyfill-fetch';
import { CustomRoutes } from '../lib/load-custom-routes';
import { GetStaticPaths } from 'next/types';
import { BuildManifest } from '../server/get-page-files';
import { UnwrapPromise } from '../lib/coalesced-function';
import { NextConfigComplete } from '../server/config-shared';
import { MiddlewareManifest } from './webpack/plugins/middleware-plugin';
export declare function collectPages(directory: string, pageExtensions: string[]): Promise<string[]>;
export interface PageInfo {
    isHybridAmp?: boolean;
    size: number;
    totalSize: number;
    static: boolean;
    isSsg: boolean;
    isWebSsr: boolean;
    ssgPageRoutes: string[] | null;
    initialRevalidateSeconds: number | false;
    pageDuration: number | undefined;
    ssgPageDurations: number[] | undefined;
}
export declare function printTreeView(list: readonly string[], pageInfos: Map<string, PageInfo>, serverless: boolean, { distPath, buildId, pagesDir, pageExtensions, buildManifest, useStatic404, gzipSize, }: {
    distPath: string;
    buildId: string;
    pagesDir: string;
    pageExtensions: string[];
    buildManifest: BuildManifest;
    useStatic404: boolean;
    gzipSize?: boolean;
}): Promise<void>;
export declare function printCustomRoutes({ redirects, rewrites, headers, }: CustomRoutes): void;
declare type ComputeManifestShape = {
    commonFiles: string[];
    uniqueFiles: string[];
    sizeUniqueFiles: {
        [file: string]: number;
    };
    sizeCommonFile: {
        [file: string]: number;
    };
    sizeCommonFiles: number;
};
export declare function computeFromManifest(manifest: BuildManifest, distPath: string, gzipSize?: boolean, pageInfos?: Map<string, PageInfo>): Promise<ComputeManifestShape>;
export declare function difference<T>(main: T[] | Set<T>, sub: T[] | Set<T>): T[];
export declare function getJsPageSizeInKb(page: string, distPath: string, buildManifest: BuildManifest, gzipSize?: boolean, computedManifestData?: ComputeManifestShape): Promise<[number, number]>;
export declare function buildStaticPaths(page: string, getStaticPaths: GetStaticPaths, configFileName: string, locales?: string[], defaultLocale?: string): Promise<Omit<UnwrapPromise<ReturnType<GetStaticPaths>>, 'paths'> & {
    paths: string[];
    encodedPaths: string[];
}>;
export declare function isPageStatic(page: string, distDir: string, serverless: boolean, configFileName: string, runtimeEnvConfig: any, httpAgentOptions: NextConfigComplete['httpAgentOptions'], locales?: string[], defaultLocale?: string, parentId?: any): Promise<{
    isStatic?: boolean;
    isAmpOnly?: boolean;
    isHybridAmp?: boolean;
    hasFlightData?: boolean;
    hasServerProps?: boolean;
    hasStaticProps?: boolean;
    prerenderRoutes?: string[];
    encodedPrerenderRoutes?: string[];
    prerenderFallback?: boolean | 'blocking';
    isNextImageImported?: boolean;
    traceIncludes?: string[];
    traceExcludes?: string[];
}>;
export declare function hasCustomGetInitialProps(page: string, distDir: string, isLikeServerless: boolean, runtimeEnvConfig: any, checkingApp: boolean): Promise<boolean>;
export declare function getNamedExports(page: string, distDir: string, isLikeServerless: boolean, runtimeEnvConfig: any): Promise<Array<string>>;
export declare function detectConflictingPaths(combinedPages: string[], ssgPages: Set<string>, additionalSsgPaths: Map<string, string[]>): void;
export declare function getRawPageExtensions(pageExtensions: string[]): string[];
export declare function isFlightPage(nextConfig: NextConfigComplete, pagePath: string): boolean;
export declare function getUnresolvedModuleFromError(error: string): string | undefined;
export declare function copyTracedFiles(dir: string, distDir: string, pageKeys: string[], tracingRoot: string, serverConfig: {
    [key: string]: any;
}, middlewareManifest: MiddlewareManifest): Promise<void>;
export declare function isReservedPage(page: string): boolean;
export declare function isCustomErrorPage(page: string): boolean;
export {};
