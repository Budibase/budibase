# `comma-spacing`

Enforces consistent spacing before and after commas.

## Rule Details

This rule extends the base [`eslint/comma-spacing`](https://eslint.org/docs/rules/comma-spacing) rule.
It adds support for trailing comma in a types parameters list.

## How to Use

```jsonc
{
  // note you must disable the base rule as it can report incorrect errors
  "comma-spacing": "off",
  "@typescript-eslint/comma-spacing": ["error"]
}
```

## Options

See [`eslint/comma-spacing` options](https://eslint.org/docs/rules/comma-spacing#options).

<sup>

Taken with ❤️ [from ESLint core](https://github.com/eslint/eslint/blob/main/docs/rules/comma-spacing.md)

</sup>

## Attributes

- [ ] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
