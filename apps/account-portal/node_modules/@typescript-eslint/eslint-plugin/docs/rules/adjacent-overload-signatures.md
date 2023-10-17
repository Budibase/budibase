# `adjacent-overload-signatures`

Require that member overloads be consecutive.

Grouping overloaded members together can improve readability of the code.

## Rule Details

This rule aims to standardize the way overloaded members are organized.

<!--tabs-->

### ❌ Incorrect

```ts
declare namespace Foo {
  export function foo(s: string): void;
  export function foo(n: number): void;
  export function bar(): void;
  export function foo(sn: string | number): void;
}

type Foo = {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void;
  foo(sn: string | number): void;
};

interface Foo {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void;
  foo(sn: string | number): void;
}

class Foo {
  foo(s: string): void;
  foo(n: number): void;
  bar(): void {}
  foo(sn: string | number): void {}
}

export function foo(s: string): void;
export function foo(n: number): void;
export function bar(): void;
export function foo(sn: string | number): void;
```

### ✅ Correct

```ts
declare namespace Foo {
  export function foo(s: string): void;
  export function foo(n: number): void;
  export function foo(sn: string | number): void;
  export function bar(): void;
}

type Foo = {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void;
  bar(): void;
};

interface Foo {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void;
  bar(): void;
}

class Foo {
  foo(s: string): void;
  foo(n: number): void;
  foo(sn: string | number): void {}
  bar(): void {}
}

export function bar(): void;
export function foo(s: string): void;
export function foo(n: number): void;
export function foo(sn: string | number): void;
```

## Options

```jsonc
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/adjacent-overload-signatures": "error"
  }
}
```

This rule is not configurable.

## When Not To Use It

If you don't care about the general structure of the code, then you will not need this rule.

## Related To

- TSLint: [adjacent-overload-signatures](https://palantir.github.io/tslint/rules/adjacent-overload-signatures/)

## Attributes

- [x] ✅ Recommended
- [ ] 🔧 Fixable
- [ ] 💭 Requires type information
