import type { NextServerOptions, NextServer } from '../next';
interface StartServerOptions extends NextServerOptions {
    allowRetry?: boolean;
}
export declare function startServer(opts: StartServerOptions): Promise<NextServer>;
export {};
