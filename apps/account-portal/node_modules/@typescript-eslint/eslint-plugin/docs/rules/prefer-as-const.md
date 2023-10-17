# `prefer-as-const`

Prefer usage of `as const` over literal type.

This rule recommends usage of `const` assertion when type primitive value is equal to type.

## Rule Details

Examples of code for this rule:

<!--tabs-->

### ❌ Incorrect

```ts
let bar: 2 = 2;
let foo = <'bar'>'bar';
let foo = { bar: 'baz' as 'baz' };
```

### ✅ Correct

```ts
let foo = 'bar';
let foo = 'bar' as const;
let foo: 'bar' = 'bar' as const;
let bar = 'bar' as string;
let foo = <string>'bar';
let foo = { bar: 'baz' };
```

<!--/tabs-->

## Options

```jsonc
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/prefer-as-const": "error"
  }
}
```

This rule is not configurable.

## When Not To Use It

If you are using TypeScript < 3.4

## Attributes

- [x] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
