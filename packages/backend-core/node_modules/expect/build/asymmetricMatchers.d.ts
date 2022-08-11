/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { AsymmetricMatcher as AsymmetricMatcherInterface, MatcherState } from './types';
export declare abstract class AsymmetricMatcher<T, State extends MatcherState = MatcherState> implements AsymmetricMatcherInterface {
    protected sample: T;
    protected inverse: boolean;
    $$typeof: symbol;
    constructor(sample: T, inverse?: boolean);
    protected getMatcherContext(): State;
    abstract asymmetricMatch(other: unknown): boolean;
    abstract toString(): string;
    getExpectedType?(): string;
    toAsymmetricMatcher?(): string;
}
declare class Any extends AsymmetricMatcher<any> {
    constructor(sample: unknown);
    asymmetricMatch(other: unknown): boolean;
    toString(): string;
    getExpectedType(): string;
    toAsymmetricMatcher(): string;
}
declare class Anything extends AsymmetricMatcher<void> {
    asymmetricMatch(other: unknown): boolean;
    toString(): string;
    toAsymmetricMatcher(): string;
}
declare class ArrayContaining extends AsymmetricMatcher<Array<unknown>> {
    constructor(sample: Array<unknown>, inverse?: boolean);
    asymmetricMatch(other: Array<unknown>): boolean;
    toString(): string;
    getExpectedType(): string;
}
declare class ObjectContaining extends AsymmetricMatcher<Record<string, unknown>> {
    constructor(sample: Record<string, unknown>, inverse?: boolean);
    asymmetricMatch(other: any): boolean;
    toString(): string;
    getExpectedType(): string;
}
declare class StringContaining extends AsymmetricMatcher<string> {
    constructor(sample: string, inverse?: boolean);
    asymmetricMatch(other: string): boolean;
    toString(): string;
    getExpectedType(): string;
}
declare class StringMatching extends AsymmetricMatcher<RegExp> {
    constructor(sample: string | RegExp, inverse?: boolean);
    asymmetricMatch(other: string): boolean;
    toString(): string;
    getExpectedType(): string;
}
declare class CloseTo extends AsymmetricMatcher<number> {
    private precision;
    constructor(sample: number, precision?: number, inverse?: boolean);
    asymmetricMatch(other: number): boolean;
    toString(): string;
    getExpectedType(): string;
}
export declare const any: (expectedObject: unknown) => Any;
export declare const anything: () => Anything;
export declare const arrayContaining: (sample: Array<unknown>) => ArrayContaining;
export declare const arrayNotContaining: (sample: Array<unknown>) => ArrayContaining;
export declare const objectContaining: (sample: Record<string, unknown>) => ObjectContaining;
export declare const objectNotContaining: (sample: Record<string, unknown>) => ObjectContaining;
export declare const stringContaining: (expected: string) => StringContaining;
export declare const stringNotContaining: (expected: string) => StringContaining;
export declare const stringMatching: (expected: string | RegExp) => StringMatching;
export declare const stringNotMatching: (expected: string | RegExp) => StringMatching;
export declare const closeTo: (expected: number, precision?: number | undefined) => CloseTo;
export declare const notCloseTo: (expected: number, precision?: number | undefined) => CloseTo;
export {};
