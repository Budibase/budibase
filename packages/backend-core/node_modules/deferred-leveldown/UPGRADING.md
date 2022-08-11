# Upgrade Guide

This document describes breaking changes and how to upgrade. For a complete list of changes including minor and patch releases, please refer to the [changelog](CHANGELOG.md).

## v5

 Upgraded `abstract-leveldown` to `v6.0.0`. Please see the corresponding [changelog entry](https://github.com/Level/abstract-leveldown/blob/master/CHANGELOG.md#600---2018-10-20) for more information.

## v4

Dropped support for node 4. No other breaking changes.

## v3

#### `.batch(array)` enforces objects

This major release contains an upgrade to `abstract-leveldown` with a [breaking change](https://github.com/Level/abstract-leveldown/commit/a2621ad70571f6ade9d2be42632ece042e068805) for the array version of `.batch()`. This change ensures all elements in the batch array are objects.

If you previously passed arrays to `.batch()` that contained `undefined` or `null`, they would be silently ignored. Now this will produce an error.
