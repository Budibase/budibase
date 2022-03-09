import { NextWebVitalsMetric } from '../../pages/_app';
declare type ReportWebVitalsCallback = (webVitals: NextWebVitalsMetric) => any;
export declare const webVitalsCallbacks: Set<ReportWebVitalsCallback>;
export declare function getBufferedVitalsMetrics(): NextWebVitalsMetric[];
export declare function flushBufferedVitalsMetrics(): void;
export declare function trackWebVitalMetric(metric: NextWebVitalsMetric): void;
export declare function useWebVitalsReport(callback: ReportWebVitalsCallback): void;
export {};
