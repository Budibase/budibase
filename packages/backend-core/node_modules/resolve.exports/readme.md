# resolve.exports [![CI](https://github.com/lukeed/resolve.exports/workflows/CI/badge.svg)](https://github.com/lukeed/resolve.exports/actions) [![codecov](https://badgen.net/codecov/c/github/lukeed/resolve.exports)](https://codecov.io/gh/lukeed/resolve.exports)

> A tiny (737b), correct, general-purpose, and configurable `"exports"` resolver without file-system reliance

***Why?***

Hopefully, this module may serve as a reference point (and/or be used directly) so that the varying tools and bundlers within the ecosystem can share a common approach with one another **as well as** with the native Node.js implementation.

With the push for ESM, we must be _very_ careful and avoid fragmentation. If we, as a community, begin propagating different _dialects_ of `"exports"` resolution, then we're headed for deep trouble. It will make supporting (and using) `"exports"` nearly impossible, which may force its abandonment and along with it, its benefits.

Let's have nice things.

***TODO***

- [x] exports string
- [x] exports object (single entry)
- [x] exports object (multi entry)
- [x] nested / recursive conditions
- [x] exports arrayable
- [x] directory mapping (`./foobar/` => `/foobar/`)
- [x] directory mapping (`./foobar/*` => `./other/*.js`)
- [x] directory mapping w/ conditions
- [x] directory mapping w/ nested conditions
- [x] legacy fields (`main` vs `module` vs ...)
- [x] legacy "browser" files object

## Install

```sh
$ npm install resolve.exports
```

## Usage

> Please see [`/test/`](/test) for examples.

```js
import { resolve, legacy } from 'resolve.exports';

const contents = {
  "name": "foobar",
  "module": "dist/module.mjs",
  "main": "dist/require.js",
  "exports": {
    ".": {
      "import": "./dist/module.mjs",
      "require": "./dist/require.js"
    },
    "./lite": {
      "worker": {
        "browser": "./lite/worker.brower.js",
        "node": "./lite/worker.node.js"
      },
      "import": "./lite/module.mjs",
      "require": "./lite/require.js"
    }
  }
};

// Assumes `.` as default entry
// Assumes `import` as default condition
resolve(contents); //=> "./dist/module.mjs"

// entry: nullish === "foobar" === "."
resolve(contents, 'foobar'); //=> "./dist/module.mjs"
resolve(contents, '.'); //=> "./dist/module.mjs"

// entry: "foobar/lite" === "./lite"
resolve(contents, 'foobar/lite'); //=> "./lite/module.mjs"
resolve(contents, './lite'); //=> "./lite/module.mjs"

// Assume `require` usage
resolve(contents, 'foobar', { require: true }); //=> "./dist/require.js"
resolve(contents, './lite', { require: true }); //=> "./lite/require.js"

// Throws "Missing <entry> export in <name> package" Error
resolve(contents, 'foobar/hello');
resolve(contents, './hello/world');

// Add custom condition(s)
resolve(contents, 'foobar/lite', {
  conditions: ['worker']
}); // => "./lite/worker.node.js"

// Toggle "browser" condition
resolve(contents, 'foobar/lite', {
  conditions: ['worker'],
  browser: true
}); // => "./lite/worker.browser.js"

// ---
// Legacy
// ---

// prefer "module" > "main" (default)
legacy(contents); //=> "dist/module.mjs"

// customize fields order
legacy(contents, {
  fields: ['main', 'module']
}); //=> "dist/require.js"
```

## API

### resolve(pkg, entry?, options?)
Returns: `string` or `undefined`

Traverse the `"exports"` within the contents of a `package.json` file. <br>
If the contents _does not_ contain an `"exports"` map, then `undefined` will be returned.

Successful resolutions will always result in a string value. This will be the value of the resolved mapping itself – which means that the output is a relative file path.

This function may throw an Error if:

* the requested `entry` cannot be resolved (aka, not defined in the `"exports"` map)
* an `entry` _was_ resolved but no known conditions were found (see [`options.conditions`](#optionsconditions))

#### pkg
Type: `object` <br>
Required: `true`

The `package.json` contents.

#### entry
Type: `string` <br>
Required: `false` <br>
Default: `.` (aka, root)

The desired target entry, or the original `import` path.

When `entry` _is not_ a relative path (aka, does not start with `'.'`), then `entry` is given the `'./'` prefix.

When `entry` begins with the package name (determined via the `pkg.name` value), then `entry` is truncated and made relative.

When `entry` is already relative, it is accepted as is.

***Examples***

Assume we have a module named "foobar" and whose `pkg` contains `"name": "foobar"`.

| `entry` value | treated as | reason |
|-|-|-|
| `null` / `undefined` | `'.'` | default |
| `'.'` | `'.'` | value was relative |
| `'foobar'` | `'.'` | value was `pkg.name` |
| `'foobar/lite'` | `'./lite'` | value had `pkg.name` prefix |
| `'./lite'` | `'./lite'` | value was relative |
| `'lite'` | `'./lite'` | value was not relative & did not have `pkg.name` prefix |


#### options.require
Type: `boolean` <br>
Default: `false`

When truthy, the `"require"` field is added to the list of allowed/known conditions.

When falsey, the `"import"` field is added to the list of allowed/known conditions instead.

#### options.browser
Type: `boolean` <br>
Default: `false`

When truthy, the `"browser"` field is added to the list of allowed/known conditions.

#### options.conditions
Type: `string[]` <br>
Default: `[]`

Provide a list of additional/custom conditions that should be accepted when seen.

> **Important:** The order specified within `options.conditions` does not matter. <br>The matching order/priority is **always** determined by the `"exports"` map's key order.

For example, you may choose to accept a `"production"` condition in certain environments. Given the following `pkg` content:

```js
const contents = {
  // ...
  "exports": {
    "worker": "./index.worker.js",
    "require": "./index.require.js",
    "production": "./index.prod.js",
    "import": "./index.import.mjs",
  }
};

resolve(contents, '.');
//=> "./index.import.mjs"

resolve(contents, '.', {
  conditions: ['production']
}); //=> "./index.prod.js"

resolve(contents, '.', {
  conditions: ['production'],
  require: true,
}); //=> "./index.require.js"

resolve(contents, '.', {
  conditions: ['production', 'worker'],
  require: true,
}); //=> "./index.worker.js"

resolve(contents, '.', {
  conditions: ['production', 'worker']
}); //=> "./index.worker.js"
```

#### options.unsafe
Type: `boolean` <br>
Default: `false`

> **Important:** You probably do not want this option! <br>It will break out of Node's default resolution conditions.

When enabled, this option will ignore **all other options** except [`options.conditions`](#optionsconditions). This is because, when enabled, `options.unsafe` **does not** assume or provide any default conditions except the `"default"` condition.

```js
resolve(contents);
//=> Conditions: ["default", "import", "node"]

resolve(contents, { unsafe: true });
//=> Conditions: ["default"]

resolve(contents, { unsafe: true, require: true, browser: true });
//=> Conditions: ["default"]
```

In other words, this means that trying to use `options.require` or `options.browser` alongside `options.unsafe` will have no effect. In order to enable these conditions, you must provide them manually into the `options.conditions` list:

```js
resolve(contents, {
  unsafe: true,
  conditions: ["require"]
});
//=> Conditions: ["default", "require"]

resolve(contents, {
  unsafe: true,
  conditions: ["browser", "require", "custom123"]
});
//=> Conditions: ["default", "browser", "require", "custom123"]
```


### legacy(pkg, options?)
Returns: `string` or `undefined`

Also included is a "legacy" method for resolving non-`"exports"` package fields. This may be used as a fallback method when for when no `"exports"` mapping is defined. In other words, it's completely optional (and tree-shakeable).

You may customize the field priority via [`options.fields`](#optionsfields).

When a field is found, its value is returned _as written_. <br>
When no fields were found, `undefined` is returned. If you wish to mimic Node.js behavior, you can assume this means `'index.js'` – but this module does not make that assumption for you.

#### options.browser
Type: `boolean` or `string` <br>
Default: `false`

When truthy, ensures that the `'browser'` field is part of the acceptable `fields` list.

> **Important:** If your custom [`options.fields`](#optionsfields) value includes `'browser'`, then _your_ order is respected. <br>Otherwise, when truthy, `options.browser` will move `'browser'` to the front of the list, making it the top priority.

When `true` and `"browser"` is an object, then `legacy()` will return the the entire `"browser"` object.

You may also pass a string value, which will be treated as an import/file path. When this is the case and `"browser"` is an object, then `legacy()` may return:

* `false` – if the package author decided a file should be ignored; or
* your `options.browser` string value – but made relative, if not already

> See the [`"browser" field specification](https://github.com/defunctzombie/package-browser-field-spec) for more information.

#### options.fields
Type: `string[]` <br>
Default: `['module', 'main']`

A list of fields to accept. The order of the array determines the priority/importance of each field, with the most important fields at the beginning of the list.

By default, the `legacy()` method will accept any `"module"` and/or "main" fields if they are defined. However, if both fields are defined, then "module" will be returned.

```js
const contents = {
  "name": "...",
  "worker": "worker.js",
  "module": "module.mjs",
  "browser": "browser.js",
  "main": "main.js",
}

legacy(contents);
// fields = [module, main]
//=> "module.mjs"

legacy(contents, { browser: true });
// fields = [browser, module, main]
//=> "browser.mjs"

legacy(contents, {
  fields: ['missing', 'worker', 'module', 'main']
});
// fields = [missing, worker, module, main]
//=> "worker.js"

legacy(contents, {
  fields: ['missing', 'worker', 'module', 'main'],
  browser: true,
});
// fields = [browser, missing, worker, module, main]
//=> "browser.js"

legacy(contents, {
  fields: ['module', 'browser', 'main'],
  browser: true,
});
// fields = [module, browser, main]
//=> "module.mjs"
```

## License

MIT © [Luke Edwards](https://lukeed.com)
