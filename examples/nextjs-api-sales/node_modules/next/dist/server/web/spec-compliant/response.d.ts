import { Body, BodyInit } from './body';
import { NextURL } from '../next-url';
declare const INTERNALS: unique symbol;
declare class BaseResponse extends Body implements Response {
    [INTERNALS]: {
        headers: Headers;
        status: number;
        statusText: string;
        type: 'default' | 'error';
        url?: NextURL;
    };
    constructor(body?: BodyInit | null, init?: ResponseInit);
    static redirect(url: string, status?: number): Response;
    static error(): BaseResponse;
    get url(): string;
    get ok(): boolean;
    get status(): number;
    get statusText(): string;
    get headers(): Headers;
    get redirected(): boolean;
    get type(): "error" | "default";
    clone(): BaseResponse;
    get [Symbol.toStringTag](): string;
}
export interface ResponseInit {
    headers?: HeadersInit;
    status?: number;
    statusText?: string;
    url?: string;
}
export { BaseResponse as Response };
