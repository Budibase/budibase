import { IncomingMessage, ServerResponse } from 'http';
import { ServerlessHandlerCtx } from './utils';
import RenderResult from '../../../../server/render-result';
export declare function getPageHandler(ctx: ServerlessHandlerCtx): {
    renderReqToHTML: (req: IncomingMessage, res: ServerResponse, renderMode?: true | "export" | "passthrough" | undefined, _renderOpts?: any, _params?: any) => Promise<string | {
        html: RenderResult | null;
        renderOpts: any;
    } | null>;
    render: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
};
