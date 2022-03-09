import type { Header, Redirect, Rewrite, RouteType } from '../lib/load-custom-routes';
import type { Route } from './router';
import type { BaseNextRequest } from './base-http';
import type { ParsedUrlQuery } from 'querystring';
export declare const getCustomRoute: ({ type, rule, restrictedRedirectPaths, }: {
    rule: Rewrite | Redirect | Header;
    type: RouteType;
    restrictedRedirectPaths: string[];
}) => Route & Rewrite & Header;
export declare const createHeaderRoute: ({ rule, restrictedRedirectPaths, }: {
    rule: Header;
    restrictedRedirectPaths: string[];
}) => Route;
export declare const createRedirectRoute: ({ rule, restrictedRedirectPaths, }: {
    rule: Redirect;
    restrictedRedirectPaths: string[];
}) => Route;
export declare const stringifyQuery: (req: BaseNextRequest, query: ParsedUrlQuery) => string;
