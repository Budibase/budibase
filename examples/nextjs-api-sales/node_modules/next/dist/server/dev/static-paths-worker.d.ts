import type { GetStaticPaths } from 'next/types';
import type { NextConfigComplete } from '../config-shared';
import type { UnwrapPromise } from '../../lib/coalesced-function';
import '../node-polyfill-fetch';
declare type RuntimeConfig = any;
export declare function loadStaticPaths(distDir: string, pathname: string, serverless: boolean, config: RuntimeConfig, httpAgentOptions: NextConfigComplete['httpAgentOptions'], locales?: string[], defaultLocale?: string): Promise<Omit<UnwrapPromise<ReturnType<GetStaticPaths>>, 'paths'> & {
    paths: string[];
    encodedPaths: string[];
}>;
export {};
