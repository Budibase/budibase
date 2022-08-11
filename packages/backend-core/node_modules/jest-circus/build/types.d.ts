/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Circus } from '@jest/types';
import expect = require('expect');
export declare const STATE_SYM: "STATE_SYM_SYMBOL";
export declare const RETRY_TIMES: "RETRY_TIMES_SYMBOL";
export declare const TEST_TIMEOUT_SYMBOL: "TEST_TIMEOUT_SYMBOL";
declare global {
    namespace NodeJS {
        interface Global {
            STATE_SYM_SYMBOL: Circus.State;
            RETRY_TIMES_SYMBOL: string;
            TEST_TIMEOUT_SYMBOL: number;
            expect: typeof expect;
        }
    }
}
