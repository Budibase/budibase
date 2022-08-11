/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Circus } from '@jest/types';
export declare const ROOT_DESCRIBE_BLOCK_NAME = "ROOT_DESCRIBE_BLOCK";
export declare const resetState: () => void;
export declare const getState: () => Circus.State;
export declare const setState: (state: Circus.State) => Circus.State;
export declare const dispatch: (event: Circus.AsyncEvent) => Promise<void>;
export declare const dispatchSync: (event: Circus.SyncEvent) => void;
export declare const addEventHandler: (handler: Circus.EventHandler) => void;
