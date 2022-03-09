/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { BaseNextRequest } from '../base-http';
import { NextApiRequest, NextApiResponse } from '../../shared/lib/utils';
export declare type NextApiRequestCookies = {
    [key: string]: string;
};
export declare type NextApiRequestQuery = {
    [key: string]: string | string[];
};
export declare type __ApiPreviewProps = {
    previewModeId: string;
    previewModeEncryptionKey: string;
    previewModeSigningKey: string;
};
/**
 * Parse cookies from the `headers` of request
 * @param req request object
 */
export declare function getCookieParser(headers: {
    [key: string]: undefined | string | string[];
}): () => NextApiRequestCookies;
/**
 *
 * @param res response object
 * @param statusCode `HTTP` status code of response
 */
export declare function sendStatusCode(res: NextApiResponse, statusCode: number): NextApiResponse<any>;
/**
 *
 * @param res response object
 * @param [statusOrUrl] `HTTP` status code of redirect
 * @param url URL of redirect
 */
export declare function redirect(res: NextApiResponse, statusOrUrl: string | number, url?: string): NextApiResponse<any>;
export declare const PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
export declare function checkIsManualRevalidate(req: IncomingMessage | BaseNextRequest, previewProps: __ApiPreviewProps): boolean;
export declare const COOKIE_NAME_PRERENDER_BYPASS = "__prerender_bypass";
export declare const COOKIE_NAME_PRERENDER_DATA = "__next_preview_data";
export declare const SYMBOL_PREVIEW_DATA: unique symbol;
export declare const SYMBOL_CLEARED_COOKIES: unique symbol;
export declare function clearPreviewData<T>(res: NextApiResponse<T>): NextApiResponse<T>;
/**
 * Custom error class
 */
export declare class ApiError extends Error {
    readonly statusCode: number;
    constructor(statusCode: number, message: string);
}
/**
 * Sends error in `response`
 * @param res response object
 * @param statusCode of response
 * @param message of response
 */
export declare function sendError(res: NextApiResponse, statusCode: number, message: string): void;
interface LazyProps {
    req: NextApiRequest;
}
/**
 * Execute getter function only if its needed
 * @param LazyProps `req` and `params` for lazyProp
 * @param prop name of property
 * @param getter function to get data
 */
export declare function setLazyProp<T>({ req }: LazyProps, prop: string, getter: () => T): void;
export {};
