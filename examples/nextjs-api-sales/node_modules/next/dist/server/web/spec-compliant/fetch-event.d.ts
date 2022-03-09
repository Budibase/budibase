export declare const responseSymbol: unique symbol;
export declare const passThroughSymbol: unique symbol;
export declare const waitUntilSymbol: unique symbol;
export declare class FetchEvent {
    readonly [waitUntilSymbol]: Promise<any>[];
    [responseSymbol]?: Promise<Response>;
    [passThroughSymbol]: boolean;
    constructor(_request: Request);
    respondWith(response: Response | Promise<Response>): void;
    passThroughOnException(): void;
    waitUntil(promise: Promise<any>): void;
}
