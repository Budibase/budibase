import type { ComponentType } from 'react';
declare global {
    interface Window {
        __BUILD_MANIFEST?: Record<string, string[]>;
        __BUILD_MANIFEST_CB?: Function;
        __MIDDLEWARE_MANIFEST?: [location: string, isSSR: boolean][];
        __MIDDLEWARE_MANIFEST_CB?: Function;
    }
}
interface LoadedEntrypointSuccess {
    component: ComponentType;
    exports: any;
}
interface LoadedEntrypointFailure {
    error: unknown;
}
declare type RouteEntrypoint = LoadedEntrypointSuccess | LoadedEntrypointFailure;
interface RouteStyleSheet {
    href: string;
    content: string;
}
interface LoadedRouteSuccess extends LoadedEntrypointSuccess {
    styles: RouteStyleSheet[];
}
interface LoadedRouteFailure {
    error: unknown;
}
declare type RouteLoaderEntry = LoadedRouteSuccess | LoadedRouteFailure;
export interface RouteLoader {
    whenEntrypoint(route: string): Promise<RouteEntrypoint>;
    onEntrypoint(route: string, execute: () => unknown): void;
    loadRoute(route: string, prefetch?: boolean): Promise<RouteLoaderEntry>;
    prefetch(route: string): Promise<void>;
}
export declare function markAssetError(err: Error): Error;
export declare function isAssetError(err?: Error): boolean | undefined;
export declare function getClientBuildManifest(): Promise<Record<string, string[]>>;
export declare function getMiddlewareManifest(): Promise<[location: string, isSSR: boolean][]>;
export declare function createRouteLoader(assetPrefix: string): RouteLoader;
export {};
