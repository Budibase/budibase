import type { webpack5 as webpack } from 'next/dist/compiled/webpack/webpack';
import type ws from 'ws';
import { NextConfigComplete } from '../config-shared';
export declare const ADDED: unique symbol;
export declare const BUILDING: unique symbol;
export declare const BUILT: unique symbol;
export declare const entries: {
    [page: string]: {
        bundlePath: string;
        absolutePagePath: string;
        status?: typeof ADDED | typeof BUILDING | typeof BUILT;
        lastActiveTime?: number;
        dispose?: boolean;
    };
};
export default function onDemandEntryHandler(watcher: any, multiCompiler: webpack.MultiCompiler, { pagesDir, nextConfig, maxInactiveAge, pagesBufferLength, }: {
    pagesDir: string;
    nextConfig: NextConfigComplete;
    maxInactiveAge: number;
    pagesBufferLength: number;
}): {
    ensurePage(page: string, clientOnly: boolean): Promise<void | [void, void]>;
    onHMR(client: ws): void;
};
