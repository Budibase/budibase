# @sveltejs/vite-plugin-svelte

## 1.0.0-next.15

### Major Changes

- change default value of compilerOptions.hydratable to false ([#122](https://github.com/sveltejs/vite-plugin-svelte/pull/122))

  This is done to align with svelte compiler defaults and improve output in non-ssr scenarios.

  Add `{compilerOptions: {hydratable: true}}` to vite-plugin-svelte config if you need hydration (eg. for ssr)

### Minor Changes

- add config option `experimental.dynamicCompileOptions` for finegrained control over compileOptions ([#122](https://github.com/sveltejs/vite-plugin-svelte/pull/122))

### Patch Changes

- resolve vite.root option correctly (fixes [#113](https://github.com/sveltejs/vite-plugin-svelte/issues/113)) ([#115](https://github.com/sveltejs/vite-plugin-svelte/pull/115))

## 1.0.0-next.14

### Patch Changes

- replace querystring with URLSearchParams ([#107](https://github.com/sveltejs/vite-plugin-svelte/pull/107))

* import svelte types instead of duplicating them ([#105](https://github.com/sveltejs/vite-plugin-svelte/pull/105))

- update svelte-hmr to 0.14.7 to fix issue with svelte 3.40 ([#112](https://github.com/sveltejs/vite-plugin-svelte/pull/112))

* turn diff-match-patch into an optional peer dependency to reduce footprint ([#110](https://github.com/sveltejs/vite-plugin-svelte/pull/110))

## 1.0.0-next.13

### Minor Changes

- Add `experimental` section to options and move `useVitePreprocess` there ([#99](https://github.com/sveltejs/vite-plugin-svelte/pull/99))

  Experimental options are not ready for production use and breaking changes to them can occur in any release

  If you already had `useVitePreprocess` enabled, update you config:

  ```diff
  - svelte({useVitePreprocess: true})
  + svelte({experimental: {useVitePreprocess: true}})
  ```

* Add option to ignore svelte preprocessors of other vite plugins ([#98](https://github.com/sveltejs/vite-plugin-svelte/pull/98))

  - ignore them all: `ignorePluginPreprocessors: true`
  - ignore by name: `ignorePluginPreprocessors: ['<name of plugin>',...]`

- Move plugin preprocessor definition to api namespace ([#98](https://github.com/sveltejs/vite-plugin-svelte/pull/98))

  Plugins that provide `myplugin.sveltePreprocess`, should move it to `myplugin.api.sveltePreprocess`, as suggested by [rollup](https://rollupjs.org/guide/en/#direct-plugin-communication)

* Experimental: Generate sourcemaps for preprocessors that lack them ([#101](https://github.com/sveltejs/vite-plugin-svelte/pull/101))

  enable option `experimental.generateMissingPreprocessorSourcemaps` to use it

### Patch Changes

- removed redundant `disableCssHmr` option ([#99](https://github.com/sveltejs/vite-plugin-svelte/pull/99))

  You can use `emitCss: false` or `emitCss: !!isProduction` instead

* further improvements to changelog (see [#93](https://github.com/sveltejs/vite-plugin-svelte/issues/93)) ([#94](https://github.com/sveltejs/vite-plugin-svelte/pull/94))

- reduce log output with log.once function to filter repetetive messages ([#101](https://github.com/sveltejs/vite-plugin-svelte/pull/101))

* remove transitive peer dependency on rollup (fixes [#57](https://github.com/sveltejs/vite-plugin-svelte/issues/57)) ([#103](https://github.com/sveltejs/vite-plugin-svelte/pull/103))

## 1.0.0-next.12

### Minor Changes

- Resolve svelte to svelte/ssr when building for ssr (fixes [#74](https://github.com/sveltejs/vite-plugin-svelte/issues/74)) ([#75](https://github.com/sveltejs/vite-plugin-svelte/pull/75)) ([`f6f56fe`](https://github.com/sveltejs/vite-plugin-svelte/commit/f6f56fee7d3567196052a23440cb1818187fa232))

- Support svg extension ([#78](https://github.com/sveltejs/vite-plugin-svelte/pull/78)) ([`2eb09cf`](https://github.com/sveltejs/vite-plugin-svelte/commit/2eb09cf180c7ebf0fb4ccfccee663e5264b3814c))

- Restart dev server when svelte config file changes ([#72](https://github.com/sveltejs/vite-plugin-svelte/pull/72)) ([`5100376`](https://github.com/sveltejs/vite-plugin-svelte/commit/5100376ef91d5e39ec00222f1043e4fda047678b))

- Allow svelte imports to be added to optimizeDeps.include and don't exclude svelte from optimizeDeps then ([#68](https://github.com/sveltejs/vite-plugin-svelte/pull/68)) ([`9583900`](https://github.com/sveltejs/vite-plugin-svelte/commit/9583900a2b3600133cee3a46b6dbb7df137977b6))

- Vite config can be updated based on values in svelte config (see [#60](https://github.com/sveltejs/vite-plugin-svelte/issues/60)) ([#64](https://github.com/sveltejs/vite-plugin-svelte/pull/64)) ([`c3f65fd`](https://github.com/sveltejs/vite-plugin-svelte/commit/c3f65fdf414b22810ad60817b3e1e62790ba816f))

### Patch Changes

- customize changelog format ([#90](https://github.com/sveltejs/vite-plugin-svelte/pull/90)) ([`b5a58cd`](https://github.com/sveltejs/vite-plugin-svelte/commit/b5a58cd814bbc71a5e59060d436770f7a0102262))

- relax svelte peer dependency to 3.34.0 ([#70](https://github.com/sveltejs/vite-plugin-svelte/pull/70)) ([`377d464`](https://github.com/sveltejs/vite-plugin-svelte/commit/377d464eba30c56f012deba3d306cb5a7195b787))

- do not transform imports tagged with ?url or ?raw (fixes #87) ([#88](https://github.com/sveltejs/vite-plugin-svelte/pull/88)) ([`d1d2638`](https://github.com/sveltejs/vite-plugin-svelte/commit/d1d2638b247830852faa89e7b9bc9a430b81ba51))

- update svelte-hmr to ^0.14.5 to fix hmr reordering issue introduced by a change in svelte 3.38.3 ([#92](https://github.com/sveltejs/vite-plugin-svelte/pull/92)) ([`cdfd821`](https://github.com/sveltejs/vite-plugin-svelte/commit/cdfd8210770150c6e40f68b6b48cd2e455414299))

- fix kit-node tests ([#55](https://github.com/sveltejs/vite-plugin-svelte/pull/55)) ([`09b63d3`](https://github.com/sveltejs/vite-plugin-svelte/commit/09b63d32e8816acc554a66d4d01062be197dfbb7))

- output sourcemap in hmr helper preprocessor ([#71](https://github.com/sveltejs/vite-plugin-svelte/pull/71)) ([`97ee68c`](https://github.com/sveltejs/vite-plugin-svelte/commit/97ee68c5106e58b2e7c4eb97e8cf7dd1c52bbfd3))

- reduced debug output ([#83](https://github.com/sveltejs/vite-plugin-svelte/pull/83)) ([`eb048ff`](https://github.com/sveltejs/vite-plugin-svelte/commit/eb048ff9419488f75869ffb880a78a2a3aa5a6bb))

- Refactored e2e-tests to use package.json scripts

- Updated dependencies

## 1.0.0-next.11

### Major Changes

- convert to es module with cjs fallback, use named export instead of default ([#54](https://github.com/sveltejs/vite-plugin-svelte/pull/54)) ([`0f7e256`](https://github.com/sveltejs/vite-plugin-svelte/commit/0f7e256a9ebb0ee9ac6075146d27bf4f11ecdab3))

  If you are using vite-plugin-svelte with require, you should switch to esm and import the named export "svelte".
  An example can be found in the usage section of the [readme](README.md)

  For existing esm configs update your import to use the new named export.

  ```diff
  - import svelte from '@sveltejs/vite-plugin-svelte';
  + import { svelte } from '@sveltejs/vite-plugin-svelte';
  ```

  continuing with cjs/require is discouraged but if you must use it, update your require statement to use the named export

  ```diff
  - const svelte = require('@sveltejs/vite-plugin-svelte');
  + const { svelte } = require('@sveltejs/vite-plugin-svelte');
  ```

### Minor Changes

- Log svelte compiler warnings to console. use options.onwarn to customize logging ([#45](https://github.com/sveltejs/vite-plugin-svelte/pull/45)) ([`673cf61`](https://github.com/sveltejs/vite-plugin-svelte/commit/673cf61b3800e7a64be2b73a7273909da95729d2))

### Patch Changes

- Update to esbuild 0.12 and vite 2.3.7 ([#44](https://github.com/sveltejs/vite-plugin-svelte/pull/44)) ([`24ae093`](https://github.com/sveltejs/vite-plugin-svelte/commit/24ae0934301cb50506bf39cdccc07ad3eac546fd))

- Update engines.node to "^12.20 || ^14.13.1 || >= 16" ([#44](https://github.com/sveltejs/vite-plugin-svelte/pull/44)) ([`24ae093`](https://github.com/sveltejs/vite-plugin-svelte/commit/24ae0934301cb50506bf39cdccc07ad3eac546fd))

- Enable logging for compiler warnings ([#45](https://github.com/sveltejs/vite-plugin-svelte/pull/45)) ([`673cf61`](https://github.com/sveltejs/vite-plugin-svelte/commit/673cf61b3800e7a64be2b73a7273909da95729d2))

## 1.0.0-next.10

### Minor Changes

- Allow `emitCss: false` for production builds and customizable compilerOptions.css and hydratable (fixes [#9](https://github.com/sveltejs/vite-plugin-svelte/issues/9)) ([#41](https://github.com/sveltejs/vite-plugin-svelte/pull/41)) ([`cb7f03d`](https://github.com/sveltejs/vite-plugin-svelte/commit/cb7f03d61c19f0b98c6412c11bbaa4af978da9ed))

## 1.0.0-next.9

### Patch Changes

- Ensure esm config loading works on windows ([#38](https://github.com/sveltejs/vite-plugin-svelte/pull/38)) ([`5aef91c`](https://github.com/sveltejs/vite-plugin-svelte/commit/5aef91c8752c8de94a1f1fcb28618606b7c44670))

## 1.0.0-next.8

### Minor Changes

- Support esm in svelte.config.js and svelte.config.mjs ([#35](https://github.com/sveltejs/vite-plugin-svelte/pull/35)) ([`4018ce6`](https://github.com/sveltejs/vite-plugin-svelte/commit/4018ce621b4df75877e0e18057c332f27158d42b))

- Add configFile option ([#35](https://github.com/sveltejs/vite-plugin-svelte/pull/35)) ([`4018ce6`](https://github.com/sveltejs/vite-plugin-svelte/commit/4018ce621b4df75877e0e18057c332f27158d42b))

### Patch Changes

- Watch preprocessor dependencies and trigger hmr on change ([#34](https://github.com/sveltejs/vite-plugin-svelte/pull/34)) ([`e5d4749`](https://github.com/sveltejs/vite-plugin-svelte/commit/e5d4749c0850260a295daab9cb15866fe58ee709))

## 1.0.0-next.7

### Minor Changes

- Reduced cache usage, share css cache between SSR and client ([#32](https://github.com/sveltejs/vite-plugin-svelte/pull/32)) ([`113bb7d`](https://github.com/sveltejs/vite-plugin-svelte/commit/113bb7dc330a7517085d12d1d0758a376a12253f))

## 1.0.0-next.6

### Minor Changes

- 1be46f1: improved css hmr
- a0f5a65: Allow other vite plugins to define preprocessors

### Patch Changes

- 8d9ef96: fix: do not preserve types unless useVitePreprocess option is true
- 6f4a253: disable svelte-hmr overlay by default
- 18647aa: improve virtual css module path (fixes #14)

## 1.0.0-next.5

### Patch Changes

- 61439ae: initial release
