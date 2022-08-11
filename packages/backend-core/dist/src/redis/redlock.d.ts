import Redlock from "redlock";
export declare const getRedlock: (redisClient: any, opts?: {
    retryCount: number;
}) => Redlock;
