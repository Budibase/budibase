# Changelog

## [5.0.0]

### Features

- Introduce contextual styles (#744)
- Opt-in react 18 insertion effect hook when available (#753)
- Fallback to module level registry in browser (#768)

### Improvements

- Make JSXStyle return a noop if the registry context is not provided (#749)
- Fix typings of `nonce` property
- Pre-compile dependencies to reduce install size/time (#770)

### BREAKING CHANGES

#### APIs

- `styled-jsx/server` import path is deprecated
- `flush` and `flushToHTML` from `styled-jsx/server` APIs are deprecated
- New component `<StyledRegistry>` is introduced
- New APIs `useStyleRegistry` and `createStyleRegistry` are introduced

#### Usage

If you're only using styled-jsx purely client side, nothing will effect you.
If you're using styled-jsx inside Next.js without customization, Next.js will automatically handle the changes for you.

If you have your own customization with styled-jsx in Next.js, for example you have a custom `_document`:
By default, doing this will let Next.js collect styles and pass them down.

```jsx
class Document extends React.Component {
  static async getInitialProps(ctx) {
    return await ctx.defaultGetInitialProps(ctx)
  }
}
```

Or for instance you're passing `nonce` property in `getInitialProps` of `_document`, this will let you configure it:

```diff
class Document extends React.Component {
  static async getInitialProps(ctx) {
-    return await ctx.defaultGetInitialProps(ctx)
+    return await ctx.defaultGetInitialProps(ctx, { nonce })
  }
}
```

If you're building the SSR solution yourself with other frameworks, please checkout the **Server-Side Rendering** section in readme.

## [4.0.1]

- Mark `@babel/core` as optional peer dependency

## [4.0.0]

- Use react hooks to manage styles injection (#720)

### BREAKING CHANGES

- Drop support for react versions < 16.8.0

### Improvements

- Drop babel 6 support (#730)
- Auto publish alpha/beta versions

## [3.4.x]

### Improvements

- Typing support
- Inject unique \_JSXStyle identifier
- Hide webpack loader warnings
- Refactor the import helpers
