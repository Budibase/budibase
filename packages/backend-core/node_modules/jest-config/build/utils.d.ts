/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
declare type ResolveOptions = {
    rootDir: Config.Path;
    key: string;
    filePath: Config.Path;
    optional?: boolean;
};
export declare const BULLET: string;
export declare const DOCUMENTATION_NOTE: string;
export declare const resolve: (resolver: string | null | undefined, { key, filePath, rootDir, optional }: ResolveOptions) => string;
export declare const escapeGlobCharacters: (path: Config.Path) => Config.Glob;
export declare const replaceRootDirInPath: (rootDir: Config.Path, filePath: Config.Path) => string;
declare type OrArray<T> = T | Array<T>;
declare type ReplaceRootDirConfigObj = Record<string, Config.Path>;
declare type ReplaceRootDirConfigValues = OrArray<ReplaceRootDirConfigObj> | OrArray<RegExp> | OrArray<Config.Path>;
export declare const _replaceRootDirTags: <T extends ReplaceRootDirConfigValues>(rootDir: Config.Path, config: T) => T;
declare type JSONString = string & {
    readonly $$type: never;
};
export declare const isJSONString: (text?: string | JSONString | undefined) => text is JSONString;
export {};
