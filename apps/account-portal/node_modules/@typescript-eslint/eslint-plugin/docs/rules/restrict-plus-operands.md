# `restrict-plus-operands`

When adding two variables, operands must both be of type number or of type string.

## Rule Details

Examples of code for this rule:

<!--tabs-->

### ❌ Incorrect

```ts
var foo = '5.5' + 5;
var foo = 1n + 1;
```

### ✅ Correct

```ts
var foo = parseInt('5.5', 10) + 10;
var foo = 1n + 1n;
```

## Options

The rule accepts an options object with the following properties:

```ts
type Options = {
  // if true, check compound assignments (`+=`)
  checkCompoundAssignments?: boolean;
  // if true, 'any' itself and `string`,`bigint`, `number` is allowed.
  allowAny?: boolean;
};

const defaults = {
  checkCompoundAssignments: false,
  allowAny: false,
};
```

### `checkCompoundAssignments`

Examples of code for this rule with `{ checkCompoundAssignments: true }`:

<!--tabs-->

#### ❌ Incorrect

```ts
/*eslint @typescript-eslint/restrict-plus-operands: ["error", { "checkCompoundAssignments": true }]*/

let foo: string | undefined;
foo += 'some data';

let bar: string = '';
bar += 0;
```

#### ✅ Correct

```ts
/*eslint @typescript-eslint/restrict-plus-operands: ["error", { "checkCompoundAssignments": true }]*/

let foo: number = 0;
foo += 1;

let bar = '';
bar += 'test';
```

### `allowAny`

Examples of code for this rule with `{ allowAny: true }`:

<!--tabs-->

#### ❌ Incorrect

```ts
var fn = (a: any, b: boolean) => a + b;
var fn = (a: any, b: []) => a + b;
var fn = (a: any, b: {}) => a + b;
```

#### ✅ Correct

```ts
var fn = (a: any, b: any) => a + b;
var fn = (a: any, b: string) => a + b;
var fn = (a: any, b: bigint) => a + b;
var fn = (a: any, b: number) => a + b;
```

## How to Use

```json
{
  "@typescript-eslint/restrict-plus-operands": "error"
}
```

## Related To

- TSLint: [restrict-plus-operands](https://palantir.github.io/tslint/rules/restrict-plus-operands/)

## Attributes

- [x] ✅ Recommended
- [ ] 🔧 Fixable
- [x] 💭 Requires type information
