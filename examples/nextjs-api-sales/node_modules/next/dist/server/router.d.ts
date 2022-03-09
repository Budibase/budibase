/// <reference types="node" />
import type { ParsedUrlQuery } from 'querystring';
import type { BaseNextRequest, BaseNextResponse } from './base-http';
import { NextUrlWithParsedQuery } from './request-meta';
import { RouteHas } from '../lib/load-custom-routes';
export declare const route: (path: string, regexModifier?: ((regex: string) => string) | undefined) => (pathname: string | null | undefined, params?: any) => any;
export declare type Params = {
    [param: string]: any;
};
export declare type RouteMatch = (pathname: string | null | undefined) => false | Params;
declare type RouteResult = {
    finished: boolean;
    pathname?: string;
    query?: ParsedUrlQuery;
};
export declare type Route = {
    match: RouteMatch;
    has?: RouteHas[];
    type: string;
    check?: boolean;
    statusCode?: number;
    name: string;
    requireBasePath?: false;
    internal?: true;
    fn: (req: BaseNextRequest, res: BaseNextResponse, params: Params, parsedUrl: NextUrlWithParsedQuery) => Promise<RouteResult> | RouteResult;
};
export declare type DynamicRoutes = Array<{
    page: string;
    match: RouteMatch;
}>;
export declare type PageChecker = (pathname: string) => Promise<boolean>;
export declare function hasBasePath(pathname: string, basePath: string): boolean;
export declare function replaceBasePath(pathname: string, basePath: string): string;
export default class Router {
    basePath: string;
    headers: Route[];
    fsRoutes: Route[];
    redirects: Route[];
    rewrites: {
        beforeFiles: Route[];
        afterFiles: Route[];
        fallback: Route[];
    };
    catchAllRoute: Route;
    catchAllMiddleware?: Route;
    pageChecker: PageChecker;
    dynamicRoutes: DynamicRoutes;
    useFileSystemPublicRoutes: boolean;
    locales: string[];
    seenRequests: Set<any>;
    constructor({ basePath, headers, fsRoutes, rewrites, redirects, catchAllRoute, catchAllMiddleware, dynamicRoutes, pageChecker, useFileSystemPublicRoutes, locales, }: {
        basePath: string;
        headers: Route[];
        fsRoutes: Route[];
        rewrites: {
            beforeFiles: Route[];
            afterFiles: Route[];
            fallback: Route[];
        };
        redirects: Route[];
        catchAllRoute: Route;
        catchAllMiddleware?: Route;
        dynamicRoutes: DynamicRoutes | undefined;
        pageChecker: PageChecker;
        useFileSystemPublicRoutes: boolean;
        locales: string[];
    });
    setDynamicRoutes(routes?: DynamicRoutes): void;
    addFsRoute(fsRoute: Route): void;
    execute(req: BaseNextRequest, res: BaseNextResponse, parsedUrl: NextUrlWithParsedQuery): Promise<boolean>;
}
export {};
