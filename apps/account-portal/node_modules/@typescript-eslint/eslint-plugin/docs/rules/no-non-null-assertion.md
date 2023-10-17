# `no-non-null-assertion`

Disallows non-null assertions using the `!` postfix operator.

## Rule Details

Using non-null assertions cancels the benefits of the strict null-checking mode.

Examples of code for this rule:

<!--tabs-->

### ❌ Incorrect

```ts
interface Foo {
  bar?: string;
}

const foo: Foo = getFoo();
const includesBaz: boolean = foo.bar!.includes('baz');
```

### ✅ Correct

```ts
interface Foo {
  bar?: string;
}

const foo: Foo = getFoo();
const includesBaz: boolean = foo.bar?.includes('baz') ?? false;
```

## Options

```jsonc
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-non-null-assertion": "warn"
  }
}
```

This rule is not configurable.

## When Not To Use It

If you don't care about strict null-checking, then you will not need this rule.

## Further Reading

- [`no-non-null-assertion`](https://palantir.github.io/tslint/rules/no-non-null-assertion/) in [TSLint](https://palantir.github.io/tslint/)

## Attributes

- [x] ✅ Recommended
- [ ] 🔧 Fixable
- [ ] 💭 Requires type information
