/// <reference types="node" />
import type { ServerResponse, IncomingMessage } from 'http';
import type { Writable, Readable } from 'stream';
import { NextApiRequestCookies, SYMBOL_CLEARED_COOKIES } from '../api-utils';
import { NEXT_REQUEST_META, RequestMeta } from '../request-meta';
import { BaseNextRequest, BaseNextResponse } from './index';
export declare class NodeNextRequest extends BaseNextRequest<Readable> {
    private _req;
    headers: import("http").IncomingHttpHeaders;
    [NEXT_REQUEST_META]: RequestMeta;
    get originalRequest(): IncomingMessage & {
        cookies?: NextApiRequestCookies | undefined;
        [NEXT_REQUEST_META]?: RequestMeta | undefined;
    };
    constructor(_req: IncomingMessage & {
        [NEXT_REQUEST_META]?: RequestMeta;
        cookies?: NextApiRequestCookies;
    });
    parseBody(limit: string | number): Promise<any>;
}
export declare class NodeNextResponse extends BaseNextResponse<Writable> {
    private _res;
    private textBody;
    [SYMBOL_CLEARED_COOKIES]?: boolean;
    get originalResponse(): ServerResponse & {
        [SYMBOL_CLEARED_COOKIES]?: boolean | undefined;
    };
    constructor(_res: ServerResponse & {
        [SYMBOL_CLEARED_COOKIES]?: boolean;
    });
    get sent(): boolean;
    get statusCode(): number;
    set statusCode(value: number);
    get statusMessage(): string;
    set statusMessage(value: string);
    setHeader(name: string, value: string | string[]): this;
    getHeaderValues(name: string): string[] | undefined;
    hasHeader(name: string): boolean;
    getHeader(name: string): string | undefined;
    appendHeader(name: string, value: string): this;
    body(value: string): this;
    send(): void;
}
