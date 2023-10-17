# `no-extra-non-null-assertion`

Disallow extra non-null assertion.

## Rule Details

Examples of code for this rule:

<!--tabs-->

### ❌ Incorrect

```ts
const foo: { bar: number } | null = null;
const bar = foo!!!.bar;
```

```ts
function foo(bar: number | undefined) {
  const bar: number = bar!!!;
}
```

```ts
function foo(bar?: { n: number }) {
  return bar!?.n;
}
```

### ✅ Correct

```ts
const foo: { bar: number } | null = null;
const bar = foo!.bar;
```

```ts
function foo(bar: number | undefined) {
  const bar: number = bar!;
}
```

```ts
function foo(bar?: { n: number }) {
  return bar?.n;
}
```

## Options

```jsonc
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-extra-non-null-assertion": "error"
  }
}
```

This rule is not configurable.

## Attributes

- [x] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
