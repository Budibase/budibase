[![node-mocks-http logo][nmh-logo]][nmh-url]
---
[![NPM version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Gitter chat][gitter-badge]][gitter-url]


Mock 'http' objects for testing [Express][express-url] and [Koa][koa-url]
routing functions, but could be used for testing any
[Node.js][node-url] web server applications that have
code that requires mockups of the `request` and `response` objects.

## Installation

This project is available as a
[NPM package][npm-url].

```bash
$ npm install --save-dev node-mocks-http
```

> Our example includes `--save-dev` based on the assumption that **node-mocks-http** will be used as a development dependency..

After installing the package include the following in your test files:

```js
var httpMocks = require('node-mocks-http');
```

## Usage

Suppose you have the following Express route:

```js
app.get('/user/:id', routeHandler);
```

And you have created a function to handle that route's call:

```js
var routeHandler = function( request, response ) { ... };
```

You can easily test the `routeHandler` function with some code like
this using the testing framework of your choice:

```js
exports['routeHandler - Simple testing'] = function(test) {

    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/user/42',
        params: {
          id: 42
        }
    });

    var response = httpMocks.createResponse();

    routeHandler(request, response);

    var data = response._getJSONData(); // short-hand for JSON.parse( response._getData() );
    test.equal("Bob Dog", data.name);
    test.equal(42, data.age);
    test.equal("bob@dog.com", data.email);

    test.equal(200, response.statusCode );
    test.ok( response._isEndCalled());
    test.ok( response._isJSON());
    test.ok( response._isUTF8());

    test.done();

};
```

## API
### .createRequest()

```
httpMocks.createRequest(options)
```

Where options is an object hash with any of the following values:

option | description | default value
------ | ----------- | -------------
`method`| request HTTP method | 'GET'
`url` | request URL | ''
`originalUrl` | request original URL | `url`
`baseUrl` | request base URL | `url`
`path` | request path | ''
`params` | object hash with params | {}
`session` | object hash with session values | `undefined`
`cookies` | object hash with request cookies | {}
`socket` | object hash with request socket | {}
`signedCookies` | object hash with signed cookies | `undefined`
`headers` | object hash with request headers | {}
`body` | object hash with body | {}
`query` | object hash with query values | {}
`files` | object hash with values | {}

The object returned from this function also supports the [Express request](http://expressjs.com/en/4x/api.html#req) functions ([`.accepts()`](http://expressjs.com/en/4x/api.html#req.accepts), [`.is()`](http://expressjs.com/en/4x/api.html#req.is), [`.get()`](http://expressjs.com/en/4x/api.html#req.get), [`.range()`](http://expressjs.com/en/4x/api.html#req.range), etc.). Please send a PR for any missing functions.

### .createResponse()

```js
httpMocks.createResponse(options)
```

Where options is an object hash with any of the following values:

option | description | default value
------ | ----------- | -------------
`locals` | object that contains `response` local variables | `{}`
`eventEmitter` | event emitter used by `response` object | `mockEventEmitter`
`writableStream`  | writable stream used by `response` object | `mockWritableStream`
`req` | Request object being responded to | null

> NOTE: The out-of-the-box mock event emitter included with `node-mocks-http` is
not a functional event emitter and as such does not actually emit events. If you
wish to test your event handlers you will need to bring your own event emitter.

> Here's an example:

```js
var httpMocks = require('node-mocks-http');
var res = httpMocks.createResponse({
  eventEmitter: require('events').EventEmitter
});

// ...
  it('should do something', function(done) {
    res.on('end', function() {
      assert.equal(...);
      done();
    });
  });
// ...
```

> This is an example to send request body and trigger it's 'data' and 'end' events:

```js
var httpMocks = require('node-mocks-http');
var req = httpMocks.createRequest();
var res = httpMocks.createResponse({
  eventEmitter: require('events').EventEmitter
});

// ...
  it('should do something', function(done) {
    res.on('end', function() {
      expect(response._getData()).to.equal('data sent in request');
      done();
    });

    route(req,res);

    req.send('data sent in request');
  });

  function route(req,res){
    var data= [];
    req.on("data", chunk => {
        data.push(chunk)
    });
    req.on("end", () => {
        data = Buffer.concat(data)
        res.write(data);
        res.end();
    });
    
}
// ...
```

### .createMocks()

```js
httpMocks.createMocks(reqOptions, resOptions)
```

Merges `createRequest` and `createResponse`. Passes given options object to each
constructor. Returns an object with properties `req` and `res`.

## Design Decisions

We wanted some simple mocks without a large framework.

We also wanted the mocks to act like the original framework being
mocked, but allow for setting of values before calling and inspecting
of values after calling.

## For Developers

We are looking for more volunteers to bring value to this project,
including the creation of more objects from the
[HTTP module][node-http-module-url].

This project doesn't address all features that must be
mocked, but it is a good start. Feel free to send pull requests,
and a member of the team will be timely in merging them.

If you wish to contribute please read our [Contributing Guidelines](CONTRIBUTING.md).


## Release Notes

Most releases fix bugs with our mocks or add features similar to the
actual `Request` and `Response` objects offered by Node.js and extended
by Express.

See the [Release History](HISTORY.md) for details.

[release-notes]: https://github.com/howardabrams/node-mocks-http/releases
[release-v1.4.4]: https://github.com/howardabrams/node-mocks-http/releases/tag/v1.4.4

License
---

Licensed under [MIT](https://github.com/howardabrams/node-mocks-http/blob/master/LICENSE).

[nmh-logo]: https://raw.githubusercontent.com/wiki/howardabrams/node-mocks-http/images/nmh-logo-200x132.png
[nmh-url]: https://github.com/howardabrams/node-mocks-http

[npm-badge]: https://badge.fury.io/js/node-mocks-http.png
[npm-url]: https://www.npmjs.com/package/node-mocks-http

[travis-badge]: https://travis-ci.org/howardabrams/node-mocks-http.svg?branch=master
[travis-url]: https://travis-ci.org/howardabrams/node-mocks-http

[gitter-badge]: https://badges.gitter.im/howardabrams/node-mocks-http.png
[gitter-url]: https://gitter.im/howardabrams/node-mocks-http

[express-url]: http://expressjs.com/
[koa-url]: https://koajs.com/
[node-url]: http://www.nodejs.org
[node-http-module-url]: http://nodejs.org/docs/latest/api/http.html
