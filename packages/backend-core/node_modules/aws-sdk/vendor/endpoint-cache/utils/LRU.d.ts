export declare class LRUCache<T> {
    private headerNode;
    private tailNode;
    private nodeMap;
    private size;
    private readonly sizeLimit;
    constructor(size: number);
    readonly length: number;
    private prependToList;
    private removeFromTail;
    private detachFromList;
    get(key: string): T | undefined;
    remove(key: string): void;
    put(key: string, value: T): void;
    empty(): void;
}
