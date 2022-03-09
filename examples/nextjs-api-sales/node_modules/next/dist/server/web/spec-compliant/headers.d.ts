export declare type HeadersInit = Headers | string[][] | {
    [key: string]: string;
};
declare const MAP: unique symbol;
declare class BaseHeaders implements Headers {
    [MAP]: {
        [k: string]: string[];
    };
    constructor(init?: HeadersInit);
    get(name: string): string | null;
    forEach(callback: (value: string, name: string, parent: BaseHeaders) => void, thisArg?: any): void;
    set(name: string, value: string): void;
    append(name: string, value: string): void;
    has(name: string): boolean;
    delete(name: string): void;
    raw(): {
        [k: string]: string[];
    };
    keys(): any;
    values(): any;
    entries(): any;
    [Symbol.iterator](): any;
}
export { BaseHeaders as Headers };
