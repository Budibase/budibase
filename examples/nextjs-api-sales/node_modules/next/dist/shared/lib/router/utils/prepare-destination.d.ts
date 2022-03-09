/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { NextParsedUrlQuery } from '../../../../server/request-meta';
import type { Params } from '../../../../server/router';
import type { RouteHas } from '../../../../lib/load-custom-routes';
import type { BaseNextRequest } from '../../../../server/base-http';
export declare function matchHas(req: BaseNextRequest | IncomingMessage, has: RouteHas[], query: Params): false | Params;
export declare function compileNonPath(value: string, params: Params): string;
export declare function prepareDestination(args: {
    appendParamsToQuery: boolean;
    destination: string;
    params: Params;
    query: NextParsedUrlQuery;
}): {
    newUrl: string;
    parsedDestination: import("./parse-url").ParsedUrl;
};
