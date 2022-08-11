/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Plugin as PrettyFormatPlugin, Plugins as PrettyFormatPlugins } from 'pretty-format';
export declare const addSerializer: (plugin: PrettyFormatPlugin) => void;
export declare const getSerializers: () => PrettyFormatPlugins;
