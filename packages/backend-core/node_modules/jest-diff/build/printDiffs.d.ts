/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Diff } from './cleanupSemantic';
import type { DiffOptions } from './types';
export declare const diffStringsUnified: (a: string, b: string, options?: DiffOptions | undefined) => string;
export declare const diffStringsRaw: (a: string, b: string, cleanup: boolean) => Array<Diff>;
