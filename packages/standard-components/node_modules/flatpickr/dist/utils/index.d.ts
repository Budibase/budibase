export declare const pad: (number: string | number, length?: number) => string;
export declare const int: (bool: boolean) => 1 | 0;
export declare function debounce<F extends Function>(fn: F, wait: number): (this: any) => void;
export declare const arrayify: <T>(obj: T | T[]) => T[];
export declare type IncrementEvent = MouseEvent & {
    delta: number;
    type: "increment";
};
