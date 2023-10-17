import { Request, Response, CookieOptions } from 'express';

declare module 'node-mocks-http' {

    export type RequestMethod =
        'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

    export interface Params {
        [key: string]: any;
    }

    export interface Session {
        [key: string]: any;
    }

    export interface Cookies {
        [key: string]: string;
    }

    export interface Headers {
        'accept'?: string;
        'accept-language'?: string;
        'accept-patch'?: string;
        'accept-ranges'?: string;
        'access-control-allow-credentials'?: string;
        'access-control-allow-headers'?: string;
        'access-control-allow-methods'?: string;
        'access-control-allow-origin'?: string;
        'access-control-expose-headers'?: string;
        'access-control-max-age'?: string;
        'age'?: string;
        'allow'?: string;
        'alt-svc'?: string;
        'authorization'?: string;
        'cache-control'?: string;
        'connection'?: string;
        'content-disposition'?: string;
        'content-encoding'?: string;
        'content-language'?: string;
        'content-length'?: string;
        'content-location'?: string;
        'content-range'?: string;
        'content-type'?: string;
        'cookie'?: string;
        'date'?: string;
        'expect'?: string;
        'expires'?: string;
        'forwarded'?: string;
        'from'?: string;
        'host'?: string;
        'if-match'?: string;
        'if-modified-since'?: string;
        'if-none-match'?: string;
        'if-unmodified-since'?: string;
        'last-modified'?: string;
        'location'?: string;
        'pragma'?: string;
        'proxy-authenticate'?: string;
        'proxy-authorization'?: string;
        'public-key-pins'?: string;
        'range'?: string;
        'referer'?: string;
        'retry-after'?: string;
        'set-cookie'?: string[];
        'strict-transport-security'?: string;
        'tk'?: string;
        'trailer'?: string;
        'transfer-encoding'?: string;
        'upgrade'?: string;
        'user-agent'?: string;
        'vary'?: string;
        'via'?: string;
        'warning'?: string;
        'www-authenticate'?: string;
        [header: string]: string | string[] | undefined;
    }

    export interface Query {
        [key: string]: any;
    }

    export interface Files {
        [key: string]: string;
    }

    export interface Body {
        [key: string]: any;
    }

    export interface RequestOptions {
        method?: RequestMethod;
        url?: string;
        originalUrl?: string;
        baseUrl?: string;
        path?: string;
        params?: Params;
        session?: Session;
        cookies?: Cookies;
        signedCookies?: Cookies;
        headers?: Headers;
        body?: Body;
        query?: Query;
        files?: Files;
        ip?: string;

        // Support custom properties appended on Request objects.
        [key: string]: any;
    }

    export type MockRequest<T extends Request> = T & {
        _setParameter: (key: string, value: string) => void;
        _setSessionVariable: (variable: string, value: string) => void;
        _setCookiesVariable: (variable: string, value: string) => void;
        _setSignedCookiesVariable: (variable: string, value: string) => void;
        _setHeadersCookiesVariable: (variable: string, value: string) => void;
        _setFilesCookiesVariable: (variable: string, value: string) => void;
        _setMethod: (method: string) => void;
        _setURL: (value: string) => void;
        _setOriginalUrl: (value: string) => void;
        _setBody: (body: Body) => void;
        _addBody: (key: string, value: any) => void;

        // Support custom properties appended on Request objects.
        [key: string]: any;
    }

    export interface ResponseOptions {
        eventEmitter?: any;
        writableStream?: any;
        req?: any;
        locals?: any;
    }

    export type ResponseCookie = {
        value: any;
        options: CookieOptions;
    }

    export type MockResponse<T extends Response> = T & {
        _isEndCalled: () => boolean;
        _getHeaders: () => Headers;
        _getData: () => any;
        _getJSONData: () => any;
        _getBuffer: () => Buffer;
        _getLocals: () => any;
        _getStatusCode: () => number;
        _getStatusMessage: () => string;
        _isJSON: () => boolean;
        _isUTF8: () => boolean;
        _isDataLengthValid: () => boolean;
        _getRedirectUrl: () => string;
        _getRenderData: () => any;
        _getRenderView: () => string;

        cookies: {[name: string]: ResponseCookie};
    }

    export function createRequest<T extends Request = Request>(options?: RequestOptions): MockRequest<T>;

    export function createResponse<T extends Response = Response>(options?: ResponseOptions): MockResponse<T>;

    export interface Mocks<T1 extends Request, T2 extends Response> {
        req: MockRequest<T1>;
        res: MockResponse<T2>;
    }

    export function createMocks<T1 extends Request = Request, T2 extends Response = Response>(reqOptions?: RequestOptions, resOptions?: ResponseOptions): Mocks<T1, T2>;
}
