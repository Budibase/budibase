import type { webpack5 as webpack } from 'next/dist/compiled/webpack/webpack';
import type ws from 'ws';
export declare class WebpackHotMiddleware {
    eventStream: EventStream;
    latestStats: webpack.Stats | null;
    clientLatestStats: webpack.Stats | null;
    closed: boolean;
    serverError: boolean;
    constructor(compilers: webpack.Compiler[]);
    onServerInvalid: () => void;
    onClientInvalid: () => void;
    onServerDone: (statsResult: webpack.Stats) => void;
    onClientDone: (statsResult: webpack.Stats) => void;
    onHMR: (client: ws) => void;
    publishStats: (action: string, statsResult: webpack.Stats) => void;
    publish: (payload: any) => void;
    close: () => void;
}
declare class EventStream {
    clients: Set<ws>;
    constructor();
    everyClient(fn: (client: ws) => void): void;
    close(): void;
    handler(client: ws): void;
    publish(payload: any): void;
}
export {};
