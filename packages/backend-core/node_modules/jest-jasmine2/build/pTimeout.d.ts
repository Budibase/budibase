/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default function pTimeout(promise: Promise<void>, ms: number, clearTimeout: typeof globalThis['clearTimeout'], setTimeout: typeof globalThis['setTimeout'], onTimeout: () => void): Promise<void>;
