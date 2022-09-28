rollup-plugin-polyfill-node
===

🔩 A modern Node.js polyfill for your Rollup bundle.

> This repo is an updated, maintained fork of https://github.com/ionic-team/rollup-plugin-node-polyfills to support better Node.js polyfills in Snowpack and all other Rollup projects. See this thread for discussion on moving this plugin into the official Rollup org: https://github.com/rollup/plugins/pull/51#issuecomment-747489334
> 
> This repo is completely community-maintained. If you have an issue, consider helping out and submitting a PR yourself. This may be the only way to get your issue resolved!


## Quickstart

```
npm install --save-dev rollup-plugin-polyfill-node
```

```js
import nodePolyfills from 'rollup-plugin-polyfill-node';
rollup({
  entry: 'main.js',
  plugins: [
    nodePolyfills( /* options */ )
  ]
})
```

## Options

*All options are optional.*

- `include: Array<string | RegExp> | string | RegExp | null;`: Defaults to transforming Node.js builtins in all `node_modules/**/*.js` files only. Pass in `null` to transform all files, including all files including any source files.
- `exclude: Array<string | RegExp> | string | RegExp | null;`: Exclude files from transformation. 
- `sourceMap: boolean`: True to get source maps, false otherwise.


## Node.js Builtin Support Table

The following modules include ES6 specific version which allow you to do named imports in addition to the default import and should work fine if you only use this plugin.

- process*
- events
- stream*
- util*
- path
- buffer*
- querystring
- url*
- string_decoder*
- punycode
- http*†
- https*†
- os*
- assert*
- constants
- timers*
- console*‡
- vm*§
- zlib*
- tty
- domain
- dns∆
- dgram∆
- child_process∆
- cluster∆
- module∆
- net∆
- readline∆
- repl∆
- tls∆
- fs˚
- crypto˚
- perf_hooks˚ - **New:* just an empty shim for now, but would love help building a true polyfill!*


† the http and https modules are actually the same and don't differentiate based on protocol

‡ default export only, because it's console, seriously just use the global

§ vm does not have all corner cases and has less of them in a web worker

∆ not shimmed, just returns mock

˚ shimmed, but too complex to polyfill fully. Avoid if at all possible. Some bugs and partial support expected. 

Not all included modules rollup equally, streams (and by extension anything that requires it like http) are a mess of circular references that are pretty much impossible to tree-shake out, similarly url methods are actually a shortcut to a url object so those methods don't tree shake out very well, punycode, path, querystring, events, util, and process tree shake very well especially if you do named imports.
