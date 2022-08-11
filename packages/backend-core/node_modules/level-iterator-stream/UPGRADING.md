# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## v4

Upgraded to [`readable-stream@3`](https://github.com/nodejs/readable-stream#version-3xx) which contains several substantial changes and improvements. Since `level-iterator-stream` derives from `readable-stream` we decided to bump major as well.

## v3

Removed support for node 4.

## v2

Encodings were factored out from `levelup` into `encoding-down` and in that process they were removed from this module as well. For more information, please check the corresponding `CHANGELOG.md` for:

- [`levelup`](https://github.com/Level/levelup/blob/master/CHANGELOG.md)
- [`encoding-down`](https://github.com/Level/encoding-down/blob/master/CHANGELOG.md)

If your code relies on `options.decoder` for decoding keys and values you need to handle this yourself, e.g. by a transform stream or similar.

Support for node 0.10, 0.12 and iojs was also dropped.
