import { SpanId } from '../shared';
declare type Reporter = {
    flushAll: () => Promise<void> | void;
    report: (spanName: string, duration: number, timestamp: number, id: SpanId, parentId?: SpanId, attrs?: Object) => void;
};
declare class MultiReporter implements Reporter {
    private reporters;
    constructor(reporters: Reporter[]);
    flushAll(): Promise<void>;
    report(spanName: string, duration: number, timestamp: number, id: SpanId, parentId?: SpanId, attrs?: Object): void;
}
export declare const reporter: MultiReporter;
export {};
