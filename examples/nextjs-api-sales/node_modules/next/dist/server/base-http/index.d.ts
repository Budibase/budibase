/// <reference types="node" />
import type { IncomingHttpHeaders } from 'http';
import type { I18NConfig } from '../config-shared';
import { NextApiRequestCookies } from '../api-utils';
export interface BaseNextRequestConfig {
    basePath: string | undefined;
    i18n?: I18NConfig;
    trailingSlash?: boolean | undefined;
}
export declare abstract class BaseNextRequest<Body = any> {
    method: string;
    url: string;
    body: Body;
    protected _cookies: NextApiRequestCookies | undefined;
    abstract headers: IncomingHttpHeaders;
    constructor(method: string, url: string, body: Body);
    abstract parseBody(limit: string | number): Promise<any>;
    get cookies(): NextApiRequestCookies;
}
export declare abstract class BaseNextResponse<Destination = any> {
    destination: Destination;
    abstract statusCode: number | undefined;
    abstract statusMessage: string | undefined;
    abstract get sent(): boolean;
    constructor(destination: Destination);
    /**
     * Sets a value for the header overwriting existing values
     */
    abstract setHeader(name: string, value: string | string[]): this;
    /**
     * Appends value for the given header name
     */
    abstract appendHeader(name: string, value: string): this;
    /**
     * Get all vaues for a header as an array or undefined if no value is present
     */
    abstract getHeaderValues(name: string): string[] | undefined;
    abstract hasHeader(name: string): boolean;
    /**
     * Get vaues for a header concatenated using `,` or undefined if no value is present
     */
    abstract getHeader(name: string): string | undefined;
    abstract body(value: string): this;
    abstract send(): void;
    redirect(destination: string, statusCode: number): this;
}
