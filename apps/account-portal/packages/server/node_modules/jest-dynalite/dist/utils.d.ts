export declare const isPromise: <R>(p: unknown) => p is Promise<R>;
export declare const isFunction: <F>(f: unknown) => f is () => F;
export declare const omit: <T, K extends (keyof T)[]>(obj: T, ...keys: K) => { [P in Exclude<keyof T, K[number]>]: T[P]; };
export declare const runWithRealTimers: <T, R>(callback: () => T | Promise<R>) => T | Promise<R>;
export declare const hasV3: () => boolean;
export declare const sleep: (time: number) => Promise<void>;
