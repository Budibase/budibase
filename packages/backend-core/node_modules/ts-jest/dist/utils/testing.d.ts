/// <reference types="jest" />
export declare type MockableFunction = (...args: any[]) => any;
export declare type MethodKeysOf<T> = {
    [K in keyof T]: T[K] extends MockableFunction ? K : never;
}[keyof T];
export declare type PropertyKeysOf<T> = {
    [K in keyof T]: T[K] extends MockableFunction ? never : K;
}[keyof T];
export declare type ArgumentsOf<T> = T extends (...args: infer A) => any ? A : never;
export declare type ConstructorArgumentsOf<T> = T extends new (...args: infer A) => any ? A : never;
export interface MockWithArgs<T extends MockableFunction> extends jest.MockInstance<ReturnType<T>, ArgumentsOf<T>> {
    new (...args: ConstructorArgumentsOf<T>): T;
    (...args: ArgumentsOf<T>): ReturnType<T>;
}
export declare type MaybeMockedConstructor<T> = T extends new (...args: any[]) => infer R ? jest.MockInstance<R, ConstructorArgumentsOf<T>> : T;
export declare type MockedFunction<T extends MockableFunction> = MockWithArgs<T> & {
    [K in keyof T]: T[K];
};
export declare type MockedFunctionDeep<T extends MockableFunction> = MockWithArgs<T> & MockedObjectDeep<T>;
export declare type MockedObject<T> = MaybeMockedConstructor<T> & {
    [K in MethodKeysOf<T>]: T[K] extends MockableFunction ? MockedFunction<T[K]> : T[K];
} & {
    [K in PropertyKeysOf<T>]: T[K];
};
export declare type MockedObjectDeep<T> = MaybeMockedConstructor<T> & {
    [K in MethodKeysOf<T>]: T[K] extends MockableFunction ? MockedFunctionDeep<T[K]> : T[K];
} & {
    [K in PropertyKeysOf<T>]: MaybeMockedDeep<T[K]>;
};
export declare type MaybeMockedDeep<T> = T extends MockableFunction ? MockedFunctionDeep<T> : T extends object ? MockedObjectDeep<T> : T;
export declare type MaybeMocked<T> = T extends MockableFunction ? MockedFunction<T> : T extends object ? MockedObject<T> : T;
export declare function mocked<T>(item: T, deep?: false): MaybeMocked<T>;
export declare function mocked<T>(item: T, deep: true): MaybeMockedDeep<T>;
