import type { NodeHeaders } from './types';
export declare function streamToIterator<T>(readable: ReadableStream<T>): AsyncIterableIterator<T>;
export declare function readableStreamTee<T = any>(readable: ReadableStream<T>): [ReadableStream<T>, ReadableStream<T>];
export declare function notImplemented(name: string, method: string): any;
export declare function fromNodeHeaders(object: NodeHeaders): Headers;
export declare function toNodeHeaders(headers?: Headers): NodeHeaders;
export declare function splitCookiesString(cookiesString: string): string[];
/**
 * Validate the correctness of a user-provided URL.
 */
export declare function validateURL(url: string | URL): string;
