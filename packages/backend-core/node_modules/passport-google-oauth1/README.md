**DEPRECATED:** On April 20, 2015, Google's support for OAuth 1.0 was officially
deprecated and is no longer supported.  You are encouraged to migrate to OAuth
2.0 and [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2)
as soon as possible.


# passport-google-oauth1

[![Build](https://img.shields.io/travis/jaredhanson/passport-google-oauth1.svg)](https://travis-ci.org/jaredhanson/passport-google-oauth1)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-google-oauth1.svg)](https://coveralls.io/r/jaredhanson/passport-google-oauth1)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-google-oauth1.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-google-oauth1)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-google-oauth1.svg)](https://david-dm.org/jaredhanson/passport-google-oauth1)


[Passport](http://passportjs.org/) strategy for authenticating with [Google](http://www.google.com/)
using the OAuth 1.0a API.

This module lets you authenticate using Google in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-google-oauth1

## Usage

#### Create an Application

Before using `passport-google-oauth1`, you must register your domain with Google.
If you have not already done so, a new domain can be added at [Google Accounts](https://accounts.google.com/ManageDomains).
Your domain will be issued an OAuth Consumer Key and OAuth Consumer Secret,
which need to be provided to the strategy.

#### Configure Strategy

The Google authentication strategy authenticates users using a Google account
and OAuth tokens.  The consumer key and consumer secret obtained when
registering a domain are supplied as options when creating the strategy.  The
strategy also requires a `verify` callback, which receives the access token and
corresponding secret as arguments, as well as `profile` which contains the
authenticated user's Google profile.   The `verify` callback must call `cb`
providing a user to complete authentication.

    passport.use(new GoogleStrategy({
        consumerKey: 'www.example.com',
        consumerSecret: GOOGLE_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/google/callback"
      },
      function(token, tokenSecret, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'google'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/google',
      passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));
    
    app.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-twitter-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Twitter.  However, because both Twitter and Google
use OAuth 1.0, the code is similar.  Simply replace references to Twitter with
corresponding references to Google.

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage.  Patches that
increse test coverage are happily accepted.  Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
