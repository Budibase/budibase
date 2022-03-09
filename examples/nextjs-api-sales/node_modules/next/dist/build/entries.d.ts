import { __ApiPreviewProps } from '../server/api-utils';
import { LoadedEnvFiles } from '@next/env';
import { NextConfigComplete } from '../server/config-shared';
import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
declare type ObjectValue<T> = T extends {
    [key: string]: infer V;
} ? V : never;
export declare type PagesMapping = {
    [page: string]: string;
};
export declare function getPageFromPath(pagePath: string, extensions: string[]): string;
export declare function createPagesMapping(pagePaths: string[], extensions: string[], { isDev, hasServerComponents, runtime, }: {
    isDev: boolean;
    hasServerComponents: boolean;
    runtime?: 'nodejs' | 'edge';
}): PagesMapping;
declare type Entrypoints = {
    client: webpack5.EntryObject;
    server: webpack5.EntryObject;
    edgeServer: webpack5.EntryObject;
};
export declare function createEntrypoints(pages: PagesMapping, target: 'server' | 'serverless' | 'experimental-serverless-trace', buildId: string, previewMode: __ApiPreviewProps, config: NextConfigComplete, loadedEnvFiles: LoadedEnvFiles): Entrypoints;
export declare function finalizeEntrypoint({ name, value, isServer, isMiddleware, isEdgeServer, }: {
    isServer: boolean;
    name: string;
    value: ObjectValue<webpack5.EntryObject>;
    isMiddleware?: boolean;
    isEdgeServer?: boolean;
}): ObjectValue<webpack5.EntryObject>;
export {};
