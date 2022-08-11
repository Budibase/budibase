# passport-local

[![Build](https://travis-ci.org/jaredhanson/passport-local.png)](https://travis-ci.org/jaredhanson/passport-local)
[![Coverage](https://coveralls.io/repos/jaredhanson/passport-local/badge.png)](https://coveralls.io/r/jaredhanson/passport-local)
[![Quality](https://codeclimate.com/github/jaredhanson/passport-local.png)](https://codeclimate.com/github/jaredhanson/passport-local)
[![Dependencies](https://david-dm.org/jaredhanson/passport-local.png)](https://david-dm.org/jaredhanson/passport-local)
[![Tips](http://img.shields.io/gittip/jaredhanson.png)](https://www.gittip.com/jaredhanson/)


[Passport](http://passportjs.org/) strategy for authenticating with a username
and password.

This module lets you authenticate using a username and password in your Node.js
applications.  By plugging into Passport, local authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-local

## Usage

#### Configure Strategy

The local authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(password)) { return done(null, false); }
          return done(null, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'local'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/login', 
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

## Examples

For complete, working examples, refer to the multiple [examples](https://github.com/jaredhanson/passport-local/tree/master/examples) included.

## Tests

    $ npm install
    $ npm test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2014 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
