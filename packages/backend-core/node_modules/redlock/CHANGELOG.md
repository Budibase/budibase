## v4.0.0

- Add support for multi-resource locks (via [#55](https://github.com/mike-marcacci/node-redlock/pull/55)).
- **BREAKING:** Change behavior of `unlock` to return an error if one or more entries cannot be removed.
- **BREAKING:** Upgrade required engine to node 8+ in line w/ node LTS roadmap.

### v4.1.0

- Update scripts for compatibility with LUA 5.2 (via [#63](https://github.com/mike-marcacci/node-redlock/pull/63)).

### v4.2.0

- Update dependencies.
- Stop testing on node version 8. (Due to dev dependency requirements only.)
- Update docs (@ricmatsui via [#80](https://github.com/mike-marcacci/node-redlock/pull/80)).
- Use evalsha for scripts (@yosiat via [#77](https://github.com/mike-marcacci/node-redlock/pull/77)).
