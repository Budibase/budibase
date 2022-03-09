import type { NextConfig, DomainLocale } from '../../../../server/config-shared';
import type { ParsedUrl } from './parse-url';
import type { PathLocale } from '../../i18n/normalize-locale-path';
interface Params {
    headers?: {
        [key: string]: string | string[] | undefined;
    };
    nextConfig: NextConfig;
    url?: string;
}
export declare function parseNextUrl({ headers, nextConfig, url }: Params): ParsedNextUrl;
export interface ParsedNextUrl extends ParsedUrl {
    basePath?: string;
    locale?: {
        defaultLocale: string;
        domain?: DomainLocale;
        locale: string;
        path: PathLocale;
        redirect?: string;
        trailingSlash?: boolean;
    };
}
export {};
