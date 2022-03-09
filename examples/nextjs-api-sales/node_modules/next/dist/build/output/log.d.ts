export declare const prefixes: {
    wait: string;
    error: string;
    warn: string;
    ready: string;
    info: string;
    event: string;
    trace: string;
};
export declare function wait(...message: string[]): void;
export declare function error(...message: string[]): void;
export declare function warn(...message: string[]): void;
export declare function ready(...message: string[]): void;
export declare function info(...message: string[]): void;
export declare function event(...message: string[]): void;
export declare function trace(...message: string[]): void;
