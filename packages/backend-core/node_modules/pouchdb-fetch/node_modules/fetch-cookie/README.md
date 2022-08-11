# fetch-cookie [![npm version](https://badge.fury.io/js/fetch-cookie.svg)](https://badge.fury.io/js/fetch-cookie) [![Build Status](https://travis-ci.org/valeriangalliat/fetch-cookie.svg?branch=master)](https://travis-ci.org/valeriangalliat/fetch-cookie)

> Decorator for a `fetch` function to support automatic cookie storage and population.

## Description

`fetch-cookie` wraps arround a `fetch` function and **intercepts request options and response
objects to store received cookies and populate request with the appropriate cookies**.

This library is developed with Node.Js and fetch polyfill libraries such as [node-fetch] in mind, since
the browser version is supposed to let a way [to include cookies in requests][include].
Compatibility may not be guaranteed but as long as your library implements the [Fetch Standard] you should be fine.
In case of incompatibilities, please create a new issue.

[Fetch Standard]: https://fetch.spec.whatwg.org/
[node-fetch]: https://www.npmjs.com/package/node-fetch
[include]: http://updates.html5rocks.com/2015/03/introduction-to-fetch#sending-credentials-with-a-fetch-request

Internally the plugin uses a cookie jar. You can insert your own (details below) but [tough-cookie] is preferred.

[tough-cookie]: https://www.npmjs.com/package/tough-cookie

## Usage

### Basic

```js
const nodeFetch = require('node-fetch')
const fetch = require('fetch-cookie')(nodeFetch)
```

### Custom cookie jar

If you want to customize the internal cookie jar instance (for example, with a custom store), you can inject it as a second argument:

```js
const nodeFetch = require('node-fetch')
const tough = require('tough-cookie')
const fetch = require('fetch-cookie')(nodeFetch, new tough.CookieJar())
```

This enables you to create multiple `fetch-cookie` instances that use different cookie jars,
esentially two different HTTP clients with different login sessions on you backend (for example).

All calls to `fetch` will store and send back cookies according to the URL.

> Note: All errors when setting cookies are ignored by default. You can make it to throw errors in cookies by passing a third argument (default is true).

```js
const nodeFetch = require('node-fetch')
const tough = require('tough-cookie')
const fetch = require('fetch-cookie')(nodeFetch, new tough.CookieJar(), false) // default value is true
// false - doesn't ignore errors, throws when an error occurs in setting cookies and breaks the request and execution
// true - silently ignores errors and continues to make requests/redirections
```

If you use a cookie jar that is not tough-cookie, keep in mind that it must implement this interface to be compatible:

```ts
interface CookieJar {
  getCookieString(currentUrl: string, cb: (err: any, cookies: string) => void): void;
  setCookie(cookieString: string, currentUrl: string, cb: (err: any) => void, opts: { ignoreError:boolean }): void;
}
```

### Cookies on redirects

**Details:** By default, cookies are not set correctly in the edge case where a response
sets cookies and redirects to another URL. A real-life example of this behaviour
is a login page setting a session cookie and redirecting.

The reason for this limitation is that the generic fetch API does not allow any way to
hook into redirects. However, the [node-fetch] library does expose its own API which
we can use.

**TLDR:** Ff cookies during indirection turns out to be a requirement for you,
and if you are using [node-fetch], then you can use the custom node-fetch decorator
provided with this library:

```js
const nodeFetch = require('node-fetch')
const fetch = require('fetch-cookie/node-fetch')(nodeFetch)
```
