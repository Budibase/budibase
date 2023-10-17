# Passport-OpenID Connect

Fork of [Jared Hanson's](http://github.com/jaredhanson) [Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [OpenID Connect](http://openid.net/connect/).

This module lets you authenticate using OpenID Connect in your Node.js
applications.  By plugging into Passport, OpenID Connect authentication can be
easily and unobtrusively integrated into any application or framework that
supports [Connect](http://www.senchalabs.org/connect/)-style middleware,
including [Express](http://expressjs.com/).

## Installation

```bash
npm install @techpass/passport-openidconnect
```

## Usage

### Setup

```javascript
const passport = require("passport");
const OidcStrategy = require("@techpass/passport-openidconnect").Strategy;

passport.use(
  "oidc",
  new OidcStrategy(
    {
      issuer: "https://my-oidc-issuer.com",
      authorizationURL: "https://my-oidc-issuer.com/oauth2/authorize",
      tokenURL: "https://my-oidc-issuer.com/oauth2/token",
      userInfoURL: "https://my-oidc-issuer.com/userinfo",
      clientID: "my-oidc-client-id",
      clientSecret: "my-oidc-client-secret",
      callbackURL: "https://my-client-endpoint.com/auth/callback",
      scope: "openid", // Optional values from OIDC spec: profile, email, address, phone
      pkce: "S256" // Optional. Include to perform Proof Key Code Exchange else ignore. Possible values are "S256" || "plain"
      originalReqProp: "query" // Optional. Extra state from any properties in the original auth request which will be sent back in the callback's request.query.state as a json string. Possible values are default properties in req such as path, params, query or any custom properties you assign into req
    },
    async (
      issuer,
      sub,
      profile,
      jwtClaims,
      accessToken,
      refreshToken,
      idToken,
      params,
      done
    ) => {
      User.findOrCreate(
        { exampleId: profile.id },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);
```

### Options

If authorizationURL and tokenURL are undefined, dynamic OIDC metadata discovery will be attempted using the `.well-known/openid-configuration` endpoint.

### Express

```javascript
app.get('/auth/login', passport.authenticate('oidc'));

app.get("/auth/callback", (req, res, next) => {
  passport.authenticate("oidc", (err, user) => {
    if (err || !user) { 
      return res.redirect("/error-callback"); // Or other error handling
    }
    // Create the express session, calls serializeUser
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/success-callback");
    });
  })(req, res, next);
}
  ```

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/passport-openidconnect'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/passport-openidconnect.svg' /></a>
