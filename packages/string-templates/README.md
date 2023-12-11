# String templating

This package provides a common system for string templating across the Budibase Builder, client and server.
The templating is provided through the use of [Handlebars](https://handlebarsjs.com/) an extension of Mustache
which is capable of carrying out logic. We have also extended the base Handlebars functionality through the use
of a set of helpers provided through the [handlebars-helpers](https://github.com/budibase/handlebars-helpers) package.

We have not implemented all the helpers provided by the helpers package as some of them provide functionality
we felt would not be beneficial. The following collections of helpers have been implemented:

1. [Math](https://github.com/budibase/handlebars-helpers/tree/master#math) - a set of useful helpers for
   carrying out logic pertaining to numbers e.g. `avg`, `add`, `abs` and so on.
2. [Array](https://github.com/budibase/handlebars-helpers/tree/master#array) - some very specific helpers
   for use with arrays, useful for example in automations. Helpers like `first`, `last`, `after` and `join`
   can be useful for getting particular portions of arrays or turning them into strings.
3. [Number](https://github.com/budibase/handlebars-helpers/tree/master#number) - unlike the math helpers these
   are useful for converting numbers into useful formats for display, e.g. `bytes`, `addCommas` and `toPrecision`.
4. [URL](https://github.com/budibase/handlebars-helpers/tree/master#url) - very specific helpers for dealing with URLs,
   such as `encodeURI`, `escape`, `stripQueryString` and `stripProtocol`. These are primarily useful
   for building up particular URLs to hit as say part of an automation.
5. [String](https://github.com/budibase/handlebars-helpers/tree/master#string) - these helpers are useful for building
   strings and preparing them for display, e.g. `append`, `camelcase`, `capitalize` and `ellipsis`.
6. [Comparison](https://github.com/budibase/handlebars-helpers/tree/master#comparison) - these helpers are mainly for
   building strings when particular conditions are met, for example `and`, `or`, `gt`, `lt`, `not` and so on. This is a very
   extensive set of helpers but is mostly as would be expected from a set of logical operators.
7. [Object](https://github.com/budibase/handlebars-helpers/tree/master#object) - useful operator for parsing objects, as well
   as converting them to JSON strings.
8. [Regex](https://github.com/budibase/handlebars-helpers/tree/master#regex) - allows performing regex tests on strings that
   can be used in conditional statements.
9. [Date](https://github.com/helpers/helper-date) - last but certainly not least is a moment based date helper, which can
   format ISO/timestamp based dates into something human-readable. An example of this would be `{{date dateProperty "DD-MM-YYYY"}}`.

## Date formatting

This package uses the standard method for formatting date times, using the following syntax:
| Input | Example | Description |
| ----- | ------- | ----------- |
| YYYY | 2014 | 4 or 2 digit year. Note: Only 4 digit can be parsed on strict mode |
| YY | 14 | 2 digit year |
| Y | -25 | Year with any number of digits and sign |
| Q | 1..4 | Quarter of year. Sets month to first month in quarter. |
| M MM | 1..12 | Month number |
| MMM MMMM | Jan..December | Month name in locale set by moment.locale() |
| D DD | 1..31 | Day of month |
| Do | 1st..31st | Day of month with ordinal |
| DDD DDDD | 1..365 | Day of year |
| X | 1410715640.579 | Unix timestamp |
| x | 1410715640579 | Unix ms timestamp |

## Template format

There are two main ways that the templating system can be used, the first is very similar to that which
would be produced by Mustache - a single statement:

```
Hello I'm building a {{uppercase adjective}} string with Handlebars!
```

In the statement above provided a context of `{adjective: "cool"}` will produce a string of `Hello I'm building a COOL string with Handlebars!`.
Here we can see an example of how string helpers can be used to make a string exactly as we need it. These statements are relatively
simple; we can also stack helpers as such: `{{ uppercase (remove string "bad") }}` with the use of parenthesis.

The other type of statement that can be made with the templating system is conditional ones, that appear as such:

```
Hello I'm building a {{ #gte score "50" }}Great{{ else }}Bad{{ /gte }} string with Handlebars!
```

In this string we can see that the string `Great` or `Bad` will be inserted depending on the state of the
`score` context variable. The comparison, string and array helpers all provide some conditional operators which can be used
in this way. There will also be some operators which will be built with a very similar syntax but will produce an
iterative operation, like a for each - an example of this would be the `forEach` array helper.

## Usage

Usage of this templating package is through one of the primary functions provided by the package - these functions are
as follows:

1. `processString` - `async (string, object)` - given a template string and a context object this will build a string
   using our pre-processors, post-processors and handlebars.
2. `processObject` - `async (object, object)` - carries out the functionality provided by `processString` for any string
   inside the given object. This will recurse deeply into the provided object so for very large objects this could be slow.
3. `processStringSync` - `(string, object)` - a reduced functionality processing of strings which is synchronous, like
   functions provided by Node (e.g. `readdirSync`)
4. `processObjectSync` - `(object, object)` - as with the sync'd string, recurses an object to process it synchronously.
5. `makePropSafe` - `(string)` - some properties cannot be handled by Handlebars, for example `Table 1` is not valid due
   to spaces found in the property name. This will update the property name to `[Table 1]` wrapping it in literal
   specifiers so that it is safe for use in Handlebars. Ideally this function should be called for every level of an object
   being accessed, for example `[Table 1].[property name]` is the syntax that is required for Handlebars.
6. `isValid` - `(string)` - checks the given string for any templates and provides a boolean stating whether it is a valid
   template.
7. `getManifest` - returns the manifest JSON which has been generated for the helpers, describing them and their params.

## Development

This library is built with [Rollup](https://rollupjs.org/guide/en/) as many of the packages built by Budibase are. We have
built the string templating package as a UMD so that it can be used by Node and Browser based applications. This package also
builds Typescript stubs which when making use of the library will be used by your IDE to provide code completion. The following
commands are provided for development purposes:

1. `yarn build` - will build the Typescript stubs and the bundle into the `dist` directory.
2. `yarn test` - runs the test suite which will check various helpers are still functioning as
   expected and a few expected use cases.
3. `yarn dev` - an internal command which is used by lerna to watch and build any changes
   to the package as part of the main `yarn dev` of the repo.

It is also important to note this package is managed in the same manner as all other in the mono-repo,
through lerna.
