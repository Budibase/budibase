/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare type MockFunctionMetadataType = 'object' | 'array' | 'regexp' | 'function' | 'constant' | 'collection' | 'null' | 'undefined';
export declare type MockFunctionMetadata<T, Y extends Array<unknown>, Type = MockFunctionMetadataType> = {
    ref?: number;
    members?: Record<string, MockFunctionMetadata<T, Y>>;
    mockImpl?: (...args: Y) => T;
    name?: string;
    refID?: number;
    type?: Type;
    value?: T;
    length?: number;
};
export declare type MockableFunction = (...args: Array<any>) => any;
export declare type MethodKeysOf<T> = {
    [K in keyof T]: T[K] extends MockableFunction ? K : never;
}[keyof T];
export declare type PropertyKeysOf<T> = {
    [K in keyof T]: T[K] extends MockableFunction ? never : K;
}[keyof T];
export declare type ArgumentsOf<T> = T extends (...args: infer A) => any ? A : never;
export declare type ConstructorArgumentsOf<T> = T extends new (...args: infer A) => any ? A : never;
export declare type MaybeMockedConstructor<T> = T extends new (...args: Array<any>) => infer R ? MockInstance<R, ConstructorArgumentsOf<T>> : T;
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
export declare type ArgsType<T> = T extends (...args: infer A) => any ? A : never;
export declare type Mocked<T> = {
    [P in keyof T]: T[P] extends (...args: Array<any>) => any ? MockInstance<ReturnType<T[P]>, ArgsType<T[P]>> : T[P] extends Constructable ? MockedClass<T[P]> : T[P];
} & T;
export declare type MockedClass<T extends Constructable> = MockInstance<InstanceType<T>, T extends new (...args: infer P) => any ? P : never> & {
    prototype: T extends {
        prototype: any;
    } ? Mocked<T['prototype']> : never;
} & T;
export interface Constructable {
    new (...args: Array<any>): any;
}
export interface MockWithArgs<T extends MockableFunction> extends MockInstance<ReturnType<T>, ArgumentsOf<T>> {
    new (...args: ConstructorArgumentsOf<T>): T;
    (...args: ArgumentsOf<T>): ReturnType<T>;
}
export interface Mock<T, Y extends Array<unknown> = Array<unknown>> extends Function, MockInstance<T, Y> {
    new (...args: Y): T;
    (...args: Y): T;
}
export interface SpyInstance<T, Y extends Array<unknown>> extends MockInstance<T, Y> {
}
export interface MockInstance<T, Y extends Array<unknown>> {
    _isMockFunction: true;
    _protoImpl: Function;
    getMockName(): string;
    getMockImplementation(): Function | undefined;
    mock: MockFunctionState<T, Y>;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): void;
    mockImplementation(fn: (...args: Y) => T): this;
    mockImplementation(fn: () => Promise<T>): this;
    mockImplementationOnce(fn: (...args: Y) => T): this;
    mockImplementationOnce(fn: () => Promise<T>): this;
    mockName(name: string): this;
    mockReturnThis(): this;
    mockReturnValue(value: T): this;
    mockReturnValueOnce(value: T): this;
    mockResolvedValue(value: Unpromisify<T>): this;
    mockResolvedValueOnce(value: Unpromisify<T>): this;
    mockRejectedValue(value: unknown): this;
    mockRejectedValueOnce(value: unknown): this;
}
declare type Unpromisify<T> = T extends Promise<infer R> ? R : never;
/**
 * Possible types of a MockFunctionResult.
 * 'return': The call completed by returning normally.
 * 'throw': The call completed by throwing a value.
 * 'incomplete': The call has not completed yet. This is possible if you read
 *               the  mock function result from within the mock function itself
 *               (or a function called by the mock function).
 */
declare type MockFunctionResultType = 'return' | 'throw' | 'incomplete';
/**
 * Represents the result of a single call to a mock function.
 */
declare type MockFunctionResult = {
    /**
     * Indicates how the call completed.
     */
    type: MockFunctionResultType;
    /**
     * The value that was either thrown or returned by the function.
     * Undefined when type === 'incomplete'.
     */
    value: unknown;
};
declare type MockFunctionState<T, Y extends Array<unknown>> = {
    calls: Array<Y>;
    instances: Array<T>;
    invocationCallOrder: Array<number>;
    /**
     * Getter for retrieving the last call arguments
     */
    lastCall?: Y;
    /**
     * List of results of calls to the mock function.
     */
    results: Array<MockFunctionResult>;
};
declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: Array<any>) => any ? never : K;
}[keyof T] & string;
declare type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: Array<any>) => any ? K : never;
}[keyof T] & string;
export declare class ModuleMocker {
    private _environmentGlobal;
    private _mockState;
    private _mockConfigRegistry;
    private _spyState;
    private _invocationCallCounter;
    /**
     * @see README.md
     * @param global Global object of the test environment, used to create
     * mocks
     */
    constructor(global: typeof globalThis);
    private _getSlots;
    private _ensureMockConfig;
    private _ensureMockState;
    private _defaultMockConfig;
    private _defaultMockState;
    private _makeComponent;
    private _createMockFunction;
    private _generateMock;
    /**
     * @see README.md
     * @param _metadata Metadata for the mock in the schema returned by the
     * getMetadata method of this module.
     */
    generateFromMetadata<T, Y extends Array<unknown>>(_metadata: MockFunctionMetadata<T, Y>): Mock<T, Y>;
    /**
     * @see README.md
     * @param component The component for which to retrieve metadata.
     */
    getMetadata<T, Y extends Array<unknown>>(component: T, _refs?: Map<T, number>): MockFunctionMetadata<T, Y> | null;
    isMockFunction<T>(fn: unknown): fn is Mock<T>;
    fn<T, Y extends Array<unknown>>(implementation?: (...args: Y) => T): Mock<T, Y>;
    spyOn<T extends {}, M extends NonFunctionPropertyNames<T>>(object: T, methodName: M, accessType: 'get'): SpyInstance<T[M], []>;
    spyOn<T extends {}, M extends NonFunctionPropertyNames<T>>(object: T, methodName: M, accessType: 'set'): SpyInstance<void, [T[M]]>;
    spyOn<T extends {}, M extends FunctionPropertyNames<T>>(object: T, methodName: M): T[M] extends (...args: Array<any>) => any ? SpyInstance<ReturnType<T[M]>, Parameters<T[M]>> : never;
    private _spyOnProperty;
    clearAllMocks(): void;
    resetAllMocks(): void;
    restoreAllMocks(): void;
    private _typeOf;
    mocked<T>(item: T, deep?: false): MaybeMocked<T>;
    mocked<T>(item: T, deep: true): MaybeMockedDeep<T>;
}
export declare const fn: <T, Y extends unknown[]>(implementation?: ((...args: Y) => T) | undefined) => Mock<T, Y>;
export declare const spyOn: {
    <T extends {}, M extends NonFunctionPropertyNames<T>>(object: T, methodName: M, accessType: 'get'): SpyInstance<T[M], []>;
    <T_2 extends {}, M_2 extends NonFunctionPropertyNames<T_2>>(object: T_2, methodName: M_2, accessType: 'set'): SpyInstance<void, [T_2[M_2]]>;
    <T_4 extends {}, M_4 extends FunctionPropertyNames<T_4>>(object: T_4, methodName: M_4): T_4[M_4] extends (...args: Array<any>) => any ? SpyInstance<ReturnType<T_4[M_4]>, Parameters<T_4[M_4]>> : never;
};
export declare const mocked: {
    <T>(item: T, deep?: false | undefined): MaybeMocked<T>;
    <T_2>(item: T_2, deep: true): MaybeMockedDeep<T_2>;
};
export {};
