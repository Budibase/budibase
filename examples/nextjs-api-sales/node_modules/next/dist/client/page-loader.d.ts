import type { ComponentType } from 'react';
import type { RouteLoader } from './route-loader';
declare global {
    interface Window {
        __DEV_MIDDLEWARE_MANIFEST?: [location: string, isSSR: boolean][];
        __DEV_PAGES_MANIFEST?: {
            pages: string[];
        };
        __SSG_MANIFEST_CB?: () => void;
        __SSG_MANIFEST?: Set<string>;
    }
}
export declare type StyleSheetTuple = {
    href: string;
    text: string;
};
export declare type GoodPageCache = {
    page: ComponentType;
    mod: any;
    styleSheets: StyleSheetTuple[];
};
export default class PageLoader {
    private buildId;
    private assetPrefix;
    private promisedSsgManifest;
    private promisedDevPagesManifest?;
    private promisedMiddlewareManifest?;
    routeLoader: RouteLoader;
    constructor(buildId: string, assetPrefix: string);
    getPageList(): string[] | Promise<string[]>;
    getMiddlewareList(): [location: string, isSSR: boolean][] | Promise<[location: string, isSSR: boolean][]>;
    /**
     * @param {string} href the route href (file-system path)
     * @param {string} asPath the URL as shown in browser (virtual path); used for dynamic routes
     * @returns {string}
     */
    getDataHref({ href, asPath, ssg, rsc, locale, }: {
        href: string;
        asPath: string;
        ssg?: boolean;
        rsc?: boolean;
        locale?: string | false;
    }): string;
    /**
     * @param {string} route - the route (file-system path)
     */
    _isSsg(route: string): Promise<boolean>;
    loadPage(route: string): Promise<GoodPageCache>;
    prefetch(route: string): Promise<void>;
}
