import '../build/polyfills/polyfill-module';
import { MittEmitter } from '../shared/lib/mitt';
import type Router from '../shared/lib/router/router';
import { NEXT_DATA } from '../shared/lib/utils';
declare global {
    interface Window {
        __NEXT_HYDRATED?: boolean;
        __NEXT_HYDRATED_CB?: () => void;
        __NEXT_PRELOADREADY?: (ids?: (string | number)[]) => void;
        __NEXT_DATA__: NEXT_DATA;
        __NEXT_P: any[];
    }
}
export declare const version: string | undefined;
export declare let router: Router;
export declare const emitter: MittEmitter<string>;
export declare function initNext(opts?: {
    webpackHMR?: any;
    beforeRender?: () => Promise<void>;
}): Promise<void>;
