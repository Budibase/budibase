# Passport-Google-Auth
[![npm](https://img.shields.io/npm/v/passport-google-auth.svg)](https://www.npmjs.com/package/passport-google-auth)
[![Downloads](https://img.shields.io/npm/dm/passport-google-auth.svg)](https://www.npmjs.com/package/passport-google-auth)
[![Build Status](https://travis-ci.org/RiptideCloud/passport-google-auth.svg?branch=master)](https://travis-ci.org/RiptideCloud/passport-google-auth)
[![Coverage Status](https://img.shields.io/coveralls/RiptideCloud/passport-google-auth.svg?branch=master)](https://coveralls.io/r/RiptideCloud/passport-google-auth)
[![Codacy](https://www.codacy.com/project/badge/d30a71223ecc45878ccfd94e04276414)](https://www.codacy.com/public/davidtpate/passport-google-auth)
[![Code Climate](https://codeclimate.com/github/RiptideCloud/passport-google-auth/badges/gpa.svg)](https://codeclimate.com/github/RiptideCloud/passport-google-auth)
[![David](https://img.shields.io/david/RiptideCloud/passport-google-auth.svg)](https://david-dm.org/RiptideCloud/passport-google-auth)
[![David](https://img.shields.io/david/dev/RiptideCloud/passport-google-auth.svg)](https://david-dm.org/RiptideCloud/passport-google-auth)
[![David](https://img.shields.io/david/peer/RiptideCloud/passport-google-auth.svg)](https://david-dm.org/RiptideCloud/passport-google-auth)

[Passport](http://passportjs.org/) strategies for authenticating with [Google](http://www.google.com/)
using OAuth 2.0.

**Lead Maintainer**: [David Pate](https://github.com/DavidTPate)

This module lets you authenticate using Google in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install
```bash
npm install passport-google-auth
```

## Usage

### Configure Strategy

The Google authentication strategy authenticates users using a Google
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```js
var passport = require('passport'),
    GoogleStrategy = require('passport-google-auth').Strategy;

passport.use(new GoogleOAuth2Strategy({
    clientId: '123-456-789',
    clientSecret: 'shhh-its-a-secret',
    callbackURL: 'https://www.example.com/auth/example/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function (err, user) {
      done(err, user);
    });
  }
));
```

If the `passReqToCallback` options is passed and it is true, then the `verify` callback signature
will look like the following instead.

```js
var passport = require('passport'),
    GoogleStrategy = require('passport-google-auth').Strategy;

passport.use(new GoogleOAuth2Strategy({
    clientId: '123-456-789',
    clientSecret: 'shhh-its-a-secret',
    callbackURL: 'https://www.example.com/auth/example/callback'
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function (err, user) {
      done(err, user);
    });
  }
));
```

#### Options
The `Strategy` can be configured with the following options.

* `clientId`          `String` identifies the client to the service provider **Required**
* `clientSecret`      `String` secret used to establish ownershup of the client identifier **Required**
* `callbackURL`       `String` URL to which the service provider will redirect the user after obtaining authorization. **Required**
* `accessType`        `String` Type of access to be requested from the service provider. Can be `online` (default) or `offline` (gets refresh_token) _Optional_
* `scope`             `String` or `Array` representing the permission scopes to request access to. (default: `https://www.googleapis.com/auth/userinfo.email`) _Optional_
* `skipUserProfile`   `Boolean` If set to false, profile information will be retrieved from Google+. (default: `true`) _Optional_
* `passReqToCallback` `Boolean` When `true`, `req` is the first argument to the verify callback (default: `false`)

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'google'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
var express = require('express'),
    app = express();

app.get('/login', passport.authenticate('google'));

app.get('/auth/callback/google', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect to your app.
        res.redirect('/');
    }
);
```

## Testing
This repository uses [Mocha](http://mochajs.org/) as its test runner. Tests can be run by executing the following command:

```bash
npm test
```

This will run all tests and report on their success/failure in the console, additionally it will include our [Code Coverage](#code-coverage).

## Code Coverage
This repository uses [Istanbul](http://gotwarlost.github.io/istanbul/) as its code coverage tool. Code Coverage will be calculated when executing the following command:

```bash
npm test
```

This will report the Code Coverage to the console similar to the following:

```bash
=============================== Coverage summary ===============================
Statements   : 78.07% ( 356/456 )
Branches     : 50.23% ( 107/213 )
Functions    : 74.77% ( 83/111 )
Lines        : 78.07% ( 356/456 )
================================================================================
```

Additionally, an interactive HTML report will be generated in `./coverage/lcov-report/index.html` which allows browsing the coverage by file.

## Code Style
This repository uses [JSHint](https://github.com/jshint/jshint) for static analysis, [JavaScript Code Style](https://github.com/jscs-dev/node-jscs)
for validating code style, [JSInspect](https://github.com/danielstjules/jsinspect) to detect code duplication, [Buddy.js](https://github.com/danielstjules/buddy.js)
to detect the use of [Magic Numbers](http://en.wikipedia.org/wiki/Magic_number_(programming)), and
[Node Security Project](https://github.com/nodesecurity/nsp) for detecting potential security threats with our dependencies. Code inspections are run as part of
standard testing, to re-evaluate them simply run:

```bash
npm test
```

## License

[MIT](LICENSE)

## Copyright
> Copyright (c) 2014 Riptide Software Inc.
