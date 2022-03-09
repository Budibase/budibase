import { Body } from './body';
import { NextURL } from '../next-url';
export declare const INTERNALS: unique symbol;
declare class BaseRequest extends Body implements Request {
    [INTERNALS]: {
        credentials: RequestCredentials;
        headers: Headers;
        method: string;
        referrer: string;
        redirect: RequestRedirect;
        url: NextURL;
    };
    constructor(input: BaseRequest | string, init?: RequestInit);
    get url(): string;
    get credentials(): RequestCredentials;
    get method(): string;
    get referrer(): string;
    get headers(): Headers;
    get redirect(): RequestRedirect;
    clone(): BaseRequest;
    get cache(): any;
    get integrity(): any;
    get keepalive(): any;
    get mode(): any;
    get destination(): any;
    get referrerPolicy(): any;
    get signal(): any;
    get [Symbol.toStringTag](): string;
}
export { BaseRequest as Request };
