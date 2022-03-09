/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { NextConfigComplete } from './config-shared';
import { NextUrlWithParsedQuery } from './request-meta';
import { IncrementalCacheEntry, IncrementalCacheValue } from './response-cache';
declare type XCacheHeader = 'MISS' | 'HIT' | 'STALE';
export interface ImageParamsResult {
    href: string;
    isAbsolute: boolean;
    isStatic: boolean;
    width: number;
    quality: number;
    mimeType: string;
    sizes: number[];
    minimumCacheTTL: number;
}
export declare class ImageOptimizerCache {
    private cacheDir;
    private nextConfig;
    static validateParams(req: IncomingMessage, query: UrlWithParsedQuery['query'], nextConfig: NextConfigComplete, isDev: boolean): ImageParamsResult | {
        errorMessage: string;
    };
    static getCacheKey({ href, width, quality, mimeType, }: {
        href: string;
        width: number;
        quality: number;
        mimeType: string;
    }): string;
    constructor({ distDir, nextConfig, }: {
        distDir: string;
        nextConfig: NextConfigComplete;
    });
    get(cacheKey: string): Promise<IncrementalCacheEntry | null>;
    set(cacheKey: string, value: IncrementalCacheValue | null, revalidate?: number | false): Promise<void>;
}
export declare class ImageError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare function imageOptimizer(_req: IncomingMessage, _res: ServerResponse, paramsResult: ImageParamsResult, nextConfig: NextConfigComplete, handleRequest: (newReq: IncomingMessage, newRes: ServerResponse, newParsedUrl?: NextUrlWithParsedQuery) => Promise<void>): Promise<{
    buffer: Buffer;
    contentType: string;
    maxAge: number;
}>;
export declare function sendResponse(req: IncomingMessage, res: ServerResponse, url: string, extension: string, buffer: Buffer, isStatic: boolean, xCache: XCacheHeader, contentSecurityPolicy: string): void;
export declare function getHash(items: (string | number | Buffer)[]): string;
/**
 * Inspects the first few bytes of a buffer to determine if
 * it matches the "magic number" of known file signatures.
 * https://en.wikipedia.org/wiki/List_of_file_signatures
 */
export declare function detectContentType(buffer: Buffer): "image/svg+xml" | "image/avif" | "image/webp" | "image/png" | "image/jpeg" | "image/gif" | null;
export declare function getMaxAge(str: string | null): number;
export declare function resizeImage(content: Buffer, dimension: 'width' | 'height', size: number, extension: 'avif' | 'webp' | 'png' | 'jpeg', quality: number): Promise<Buffer>;
export declare function getImageSize(buffer: Buffer, extension: 'avif' | 'webp' | 'png' | 'jpeg'): Promise<{
    width?: number;
    height?: number;
}>;
export declare class Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error?: Error) => void;
    constructor();
}
export {};
