# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## v5

Upgraded to [`levelup@4`](https://github.com/Level/levelup/blob/v4.0.0/UPGRADING.md#v4) and [`encoding-down@6`](https://github.com/Level/encoding-down/blob/v6.0.0/UPGRADING.md#v6). We recommend to pair `level-packager@5` only with a store based on `abstract-leveldown` >= 6. Please follow the earlier links for more information.

## v4

The `test.js` file was rewritten to test the `level-packager` api and is no longer part of the api. Implementations based on `level-packager` should instead use the tests in the `abstract/` folder.

## v3

Dropped support for node 4. No other breaking changes.
