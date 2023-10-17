/// <reference types="node" />
import { Event, ExtractedNodeRequestData } from '@sentry/types';
import * as http from 'http';
export interface ExpressRequest {
    baseUrl?: string;
    connection?: {
        remoteAddress?: string;
    };
    ip?: string;
    method?: string;
    originalUrl?: string;
    route?: {
        path: string;
        stack: [{
            name: string;
        }];
    };
    query?: {
        [key: string]: unknown;
    };
    url?: string;
    user?: {
        [key: string]: any;
    };
}
/**
 * Express-compatible tracing handler.
 * @see Exposed as `Handlers.tracingHandler`
 */
export declare function tracingHandler(): (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void;
declare type TransactionNamingScheme = 'path' | 'methodPath' | 'handler';
/**
 * Normalizes data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param keys An optional array of keys to include in the normalized data. Defaults to DEFAULT_REQUEST_KEYS if not
 * provided.
 * @returns An object containing normalized request data
 */
export declare function extractRequestData(req: {
    [key: string]: any;
}, keys?: string[]): ExtractedNodeRequestData;
/**
 * Options deciding what parts of the request to use when enhancing an event
 */
export interface ParseRequestOptions {
    ip?: boolean;
    request?: boolean | string[];
    serverName?: boolean;
    transaction?: boolean | TransactionNamingScheme;
    user?: boolean | string[];
    version?: boolean;
}
/**
 * Enriches passed event with request data.
 *
 * @param event Will be mutated and enriched with req data
 * @param req Request object
 * @param options object containing flags to enable functionality
 * @hidden
 */
export declare function parseRequest(event: Event, req: ExpressRequest, options?: ParseRequestOptions): Event;
export declare type RequestHandlerOptions = ParseRequestOptions & {
    flushTimeout?: number;
};
/**
 * Express compatible request handler.
 * @see Exposed as `Handlers.requestHandler`
 */
export declare function requestHandler(options?: RequestHandlerOptions): (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void;
/** JSDoc */
interface MiddlewareError extends Error {
    status?: number | string;
    statusCode?: number | string;
    status_code?: number | string;
    output?: {
        statusCode?: number | string;
    };
}
/**
 * Express compatible error handler.
 * @see Exposed as `Handlers.errorHandler`
 */
export declare function errorHandler(options?: {
    /**
     * Callback method deciding whether error should be captured and sent to Sentry
     * @param error Captured middleware error
     */
    shouldHandleError?(error: MiddlewareError): boolean;
}): (error: MiddlewareError, req: http.IncomingMessage, res: http.ServerResponse, next: (error: MiddlewareError) => void) => void;
export {};
//# sourceMappingURL=handlers.d.ts.map