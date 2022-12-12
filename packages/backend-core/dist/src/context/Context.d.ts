/// <reference types="node" />
import { AsyncLocalStorage } from "async_hooks";
export default class Context {
    static storage: AsyncLocalStorage<Record<string, any>>;
    static run(context: Record<string, any>, func: any): any;
    static get(): Record<string, any>;
    static set(context: Record<string, any>): void;
}
