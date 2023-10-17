# `no-inferrable-types`

Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean.

Explicit types where they can be easily inferred may add unnecessary verbosity.

## Rule Details

This rule disallows explicit type declarations on parameters, variables
and properties where the type can be easily inferred from its value.

## Options

This rule accepts the following options:

```ts
interface Options {
  ignoreParameters?: boolean;
  ignoreProperties?: boolean;
}
```

### Default

The default options are:

```json
{
  "ignoreParameters": false,
  "ignoreProperties": false
}
```

With these options, the following patterns are:

<!--tabs-->

#### ❌ Incorrect

```ts
const a: bigint = 10n;
const a: bigint = -10n;
const a: bigint = BigInt(10);
const a: bigint = -BigInt(10);
const a: boolean = false;
const a: boolean = true;
const a: boolean = Boolean(null);
const a: boolean = !0;
const a: number = 10;
const a: number = +10;
const a: number = -10;
const a: number = Number('1');
const a: number = +Number('1');
const a: number = -Number('1');
const a: number = Infinity;
const a: number = +Infinity;
const a: number = -Infinity;
const a: number = NaN;
const a: number = +NaN;
const a: number = -NaN;
const a: null = null;
const a: RegExp = /a/;
const a: RegExp = RegExp('a');
const a: RegExp = new RegExp('a');
const a: string = 'str';
const a: string = `str`;
const a: string = String(1);
const a: symbol = Symbol('a');
const a: undefined = undefined;
const a: undefined = void someValue;

class Foo {
  prop: number = 5;
}

function fn(a: number = 5, b: boolean = true) {}
```

#### ✅ Correct

```ts
const a = 10n;
const a = -10n;
const a = BigInt(10);
const a = -BigInt(10);
const a = false;
const a = true;
const a = Boolean(null);
const a = !0;
const a = 10;
const a = +10;
const a = -10;
const a = Number('1');
const a = +Number('1');
const a = -Number('1');
const a = Infinity;
const a = +Infinity;
const a = -Infinity;
const a = NaN;
const a = +NaN;
const a = -NaN;
const a = null;
const a = /a/;
const a = RegExp('a');
const a = new RegExp('a');
const a = 'str';
const a = `str`;
const a = String(1);
const a = Symbol('a');
const a = undefined;
const a = void someValue;

class Foo {
  prop = 5;
}

function fn(a = 5, b = true) {}

function fn(a: number, b: boolean, c: string) {}
```

<!--/tabs-->

### `ignoreParameters`

When set to true, the following pattern is considered valid:

```ts
function foo(a: number = 5, b: boolean = true) {
  // ...
}
```

### `ignoreProperties`

When set to true, the following pattern is considered valid:

```ts
class Foo {
  prop: number = 5;
}
```

## When Not To Use It

If you do not want to enforce inferred types.

## Further Reading

TypeScript [Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

## Related To

TSLint: [no-inferrable-types](https://palantir.github.io/tslint/rules/no-inferrable-types/)

## Attributes

- [x] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
