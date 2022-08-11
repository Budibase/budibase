export function getNamespace(name: any): any;
export function createNamespace(name: any): Namespace;
export function destroyNamespace(name: any): void;
export function reset(): void;
export const ERROR_SYMBOL: "error@context";
declare function Namespace(name: any): void;
declare class Namespace {
    constructor(name: any);
    name: any;
    active: any;
    _set: any[];
    id: any;
    _contexts: Map<any, any>;
    _indent: number;
    _hook: any;
    set(key: any, value: any): any;
    get(key: any): any;
    createContext(): any;
    run(fn: any): any;
    runAndReturn(fn: any): undefined;
    /**
     * Uses global Promise and assumes Promise is cls friendly or wrapped already.
     * @param {function} fn
     * @returns {*}
     */
    runPromise(fn: Function): any;
    bind(fn: any, context: any): (...args: any[]) => any;
    enter(context: any): void;
    exit(context: any): void;
    bindEmitter(emitter: any): void;
    /**
     * If an error comes out of a namespace, it will have a context attached to it.
     * This function knows how to find it.
     *
     * @param {Error} exception Possibly annotated error.
     */
    fromException(exception: Error): any;
}
export {};
