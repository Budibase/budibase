export declare function pageNotFoundError(page: string): Error;
export declare function getPagePath(page: string, distDir: string, serverless: boolean, dev?: boolean, locales?: string[]): string;
export declare function requirePage(page: string, distDir: string, serverless: boolean): any;
export declare function requireFontManifest(distDir: string, serverless: boolean): any;
export declare function getMiddlewareInfo(params: {
    dev?: boolean;
    distDir: string;
    page: string;
    serverless: boolean;
}): {
    name: string;
    paths: string[];
    env: string[];
};
