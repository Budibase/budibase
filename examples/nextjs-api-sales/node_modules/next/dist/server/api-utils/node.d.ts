/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { __ApiPreviewProps } from '.';
import type { BaseNextRequest, BaseNextResponse } from '../base-http';
import type { PreviewData } from 'next/types';
export declare function tryGetPreviewData(req: IncomingMessage | BaseNextRequest, res: ServerResponse | BaseNextResponse, options: __ApiPreviewProps): PreviewData;
/**
 * Parse incoming message like `json` or `urlencoded`
 * @param req request object
 */
export declare function parseBody(req: IncomingMessage, limit: string | number): Promise<any>;
export declare function apiResolver(req: IncomingMessage, res: ServerResponse, query: any, resolverModule: any, apiContext: __ApiPreviewProps & {
    trustHostHeader?: boolean;
    hostname?: string;
    port?: number;
}, propagateError: boolean, dev?: boolean, page?: string): Promise<void>;
