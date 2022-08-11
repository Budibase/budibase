import type { Config } from '@jest/types';
declare type JestPathMapping = Config.InitialOptions['moduleNameMapper'];
export declare const pathsToModuleNameMapper: (mapping: import("typescript").MapLike<string[]>, { prefix }?: {
    prefix: string;
}) => JestPathMapping;
export {};
