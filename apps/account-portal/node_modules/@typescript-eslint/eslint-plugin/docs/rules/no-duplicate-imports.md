# `no-duplicate-imports`

Disallow duplicate imports.

## Rule Details

This rule extends the base [`eslint/no-duplicate-imports`](https://eslint.org/docs/rules/no-duplicate-imports) rule.
This version adds support for type-only import and export.

## How to Use

```jsonc
{
  // note you must disable the base rule as it can report incorrect errors
  "no-duplicate-imports": "off",
  "@typescript-eslint/no-duplicate-imports": ["error"]
}
```

## Options

See [`eslint/no-duplicate-imports` options](https://eslint.org/docs/rules/no-duplicate-imports#options).

<sup>

Taken with ❤️ [from ESLint core](https://github.com/eslint/eslint/blob/main/docs/rules/no-duplicate-imports.md)

</sup>

## Attributes

- [ ] ✅ Recommended
- [ ] 🔧 Fixable
- [ ] 💭 Requires type information
