# 3.2.0

- Support lazy-loading TypeScript compiler
- Support non-CommonJS format of ESLint configuration file when using TypeScript by specifying `true` in configuration
- Improve logic for finding the correct `Linter` instance in a workspace with multiple directories
- Improve filtering of `@typescript-eslint/indent` and `@typescript-eslint/quotes` messages like what already happens with `indent` and `quotes`
- Fix erroneous messages when a component only writes to a store

# 3.1.2

- Silence some incorrect `unsafe-member-access` errors - see README for current limitations

# 3.1.1

- Fix erroneous errors from two-way binding in TypeScript components
- Fix erroneous warnings from the removal of `import`s in TypeScript components

# 3.1.0

- Add TypeScript support

# 3.0.0

- Breaking change: Node 10+ is now required
  - There are no specific changes yet that will not work on Node 8, but tests will no longer be run on Node 8, and there are no guarantees about it
- Fix erroneous `no-unused-vars` for variables that are assigned to in the template, but are only used in the script

# 2.7.3

- Fix mishandling of blocks whose last line consists of only the expected indentation

# 2.7.2

- Fix regression when using `linebreak-style` with Windows line endings

# 2.7.1

- Named code blocks were in fact a breaking change, sorry!
- They're now disabled by default, but can be enabled with `svelte3/named-blocks`

# 2.7.0

- Expose the parts of each linted component as separate named code blocks `module.js`, `instance.js`, and `template.js`

# 2.6.0

- Add `svelte3/compiler` setting to allow overriding which instance of the Svelte compiler is used

# 2.5.0

- Fix `let:` handling on regular elements as well
- Separate `then` and `catch` scopes in `{#await}`

# 2.4.2

- Fix handling of the scope created by `let:` directives

# 2.4.1

- Fix attribute parsing edge case in `svelte3/ignore-styles` callback

# 2.4.0

- Respect `no-self-assign` rule unless self-assignment is to a top-level variable known to the compiler
- Better handling of identifiers containing unicode characters

# 2.3.0

- Respect `quotes` rule unless inside a template expression which is inside an attribute or directive enclosed in quotes
- Respect `no-unused-expressions` rule again (which is now safe thanks to a previous refactor)

# 2.2.2

- Stop using inline configuration comments internally, to avoid issues with `--no-inline-config` and `--report-unused-disable-directives`

# 2.2.1

- Handle `then` and `catch` scope in `{#await}`

# 2.2.0

- Enforce semicolon rules in template expressions
- Fix parsing of template expressions that are object literals
- Don't produce multiple messages for template expressions wrapped in parentheses

# 2.1.0

- Preserve linting messages about labels other than `$`

# 2.0.2

- Actually fix ignoring of rules in the template

# 2.0.1

- Disregard `eol-last` rule
- Disregard `no-unused-expressions` rule in the template
- Fix bug where rules intended to only be ignored in the template were being ignored in the entire file

# v2.0.0

- Require Svelte v3.2+ and ESLint 6+
- Reworked configuration:
  - `svelte3/enabled` has been removed in favor of registering a `svelte3/svelte3` processor that you need to enable on files
  - `svelte3/ignore-warnings` now only takes a callback which is passed the warning object
  - `svelte3/compiler-options` now only takes a compiler options object
  - `svelte3/ignore-styles` now only takes a preprocessor-style callback
  - `svelte3/lint-template` has been removed, and template linting is now always enabled

# v1.2.3

- Fix a weird edge case where fixes to problems could be lost in certain cases

# v1.2.2

- Internal improvements to AST walk

# v1.2.1

- Avoid mutating the AST while linting, which can have adverse effects

# v1.2.0

- Pass a second argument to the `svelte3/ignore-warnings` function that contains the entire warning object
- Disregard `no-labels` rule and `no-restricted-syntax` rule in places where it disallows labels

# v1.1.0

- Experimental support for linting expressions in the template, behind the `svelte3/lint-template` setting. This feature requires Svelte 3.2.0

# v1.0.0

- Svelte v3 release party!

# v0.4.7

- Fix regression with specifying an array of warnings to ignore

# v0.4.6

- Add `svelte3/compiler-options` setting to control how the compiler is called during linting

# v0.4.5

- Proper fix for not wiping tag names that begin with `<style`

# v0.4.4

- With `svelte3/ignore-warnings`, don't wipe elements whose tag names merely begin with `<style`
- The plugin is now published to npm

# v0.4.3

- Better handling for files linted in Windows/CRLF `linebreak-style`

# v0.4.2

- Work around issues caused by ESLint issues with fixes that replace more of the file than necessary

# v0.4.1

- Make sure fixes for issues at the beginning and end of the scripts do not change text outside of the scripts

# v0.4.0

- Reworked configuration to be more flexible:
  - `svelte3/ignore` has been renamed to `svelte3/ignore-warnings`
  - `svelte3/extensions` has been removed and `svelte3/enabled` has been added (which works differently but is more powerful)
- `svelte3/ignore-styles` has been added as an immediate solution for components with styles written in something other than normal CSS

# v0.3.0

- Support and require at least beta 4

# v0.2.3

- Add `svelte3/ignore` setting for ignoring specific compiler warnings

# v0.2.2

- Include the position of the end of a compiler error message, when available

# v0.2.1

- Don't warn about `export let`s with default values and no other reassignments when using `prefer-const`

# v0.2.0

- Add handling of store auto-subscriptions and other injected variables
- Require alpha 21

# v0.1.0

- Initial release
