/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Circus } from '@jest/types';
export declare const injectGlobalErrorHandlers: (parentProcess: NodeJS.Process) => Circus.GlobalErrorHandlers;
export declare const restoreGlobalErrorHandlers: (parentProcess: NodeJS.Process, originalErrorHandlers: Circus.GlobalErrorHandlers) => void;
