/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Global } from '@jest/types';
import type { EachTests } from '../bind';
import type { Headings } from './interpolation';
export default function template(title: string, headings: Headings, row: Global.Row): EachTests;
