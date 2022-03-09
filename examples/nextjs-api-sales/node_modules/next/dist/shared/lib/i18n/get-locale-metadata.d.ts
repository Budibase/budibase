import type { I18NConfig, DomainLocale } from '../../../server/config-shared';
interface Params {
    cookies(): {
        [key: string]: string;
    };
    headers?: {
        [key: string]: string | string[] | undefined;
    };
    nextConfig: {
        basePath?: string;
        i18n: I18NConfig;
        trailingSlash?: boolean;
    };
    url: {
        hostname?: string | null;
        pathname: string;
    };
}
export declare function getLocaleMetadata(params: Params): {
    path: import("./normalize-locale-path").PathLocale;
    domain: DomainLocale | undefined;
    defaultLocale: string;
    locale: string;
    redirect: string | undefined;
    trailingSlash: boolean | undefined;
};
export {};
