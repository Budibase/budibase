# eslint-plugin-svelte3

An ESLint plugin for Svelte v3 components.

## Features

- Compiler errors and warnings are displayed through ESLint
- Script blocks and template expression tags are linted with existing ESLint rules
- Svelte scope and stores are respected by unused variable and undefined variable rules
- Idioms like self-assignment and `$:` labels are always allowed, regardless of configuration

## Requirements

- Svelte 3.2+
- ESLint 6+

## Installation

Install the plugin package:

```
npm install --save-dev eslint-plugin-svelte3
```

Then add `svelte3` to the `plugins` array in your `.eslintrc.*`, and set `svelte3/svelte3` as the `processor` for your Svelte components.

For example:

```javascript
module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true
  },
  plugins: [
    'svelte3'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    // ...
  },
  settings: {
    // ...
  }
};
```

By default, this plugin needs to be able to `require('svelte/compiler')`. If ESLint, this plugin, and Svelte are all installed locally in your project, this should not be a problem.

### Installation with TypeScript

If you want to use TypeScript, you'll need a different ESLint configuration. In addition to the Svelte plugin, you also need the ESLint TypeScript parser and plugin. Install `typescript`, `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` from npm and then adjust your config like this:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser', // add the TypeScript parser
  plugins: [
    'svelte3',
    '@typescript-eslint' // add the TypeScript plugin
  ],
  overrides: [ // this stays the same
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    // ...
  },
  settings: {
    'svelte3/typescript': () => require('typescript'), // pass the TypeScript package to the Svelte plugin
    // OR
    'svelte3/typescript': true, // load TypeScript as peer dependency
    // ...
  }
};
```

If you also want to be able to use type-aware linting rules (which will result in slower linting, because the whole program needs to be compiled and type-checked), then you also need to add some `parserOptions` configuration. The values below assume that your ESLint config is at the root of your project next to your `tsconfig.json`. For more information, see [here](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md).

```javascript
module.exports = {
  // ...
  parserOptions: { // add these parser options
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte'],
  },
  extends: [ // then, enable whichever type-aware rules you want to use
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  // ...
};
```

There are some limitations to these type-aware rules currently. Specifically, checks in the context of reactive assignments and store subscriptions will report false positives or false negatives, depending on the rule. In the case of reactive assignments, you can work around this by explicitly typing the reactive variable. An example with the `no-unsafe-member-access` rule:

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';

  const store = writable([]);
  $store.length; // incorrect no-unsafe-member-access error

  $: assignment = [];
  assignment.length; // incorrect no-unsafe-member-access error
  // You can work around this by doing
  let another_assignment: string[];
  $: another_assignment = [];
  another_assignment.length; // OK
</script>
```

## Interactions with other plugins

Care needs to be taken when using this plugin alongside others. Take a look at [this list of things you need to watch out for](OTHER_PLUGINS.md).

## Configuration

There are a few settings you can use to adjust this plugin's behavior. These go in the `settings` object in your ESLint configuration.

Passing a function as a value for a setting (which some of the settings below require) is only possible when using a CommonJS `.eslintrc.js` file, and not a JSON or YAML configuration file.

### `svelte3/ignore-warnings`

This setting can be given a function that indicates whether to ignore a warning in the linting. The function will be passed a warning object and should return a boolean.

The default is to not ignore any warnings.

### `svelte3/compiler-options`

Most compiler options do not affect the validity of compiled components, but a couple of them can. If you are compiling to custom elements, or for some other reason need to control how the plugin compiles the components it's linting, you can use this setting.

This setting can be given an object of compiler options.

The default is to compile with `{ generate: false }`.

### `svelte3/ignore-styles`

If you're using some sort of preprocessor on the component styles, then it's likely that when this plugin calls the Svelte compiler on your component, it will throw an exception. In a perfect world, this plugin would be able to apply the preprocessor to the component and then use source maps to translate any warnings back to the original source. In the current reality, however, you can instead simply disregard styles written in anything other than standard CSS. You won't get warnings about the styles from the linter, but your application will still use them (of course) and compiler warnings will still appear in your build logs.

This setting can be given a function that accepts an object of attributes on a `<style>` tag (like that passed to a Svelte preprocessor) and returns whether to ignore the style block for the purposes of linting.

The default is to not ignore any styles.

### `svelte3/named-blocks`

When an [ESLint processor](https://eslint.org/docs/user-guide/configuring/plugins#specifying-processor) processes a file, it is able to output named code blocks, which can each have their own linting configuration. When this setting is enabled, the code extracted from `<script context='module'>` tag, the `<script>` tag, and the template are respectively given the block names `module.js`, `instance.js`, and `template.js`.

This means that to override linting rules in Svelte components, you'd instead have to target `**/*.svelte/*.js`. But it also means that you can define an override targeting `**/*.svelte/*_template.js` for example, and that configuration will only apply to linting done on the templates in Svelte components.

The default is to not use named code blocks.

### `svelte3/typescript`

If you use TypeScript inside your Svelte components and want ESLint support, you need to set this option. It expects a function returning an instance of the TypeScript package. This probably means doing `'svelte3/typescript': () => require('typescript')`.

To support ESLint configuration files that are not written in CommonJS, this can also be set to `true`, which behaves the same as `() => require('typescript')`.

For backwards compatibility, it also supports being passed the TypeScript package directly, but this is not generally recommended as it unnecessarily loads the package in some situations.

The default is to not enable TypeScript support.

### `svelte3/compiler`

In some esoteric setups, this plugin might not be able to find the correct instance of the Svelte compiler to use.

This setting can be given the result of `require('.../path/to/svelte/compiler')` to indicate which instance should be used in linting the components.

The default is `require('svelte/compiler')` from wherever the plugin is installed to.

## Using the CLI

It's probably a good idea to make sure you can lint from the command line before proceeding with configuring your editor.

Using this with the command line `eslint` tool shouldn't require any special actions. Just remember that if you are running `eslint` on a directory, you need to pass it the `--ext` flag to tell it which nonstandard file extensions you want to lint.

## Integrations

See [INTEGRATIONS.md](INTEGRATIONS.md) for how to use this plugin with your text editor.

## License

[MIT](LICENSE)
