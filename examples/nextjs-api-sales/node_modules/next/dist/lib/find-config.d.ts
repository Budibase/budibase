declare type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
export declare function findConfig<T>(directory: string, key: string): Promise<RecursivePartial<T> | null>;
export {};
