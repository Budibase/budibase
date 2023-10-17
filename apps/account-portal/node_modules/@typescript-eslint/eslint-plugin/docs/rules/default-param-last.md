# `default-param-last`

Enforce default parameters to be last.

## Rule Details

This rule extends the base [`eslint/default-param-last`](https://eslint.org/docs/rules/default-param-last) rule.
It adds support for optional parameters.

<!--tabs-->

### ❌ Incorrect

```ts
/* eslint @typescript-eslint/default-param-last: ["error"] */

function f(a = 0, b: number) {}
function f(a: number, b = 0, c: number) {}
function f(a: number, b?: number, c: number) {}
class Foo {
  constructor(public a = 10, private b: number) {}
}
class Foo {
  constructor(public a?: number, private b: number) {}
}
```

### ✅ Correct

```ts
/* eslint @typescript-eslint/default-param-last: ["error"] */

function f(a = 0) {}
function f(a: number, b = 0) {}
function f(a: number, b?: number) {}
function f(a: number, b?: number, c = 0) {}
function f(a: number, b = 0, c?: number) {}
class Foo {
  constructor(public a, private b = 0) {}
}
class Foo {
  constructor(public a, private b?: number) {}
}
```

## How to Use

```jsonc
{
  // note you must disable the base rule as it can report incorrect errors
  "default-param-last": "off",
  "@typescript-eslint/default-param-last": ["error"]
}
```

## Options

See [`eslint/default-param-last` options](https://eslint.org/docs/rules/default-param-last#options).

<sup>

Taken with ❤️ [from ESLint core](https://github.com/eslint/eslint/blob/main/docs/rules/default-param-last.md)

</sup>

## Attributes

- [ ] ✅ Recommended
- [ ] 🔧 Fixable
- [ ] 💭 Requires type information
