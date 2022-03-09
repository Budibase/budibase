import type { I18NConfig } from '../../config-shared';
import type { RequestData } from '../types';
import { NextURL } from '../next-url';
export declare const INTERNALS: unique symbol;
export declare class NextRequest extends Request {
    [INTERNALS]: {
        cookieParser(): {
            [key: string]: string;
        };
        geo: RequestData['geo'];
        ip?: string;
        page?: {
            name?: string;
            params?: {
                [key: string]: string;
            };
        };
        ua?: UserAgent | null;
        url: NextURL;
    };
    constructor(input: Request | string, init?: RequestInit);
    get cookies(): {
        [key: string]: string;
    };
    get geo(): {
        city?: string | undefined;
        country?: string | undefined;
        region?: string | undefined;
        latitude?: string | undefined;
        longitude?: string | undefined;
    } | undefined;
    get ip(): string | undefined;
    get preflight(): string | null;
    get nextUrl(): NextURL;
    get page(): {
        name: string | undefined;
        params: {
            [key: string]: string;
        } | undefined;
    };
    get ua(): UserAgent | null | undefined;
    get url(): string;
}
export interface RequestInit extends globalThis.RequestInit {
    geo?: {
        city?: string;
        country?: string;
        region?: string;
    };
    ip?: string;
    nextConfig?: {
        basePath?: string;
        i18n?: I18NConfig | null;
        trailingSlash?: boolean;
    };
    page?: {
        name?: string;
        params?: {
            [key: string]: string;
        };
    };
}
interface UserAgent {
    isBot: boolean;
    ua: string;
    browser: {
        name?: string;
        version?: string;
    };
    device: {
        model?: string;
        type?: string;
        vendor?: string;
    };
    engine: {
        name?: string;
        version?: string;
    };
    os: {
        name?: string;
        version?: string;
    };
    cpu: {
        architecture?: string;
    };
}
export {};
