import { SpanId } from './shared';
export declare enum SpanStatus {
    Started = 0,
    Stopped = 1
}
export declare class Span {
    name: string;
    id: SpanId;
    parentId?: SpanId;
    duration: number | null;
    attrs: {
        [key: string]: any;
    };
    status: SpanStatus;
    _start: bigint;
    constructor({ name, parentId, attrs, startTime, }: {
        name: string;
        parentId?: SpanId;
        startTime?: bigint;
        attrs?: Object;
    });
    stop(stopTime?: bigint): void;
    traceChild(name: string, attrs?: Object): Span;
    manualTraceChild(name: string, startTime: bigint, stopTime: bigint, attrs?: Object): void;
    setAttribute(key: string, value: any): void;
    traceFn<T>(fn: () => T): T;
    traceAsyncFn<T>(fn: () => T | Promise<T>): Promise<T>;
}
export declare const trace: (name: string, parentId?: number | undefined, attrs?: {
    [key: string]: string;
} | undefined) => Span;
export declare const flushAllTraces: () => Promise<void>;
