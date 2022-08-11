/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import { PkgJson } from './fileWalkers';
interface ResolverOptions {
    basedir: Config.Path;
    browser?: boolean;
    conditions?: Array<string>;
    defaultResolver: typeof defaultResolver;
    extensions?: Array<string>;
    moduleDirectory?: Array<string>;
    paths?: Array<Config.Path>;
    rootDir?: Config.Path;
    packageFilter?: (pkg: PkgJson, dir: string) => PkgJson;
    pathFilter?: (pkg: PkgJson, path: string, relativePath: string) => string;
}
declare global {
    namespace NodeJS {
        interface ProcessVersions {
            pnp?: any;
        }
    }
}
export default function defaultResolver(path: Config.Path, options: ResolverOptions): Config.Path;
export {};
