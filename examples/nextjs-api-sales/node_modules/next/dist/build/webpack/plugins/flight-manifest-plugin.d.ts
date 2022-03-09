/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare type Options = {
    dev: boolean;
    clientComponentsRegex: RegExp;
    runtime?: 'nodejs' | 'edge';
};
export declare class FlightManifestPlugin {
    dev: boolean;
    runtime?: 'nodejs' | 'edge';
    clientComponentsRegex: RegExp;
    constructor(options: Options);
    apply(compiler: any): void;
    createAsset(assets: any, compilation: any): void;
}
export {};
