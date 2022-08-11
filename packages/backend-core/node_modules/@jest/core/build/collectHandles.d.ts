/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
export declare type HandleCollectionResult = () => Promise<Array<Error>>;
export default function collectHandles(): HandleCollectionResult;
export declare function formatHandleErrors(errors: Array<Error>, config: Config.ProjectConfig): Array<string>;
