# Migration Guide

The following instructions should help in migrating to a new major version of
passport-jwt.

## Migrating from 3.x.x to 4.x.x

Version 4.0.0 was released to update [jsonwebtoken's](https://github.com/auth0/node-jsonwebtoken)
major version from v7 to v8 in order to fix a security issue (see
[#147](https://github.com/themikenicholson/passport-jwt/issues/147)).

Users of `passport-jwt` are exposed to the API of `jsonwebtoken` through the `jsonWebTokenOptions`
constructor option.  Therefore, a major version rev of `jsonwebtoken` triggered a major version rev
of `passport-jwt`.

See the
[jsonwebtoken v7-v8 Migration Notes](https://github.com/auth0/node-jsonwebtoken/wiki/Migration-Notes:-v7-to-v8)
for the full details. The change in units for the `maxAge` attribute of `jsonWebTokenOptions` is
likely to impact the greatest number of `passport-jwt` users.

## Migrating from 2.x.x to 3.x.x

Version 3.0.0 removes the `ExtractJwt.fromAuthHeader()` extractor function that would extract
JWT's from `Authorization` headers with the auth scheme 'jwt'. The default authorization scheme
of 'jwt' as the was not RFC 6750 compliant.  The extractor was replaced with 
`ExtractJwt.fromAuthHeaderAsBearerToken()`.  The removal of `ExtractJwt.fromAuthHeader()` was done
to clearly change the API so any code relying on the old API would clearly break, hopefully saving
people some debugging time.

If you want to maintain the behavior of `ExtractJwt.fromAuthHeader()` when switching to v3.3.0, simply 
replace it with `ExtractJwt.fromAuthHeaderWithScheme('jwt')` in your implementation.

## Migrating from version 1.x.x to 2.x.x

The v2 API is not backwards compatible with v1, specifically with regards to the introduction
of the concept of JWT extractor functions.  If you require the legacy behavior in v1 you can use
the extractor function ```versionOneCompatibility(options)```

*options* is an object with any of the three custom JWT extraction options present in the v1
constructor:
* `tokenBodyField`: Field in a request body to search for the JWT.
  Default is auth_token.
* `tokenQueryParameterName`: Query parameter name containing the token.
  Default is auth_token.
* `authScheme`: Expected authorization scheme if token is submitted through
  the HTTP Authorization header. Defaults to JWT 
If in v1 you constructed the strategy like this:

```js
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {}
opts.tokenBodyField = 'MY_CUSTOM_BODY_FIELD';
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, verifyFunction));
```

Identical behavior can be achieved under v2 with the versionOneCompatibility extractor:

```js
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.versionOneCompatibility({ tokenBodyField = 'MY_CUSTOM_BODY_FIELD' });
opts.opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, verifyFunction));
```
