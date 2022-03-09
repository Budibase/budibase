import { IncomingMessage, ServerResponse } from 'http';
import { ServerlessHandlerCtx } from './utils';
import { NodeNextResponse, NodeNextRequest } from '../../../../server/base-http/node';
export declare function getApiHandler(ctx: ServerlessHandlerCtx): (rawReq: NodeNextRequest | IncomingMessage, rawRes: NodeNextResponse | ServerResponse) => Promise<void>;
