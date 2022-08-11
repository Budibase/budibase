/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import emittery = require('emittery');
declare type State = {
    interrupted: boolean;
};
export default class TestWatcher extends emittery<{
    change: State;
}> {
    state: State;
    private _isWatchMode;
    constructor({ isWatchMode }: {
        isWatchMode: boolean;
    });
    setState(state: State): Promise<void>;
    isInterrupted(): boolean;
    isWatchMode(): boolean;
}
export {};
