import type { NextConfig } from '../server/config';
export declare type RouteHas = {
    type: 'header' | 'query' | 'cookie';
    key: string;
    value?: string;
} | {
    type: 'host';
    key?: undefined;
    value: string;
};
export declare type Rewrite = {
    source: string;
    destination: string;
    basePath?: false;
    locale?: false;
    has?: RouteHas[];
};
export declare type Header = {
    source: string;
    basePath?: false;
    locale?: false;
    headers: Array<{
        key: string;
        value: string;
    }>;
    has?: RouteHas[];
};
export declare type Redirect = {
    source: string;
    destination: string;
    basePath?: false;
    locale?: false;
    has?: RouteHas[];
    statusCode?: number;
    permanent?: boolean;
};
export declare const allowedStatusCodes: Set<number>;
export declare function getRedirectStatus(route: {
    statusCode?: number;
    permanent?: boolean;
}): number;
export declare function normalizeRouteRegex(regex: string): string;
export declare function modifyRouteRegex(regex: string, restrictedPaths?: string[]): string;
export declare type RouteType = 'rewrite' | 'redirect' | 'header';
export interface CustomRoutes {
    headers: Header[];
    rewrites: {
        fallback: Rewrite[];
        afterFiles: Rewrite[];
        beforeFiles: Rewrite[];
    };
    redirects: Redirect[];
}
export default function loadCustomRoutes(config: NextConfig): Promise<CustomRoutes>;
