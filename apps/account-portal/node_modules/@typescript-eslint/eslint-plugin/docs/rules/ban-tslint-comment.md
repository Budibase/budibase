# `ban-tslint-comment`

Bans `// tslint:<rule-flag>` comments from being used.

Useful when migrating from TSLint to ESLint. Once TSLint has been removed, this rule helps locate TSLint annotations (e.g. `// tslint:disable`).

## Rule Details

All TSLint [rule flags](https://palantir.github.io/tslint/usage/rule-flags/)

<!--tabs-->

### ❌ Incorrect

```js
/* tslint:disable */
/* tslint:enable */
/* tslint:disable:rule1 rule2 rule3... */
/* tslint:enable:rule1 rule2 rule3... */
// tslint:disable-next-line
someCode(); // tslint:disable-line
// tslint:disable-next-line:rule1 rule2 rule3...
```

### ✅ Correct

```js
// This is a comment that just happens to mention tslint
/* This is a multiline comment that just happens to mention tslint */
someCode(); // This is a comment that just happens to mention tslint
```

## When Not To Use It

If you are still using TSLint.

## Attributes

- [ ] ✅ Recommended
- [x] 🔧 Fixable
- [ ] 💭 Requires type information
