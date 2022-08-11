v 1.11.0
-------

- Fix request.ip and add request.ips [Issue #244][244].
- Add response.attachment() from express [Issue #246][246].
- Add request.getHeader() alias for request.header() [Issue #241][241].

[244]: https://github.com/howardabrams/node-mocks-http/issues/244
[246]: https://github.com/howardabrams/node-mocks-http/issues/246
[241]: https://github.com/howardabrams/node-mocks-http/issues/241

v 1.10.1
-------

  - Fix support for req.hostname [Issue #231][231].
  
  [231]: https://github.com/howardabrams/node-mocks-http/issues/231
  
v 1.10.0
-------

  - Add support for req.hostname [Issue #224][224].
  - Allow to chain writeHead() [Issue #229][229].

  [224]: https://github.com/howardabrams/node-mocks-http/issues/224
  [229]: https://github.com/howardabrams/node-mocks-http/issues/229
  
v 1.9.0
-------

  - Implement response.getHeaderNames() and response.hasHeader() [Issue #222][222].
  - Remove calls to deprecated Buffer constructors [Issue #221][221].
  - Run tests for Node 10, 12 and 14. Drop support for Node 6 and 8  [Issue #218][218].
  - Implement response.getHeaders()  [Issue #217][217].
  - Add req.subdomains  [Issue #213][213].
  - Add socket option to mockRequest  [Issue #209][209].
  - Fix index.d.ts  [Issue #205][205].
  - Added support for response.writableEnded and response.writableFinished [Issue #205][203].

  [222]: https://github.com/howardabrams/node-mocks-http/issues/222
  [221]: https://github.com/howardabrams/node-mocks-http/issues/221
  [218]: https://github.com/howardabrams/node-mocks-http/issues/218
  [217]: https://github.com/howardabrams/node-mocks-http/issues/217
  [213]: https://github.com/howardabrams/node-mocks-http/issues/213
  [209]: https://github.com/howardabrams/node-mocks-http/issues/209
  [205]: https://github.com/howardabrams/node-mocks-http/issues/205
  [203]: https://github.com/howardabrams/node-mocks-http/issues/203

v 1.8.1
-------

  - Enable res.render() callback argument [Issue #197][197].

  [197]: https://github.com/howardabrams/node-mocks-http/issues/197
 
  
v 1.8.0
-------

  - Added types for IncomingHeaders [Issue #192][192].
  - Enabled method chaining [Issue #191][191].
  - Added accepts language [Issue #188][188].

  [192]: https://github.com/howardabrams/node-mocks-http/issues/192
  [191]: https://github.com/howardabrams/node-mocks-http/issues/191
  [188]: https://github.com/howardabrams/node-mocks-http/issues/188

v 1.7.6
-------

  - Fix for [Issue #182][182].

  [182]: https://github.com/howardabrams/node-mocks-http/issues/182

v 1.7.5
-------

  - Updated the dependency tree with newer versions of `eslint`.

v 1.7.4
-------

  - Added `_getJSONData` function with data sent to the user as JSON. [#181][181]

  [181]: https://github.com/howardabrams/node-mocks-http/pull/181

v 1.7.3
-------

  - Added `.range()` on a mocked request mimicking the [same function](http://expressjs.com/en/4x/api.html#req.range) on Express' request. [#175][175]

  [175]: https://github.com/howardabrams/node-mocks-http/pull/175

v 1.7.2
-------

  - Revert Turn mock request into a stream [#174][174]
  - Fix security issues reported by npm audit

  [174]: https://github.com/howardabrams/node-mocks-http/pull/174

v 1.7.1
-------

  - Turn mock request into a stream [#169][169]
  - Added missing typings for "locals" & create a helper method to get locals [#170][170]
  - Make header names case-insensitive in response [#172][172]
  - Throw an error object instead of a string [#173][173]

  [169]: https://github.com/howardabrams/node-mocks-http/pull/169
  [170]: https://github.com/howardabrams/node-mocks-http/pull/170
  [172]: https://github.com/howardabrams/node-mocks-http/pull/172
  [173]: https://github.com/howardabrams/node-mocks-http/pull/173

v 1.7.0
-------

 - Add support for Buffer payload [#154][154]
 - Send request body/payload to trigger relevant events [#164][164]

 [154]: https://github.com/howardabrams/node-mocks-http/pull/154
 [164]: https://github.com/howardabrams/node-mocks-http/pull/164

v 1.6.8
-------

  - Better typings, including the following (see [PR #158][158] for details):
    - request object for a controller fn which is typed as extension of `express.Request`
    - same for `Response`
    - custom properties appended to request object
    - fixed missing `_getRenderView` method on `Response`

  **Note:** As of this release, we are officially supporting:
  - 6.13
  - 8.9
  - 9.6

  [158]: https://github.com/howardabrams/node-mocks-http/pull/158

v 1.6.7
-------

  - Set an expiration date to a cookie when deleting it [#155][155]
  - No `finish` event, `end` event called when it shouldn't be. [#112][112]
  - Add support for [append][] on MockResponse [#143][143]
  - Add [locals][] object to response [#135][135]

  Special shoutout to [Eugene Fidelin](https://github.com/eugef) for
  joining the team and helping out so much.

  [112]: https://github.com/howardabrams/node-mocks-http/issues/112
  [135]: https://github.com/howardabrams/node-mocks-http/issues/135
  [143]: https://github.com/howardabrams/node-mocks-http/issues/143
  [155]: https://github.com/howardabrams/node-mocks-http/issues/155
  [append]: http://expressjs.com/en/api.html#res.append
  [locals]: https://expressjs.com/en/api.html#res.locals

v 1.6.6
-------

  - Upgrade Fresh dependency to 0.5.2 due to a [Security advisory][166-SA]. [PR #147](https://github.com/howardabrams/node-mocks-http/pull/147)
  - Add the baseUrl property to the request object. [PR #150](https://github.com/howardabrams/node-mocks-http/pull/150)

  [166-SA]: https://nodesecurity.io/advisories/526

v 1.6.5
-------

  - Query type definition now more flexible [PR #146](https://github.com/howardabrams/node-mocks-http/pull/146)

v 1.6.4
-------

  - Incorporated a trimmed down published NPM artifact PR #141

v 1.6.3
-------

  - Moved @types/express to dev-dependencies. [PR #136][136]

  [136]: https://github.com/howardabrams/node-mocks-http/issues/136

v 1.6.1
-------

  - Fix for Issue #130 for method chaining for `cookie()` and `clearCookie()`
  - Fix for Issue #131 for adding `finished` to the response

v 1.6.0
-------

  - Dropping support for Node's "0" version, but will continue to support v4.
  - Verifying our builds with v6 (latest stable) as well as current work (v7)
  - Removing dependency on lodash and other bug fixes

v 1.5.4
-------

  * Call `write` method from json method of `responseMock` [PR #98][98]

  [98]: https://github.com/howardabrams/node-mocks-http/issues/98

v 1.5.3
-------

  * Add `.format` to the `mockResponse` object [PR #94][94]
  * Add `.location` to the `mockResponse` object [PR #96][96]
  * Add API method, `createMocks` to create both mocks with correct references

  [96]: https://github.com/howardabrams/node-mocks-http/issues/96
  [94]: https://github.com/howardabrams/node-mocks-http/issues/94

v 1.5.2
-------

  * Add case insensitive response headers [#85][85]
  * Fix behavior of `mockResponse.writeHead` [#92][92]
  * Add support for statusMessage [#84][84]
  * Fix issue with `req.param` not returning when false [#82][82]
  * Other bug fixes

  [92]: https://github.com/howardabrams/node-mocks-http/issues/92
  [84]: https://github.com/howardabrams/node-mocks-http/issues/84
  [82]: https://github.com/howardabrams/node-mocks-http/issues/82
  [85]: https://github.com/howardabrams/node-mocks-http/issues/85


v 1.5.1
-------

  * Add support for the `.vary()` response method

v 1.5.0
-------

Documentation changes, a new feature, and better behaviors, including:

  * Added `jsonp` method that takes a status code and a payload, see [PR #79][79]
  * Now able to attach non-standard properties to the mock request object. [PR #74][74]
  * param now takes a default value, see [PR #76][76]
  * Emit `end` when redirecting, see [PR #77][77]
  * Documentation changes, see [PR #64][64], [PR #75][75], [PR #78][78]

  [64]: https://github.com/howardabrams/node-mocks-http/issues/64
  [74]: https://github.com/howardabrams/node-mocks-http/issues/74
  [75]: https://github.com/howardabrams/node-mocks-http/issues/75
  [76]: https://github.com/howardabrams/node-mocks-http/issues/76
  [77]: https://github.com/howardabrams/node-mocks-http/issues/77
  [78]: https://github.com/howardabrams/node-mocks-http/issues/78
  [79]: https://github.com/howardabrams/node-mocks-http/issues/79


v 1.4.4
-------

  Bug fix release, including the following:
  * Fixed for [#67][67]
  * Merge fix for [#68][68]
  * Merge fix for [#70][70]
  * Merge fix for [#73][73]

  [67]: https://github.com/howardabrams/node-mocks-http/issues/67
  [68]: https://github.com/howardabrams/node-mocks-http/issues/68
  [70]: https://github.com/howardabrams/node-mocks-http/issues/70
  [73]: https://github.com/howardabrams/node-mocks-http/issues/73

v 1.2.0
---

  * Adds a `.header` and `.get` method to the request.

v 1.1.0
---

  * Adds a `.header`, `.set`, and `.get` method to the response.

v 1.0.4
---

  * Adds the MIT license

v 1.0.3
---

  * Merged changes by [invernizzie](https://github.com/invernizzie):
    to address [#11](https://github.com/howardabrams/node-mocks-http/pull/11)

  * Merged changes by [ericchaves](https://github.com/ericchaves):
    > I extended your library a little but so it could also handle
    > some structured responses. By doing so res.send now evaluate the
    > data passed and search for either a statusCode or httpCode to be
    > used, and also for a body to send as _data.
    >
    > It still working as expected (at least tests passed) for regular
    > HTTP responses.
    >
    > Although I did it with node-restify in mind, it should work well
    > for all other libs.

v 1.0.2
---

  * Adds a `.json()` method to the response. (Thanks, diachedelic)
  * Cleaned up all source files so ./run-tests passes.
  * Cleaned up jshint issues.

v 1.0.1
---

  * Adds support for response redirect and render

v 0.0.9
---

  * Adds support for response cookies

v 0.0.8
---

  * Adds support for request headers
  * Fix wrong function name of set cookies

v 0.0.7
---

  * Adds support for request cookies

v 0.0.6
---

  * Adds support for request files

v 0.0.5
---

  * Fixed a bug where `response.send()` can take two parameters, the status code and the data to send.

v 0.0.4
---

  * Adds a `request.session` that can be set during construction (or via calling the `_setSessionVariable()` method, and read as an object.

v 0.0.3
---

  * Adds a `request.query` that can be set during construction and read as an object.

v 0.0.2
---

  * Code refactoring of the `Response` mock.

v 0.0.1
---

  * Initial code banged out one late night...
