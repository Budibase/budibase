# `prefer-namespace-keyword`

Require the use of the `namespace` keyword instead of the `module` keyword to declare custom TypeScript modules.

In an effort to prevent further confusion between custom TypeScript modules and the new ES2015 modules, starting
with TypeScript `v1.5` the keyword `namespace` is now the preferred way to declare custom TypeScript modules.

## Rule Details

This rule aims to standardize the way modules are declared.

## When Not To Use It

If you are using the ES2015 module syntax, then you will not need this rule.

## Options

```jsonc
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/prefer-namespace-keyword": "error"
  }
}
```

This rule is not configurable.

## Further Reading

- [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html)
- [Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

## Related To

- TSLint: [no-internal-module](https://palantir.github.io/tslint/rules/no-internal-module/)

## Attributes

- [x] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
