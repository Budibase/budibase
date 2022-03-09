import type { FontManifest } from '../server/font-utils';
import type { NextConfigComplete } from '../server/config-shared';
import type { NextParsedUrlQuery } from '../server/request-meta';
import AmpHtmlValidator from 'next/dist/compiled/amphtml-validator';
import '../server/node-polyfill-fetch';
interface AmpValidation {
    page: string;
    result: {
        errors: AmpHtmlValidator.ValidationError[];
        warnings: AmpHtmlValidator.ValidationError[];
    };
}
interface PathMap {
    page: string;
    query?: NextParsedUrlQuery;
}
interface ExportPageInput {
    path: string;
    pathMap: PathMap;
    distDir: string;
    outDir: string;
    pagesDataDir: string;
    renderOpts: RenderOpts;
    buildExport?: boolean;
    serverRuntimeConfig: {
        [key: string]: any;
    };
    subFolders?: boolean;
    serverless: boolean;
    optimizeFonts: boolean;
    optimizeCss: any;
    disableOptimizedLoading: any;
    parentSpanId: any;
    httpAgentOptions: NextConfigComplete['httpAgentOptions'];
}
interface ExportPageResults {
    ampValidations: AmpValidation[];
    fromBuildExportRevalidate?: number;
    error?: boolean;
    ssgNotFound?: boolean;
    duration: number;
}
interface RenderOpts {
    runtimeConfig?: {
        [key: string]: any;
    };
    params?: {
        [key: string]: string | string[];
    };
    ampPath?: string;
    ampValidatorPath?: string;
    ampSkipValidation?: boolean;
    optimizeFonts?: boolean;
    disableOptimizedLoading?: boolean;
    optimizeCss?: any;
    fontManifest?: FontManifest;
    locales?: string[];
    locale?: string;
    defaultLocale?: string;
    trailingSlash?: boolean;
}
export default function exportPage({ parentSpanId, path, pathMap, distDir, outDir, pagesDataDir, renderOpts, buildExport, serverRuntimeConfig, subFolders, serverless, optimizeFonts, optimizeCss, disableOptimizedLoading, httpAgentOptions, }: ExportPageInput): Promise<ExportPageResults>;
export {};
