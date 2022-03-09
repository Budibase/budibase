import { FetchEvent } from '../spec-compliant/fetch-event';
import { NextRequest } from './request';
export declare class NextFetchEvent extends FetchEvent {
    sourcePage: string;
    constructor(params: {
        request: NextRequest;
        page: string;
    });
    get request(): void;
    respondWith(): void;
}
