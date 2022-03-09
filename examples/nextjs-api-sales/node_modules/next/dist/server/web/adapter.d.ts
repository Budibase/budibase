import type { NextMiddleware, RequestData, FetchEventResult } from './types';
export declare function adapter(params: {
    handler: NextMiddleware;
    page: string;
    request: RequestData;
}): Promise<FetchEventResult>;
