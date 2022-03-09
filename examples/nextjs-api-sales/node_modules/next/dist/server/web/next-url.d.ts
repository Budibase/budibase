import type { PathLocale } from '../../shared/lib/i18n/normalize-locale-path';
import type { DomainLocale, I18NConfig } from '../config-shared';
interface Options {
    base?: string | URL;
    basePath?: string;
    headers?: {
        [key: string]: string | string[] | undefined;
    };
    i18n?: I18NConfig | null;
    trailingSlash?: boolean;
}
declare const Internal: unique symbol;
export declare class NextURL {
    [Internal]: {
        url: URL;
        options: Options;
        basePath: string;
        locale?: {
            defaultLocale: string;
            domain?: DomainLocale;
            locale: string;
            path: PathLocale;
            redirect?: string;
            trailingSlash?: boolean;
        };
    };
    constructor(input: string | URL, base?: string | URL, opts?: Options);
    constructor(input: string | URL, opts?: Options);
    private analyzeUrl;
    private formatPathname;
    get locale(): string;
    set locale(locale: string);
    get defaultLocale(): string | undefined;
    get domainLocale(): DomainLocale | undefined;
    get searchParams(): URLSearchParams;
    get host(): string;
    set host(value: string);
    get hostname(): string;
    set hostname(value: string);
    get port(): string;
    set port(value: string);
    get protocol(): string;
    set protocol(value: string);
    get href(): string;
    set href(url: string);
    get origin(): string;
    get pathname(): string;
    set pathname(value: string);
    get hash(): string;
    set hash(value: string);
    get search(): string;
    set search(value: string);
    get password(): string;
    set password(value: string);
    get username(): string;
    set username(value: string);
    get basePath(): string;
    set basePath(value: string);
    toString(): string;
    toJSON(): string;
    clone(): NextURL;
}
export {};
