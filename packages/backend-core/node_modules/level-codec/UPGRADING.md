# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## v9

Dropped node 0.12, 4, 5 and 7.

## v8

Previously the "utf8" decoder always returned a string. This was a workaround for `encoding-down` that is no longer needed. The return type now depends on the `asBuffer` option, which is more optimal.

## v7

Dropped node 0.10 and iojs.

## v6

The `createDecodeStream()` method (introduced in the last 5.x version) has been replaced with `createStreamDecoder()`.

## v5

This is a rewrite of both internals and the public API. Please see the README for details.

## v4

Removed default encoding ("utf8"). If you relied on this behavior you must now define it yourself.

## v3

Removed the `encoding` option in favor of `keyEncoding` and `valueEncoding`. Note: it was partially restored in v6.1.0.

## v2

The function signature of `batch()` has changed from `batch(ops, batchOptions, dbOptions)` to `batch(ops, optionObjects)`.
