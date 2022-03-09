import { BinaryLike } from 'crypto';
declare type TelemetryEvent = {
    eventName: string;
    payload: object;
};
declare type RecordObject = {
    isFulfilled: boolean;
    isRejected: boolean;
    value?: any;
    reason?: any;
};
export declare class Telemetry {
    private conf;
    private sessionId;
    private rawProjectId;
    private NEXT_TELEMETRY_DISABLED;
    private NEXT_TELEMETRY_DEBUG;
    private queue;
    constructor({ distDir }: {
        distDir: string;
    });
    private notify;
    get anonymousId(): string;
    get salt(): string;
    private get isDisabled();
    setEnabled: (_enabled: boolean) => string | null;
    get isEnabled(): boolean;
    oneWayHash: (payload: BinaryLike) => string;
    private get projectId();
    record: (_events: TelemetryEvent | TelemetryEvent[]) => Promise<RecordObject>;
    flush: () => Promise<RecordObject[] | null>;
    private submitRecord;
}
export {};
