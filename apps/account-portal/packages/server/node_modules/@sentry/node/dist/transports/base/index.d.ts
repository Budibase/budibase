/// <reference types="node" />
import { APIDetails } from '@sentry/core';
import { DsnProtocol, Event, Response, SentryRequest, SentryRequestType, Session, SessionAggregates, Transport, TransportOptions } from '@sentry/types';
import { PromiseBuffer } from '@sentry/utils';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import { HTTPModule } from './http-module';
export declare type URLParts = Pick<URL, 'hostname' | 'pathname' | 'port' | 'protocol'>;
export declare type UrlParser = (url: string) => URLParts;
/** Base Transport class implementation */
export declare abstract class BaseTransport implements Transport {
    options: TransportOptions;
    /** The Agent used for corresponding transport */
    module?: HTTPModule;
    /** The Agent used for corresponding transport */
    client?: http.Agent | https.Agent;
    /** API object */
    protected _api: APIDetails;
    /** A simple buffer holding all requests. */
    protected readonly _buffer: PromiseBuffer<Response>;
    /** Locks transport after receiving rate limits in a response */
    protected readonly _rateLimits: Record<string, Date>;
    /** Create instance and set this.dsn */
    constructor(options: TransportOptions);
    /** Default function used to parse URLs */
    urlParser: UrlParser;
    /**
     * @inheritDoc
     */
    sendEvent(_: Event): PromiseLike<Response>;
    /**
     * @inheritDoc
     */
    close(timeout?: number): PromiseLike<boolean>;
    /**
     * Extracts proxy settings from client options and env variables.
     *
     * Honors `no_proxy` env variable with the highest priority to allow for hosts exclusion.
     *
     * An order of priority for available protocols is:
     * `http`  => `options.httpProxy` | `process.env.http_proxy`
     * `https` => `options.httpsProxy` | `options.httpProxy` | `process.env.https_proxy` | `process.env.http_proxy`
     */
    protected _getProxy(protocol: DsnProtocol): string | undefined;
    /** Returns a build request option object used by request */
    protected _getRequestOptions(urlParts: URLParts): http.RequestOptions | https.RequestOptions;
    /**
     * Gets the time that given category is disabled until for rate limiting
     */
    protected _disabledUntil(requestType: SentryRequestType): Date;
    /**
     * Checks if a category is rate limited
     */
    protected _isRateLimited(requestType: SentryRequestType): boolean;
    /**
     * Sets internal _rateLimits from incoming headers. Returns true if headers contains a non-empty rate limiting header.
     */
    protected _handleRateLimit(headers: Record<string, string | null>): boolean;
    /** JSDoc */
    protected _send(sentryRequest: SentryRequest, originalPayload?: Event | Session | SessionAggregates): Promise<Response>;
}
//# sourceMappingURL=index.d.ts.map