# `brace-style`

Enforce consistent brace style for blocks.

## Rule Details

This rule extends the base [`eslint/brace-style`](https://eslint.org/docs/rules/brace-style) rule.
It adds support for `enum`, `interface`, `namespace` and `module` declarations.

## How to Use

```jsonc
{
  // note you must disable the base rule as it can report incorrect errors
  "brace-style": "off",
  "@typescript-eslint/brace-style": ["error"]
}
```

## Options

See [`eslint/brace-style` options](https://eslint.org/docs/rules/brace-style#options).

<sup>

Taken with ❤️ [from ESLint core](https://github.com/eslint/eslint/blob/main/docs/rules/brace-style.md)

</sup>

## Attributes

- [ ] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
