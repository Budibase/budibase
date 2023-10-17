/// <reference types="node" />
import { BaseTransportOptions, NewTransport } from '@sentry/core';
import { HTTPModule } from './base/http-module';
export interface NodeTransportOptions extends BaseTransportOptions {
    /** Define custom headers */
    headers?: Record<string, string>;
    /** Set a proxy that should be used for outbound requests. */
    proxy?: string;
    /** HTTPS proxy CA certificates */
    caCerts?: string | Buffer | Array<string | Buffer>;
    /** Custom HTTP module. Defaults to the native 'http' and 'https' modules. */
    httpModule?: HTTPModule;
}
/**
 * Creates a Transport that uses native the native 'http' and 'https' modules to send events to Sentry.
 */
export declare function makeNodeTransport(options: NodeTransportOptions): NewTransport;
//# sourceMappingURL=new.d.ts.map