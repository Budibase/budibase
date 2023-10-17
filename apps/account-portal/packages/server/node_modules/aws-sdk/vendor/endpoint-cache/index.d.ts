/**
 * Output shape for endpoint discovery operations
 */
export type DiscoveredEndpoints = Array<{Address?: string, CachePeriodInMinutes?: number}>
declare type EndpointRecords = Array<{
  Address: string;
  Expire: number;
}>;
export interface EndpointIdentifier {
    [key: string]: string | undefined;
    serviceId?: string;
    region?: string;
    accessKeyId?: string;
    operation?: string;
}
export declare class EndpointCache {
    readonly maxSize: number;
    private cache;
    constructor(maxSize?: number);
    readonly size: number;
    put(key: EndpointIdentifier | string, value: DiscoveredEndpoints): void;
    get(key: EndpointIdentifier | string): EndpointRecords | undefined;
    static getKeyString(key: EndpointIdentifier): string;
    private populateValue;
    empty(): void;
    remove(key: EndpointIdentifier | string): void;
}
