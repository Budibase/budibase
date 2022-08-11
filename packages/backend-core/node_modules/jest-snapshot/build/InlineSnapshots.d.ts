/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Expression } from '@babel/types';
import type { Config } from '@jest/types';
import type { Frame } from 'jest-message-util';
export declare type InlineSnapshot = {
    snapshot: string;
    frame: Frame;
    node?: Expression;
};
export declare function saveInlineSnapshots(snapshots: Array<InlineSnapshot>, prettierPath: Config.Path): void;
