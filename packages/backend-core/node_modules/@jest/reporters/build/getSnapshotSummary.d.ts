/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { SnapshotSummary } from '@jest/test-result';
import type { Config } from '@jest/types';
export default function getSnapshotSummary(snapshots: SnapshotSummary, globalConfig: Config.GlobalConfig, updateCommand: string): Array<string>;
