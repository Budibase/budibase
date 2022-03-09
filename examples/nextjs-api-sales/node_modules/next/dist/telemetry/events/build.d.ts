import { TelemetryPlugin } from '../../build/webpack/plugins/telemetry-plugin';
declare type EventTypeCheckCompleted = {
    durationInSeconds: number;
    typescriptVersion: string | null;
    inputFilesCount?: number;
    totalFilesCount?: number;
    incremental?: boolean;
};
export declare function eventTypeCheckCompleted(event: EventTypeCheckCompleted): {
    eventName: string;
    payload: EventTypeCheckCompleted;
};
export declare type EventLintCheckCompleted = {
    durationInSeconds: number;
    eslintVersion: string | null;
    lintedFilesCount?: number;
    lintFix?: boolean;
    buildLint?: boolean;
    nextEslintPluginVersion?: string | null;
    nextEslintPluginErrorsCount?: number;
    nextEslintPluginWarningsCount?: number;
};
export declare function eventLintCheckCompleted(event: EventLintCheckCompleted): {
    eventName: string;
    payload: EventLintCheckCompleted;
};
declare type EventBuildCompleted = {
    durationInSeconds: number;
    totalPageCount: number;
    hasDunderPages: boolean;
    hasTestPages: boolean;
};
export declare function eventBuildCompleted(pagePaths: string[], event: Omit<EventBuildCompleted, 'totalPageCount' | 'hasDunderPages' | 'hasTestPages'>): {
    eventName: string;
    payload: EventBuildCompleted;
};
declare type EventBuildOptimized = {
    durationInSeconds: number;
    totalPageCount: number;
    staticPageCount: number;
    staticPropsPageCount: number;
    serverPropsPageCount: number;
    ssrPageCount: number;
    hasDunderPages: boolean;
    hasTestPages: boolean;
    hasStatic404: boolean;
    hasReportWebVitals: boolean;
    headersCount: number;
    rewritesCount: number;
    redirectsCount: number;
    headersWithHasCount: number;
    rewritesWithHasCount: number;
    redirectsWithHasCount: number;
    middlewareCount: number;
};
export declare function eventBuildOptimize(pagePaths: string[], event: Omit<EventBuildOptimized, 'totalPageCount' | 'hasDunderPages' | 'hasTestPages'>): {
    eventName: string;
    payload: EventBuildOptimized;
};
export declare const EVENT_BUILD_FEATURE_USAGE = "NEXT_BUILD_FEATURE_USAGE";
export declare type EventBuildFeatureUsage = {
    featureName: 'next/image' | 'next/script' | 'next/dynamic' | 'experimental/optimizeCss' | 'optimizeFonts' | 'swcLoader' | 'swcMinify' | 'swcRelay' | 'swcStyledComponents' | 'swcReactRemoveProperties' | 'swcExperimentalDecorators' | 'swcRemoveConsole' | 'swcImportSource' | 'build-lint';
    invocationCount: number;
};
export declare function eventBuildFeatureUsage(telemetryPlugin: TelemetryPlugin): Array<{
    eventName: string;
    payload: EventBuildFeatureUsage;
}>;
export {};
