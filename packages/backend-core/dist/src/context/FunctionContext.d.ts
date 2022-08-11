export = FunctionContext;
declare class FunctionContext {
    static run(callback: any): undefined;
    static setOnContext(key: any, value: any): void;
    static getFromContext(key: any): any;
}
