# Passport OAuth 2.0 Refresh

An add-on to the [Passport](http://passportjs.org) authentication library to provide a simple way to refresh your OAuth 2.0 access tokens.

[![Build Status](https://github.com/fiznool/passport-oauth2-refresh/workflows/Node.js%20CI/badge.svg)](https://github.com/fiznool/passport-oauth2-refresh/workflows/Node.js%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/passport-oauth2-refresh)](https://img.shields.io/npm/v/passport-oauth2-refresh)
[![npm downloads per week](https://img.shields.io/npm/dw/passport-oauth2-refresh?color=blue)](https://img.shields.io/npm/dw/passport-oauth2-refresh?color=blue)
[![Dependency Status](https://david-dm.org/fiznool/passport-oauth2-refresh.svg)](https://david-dm.org/fiznool/passport-oauth2-refresh)
[![devDependency Status](https://david-dm.org/fiznool/passport-oauth2-refresh/dev-status.svg)](https://david-dm.org/fiznool/passport-oauth2-refresh#info=devDependencies)

## Installation

```
npm install passport-oauth2-refresh
```

## Usage

When setting up your passport strategies, add a call to `refresh.use()` after `passport.use()`.

An example, using the Facebook strategy:

```js
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const FacebookStrategy = require('passport-facebook').Strategy;

const strategy = new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://www.example.com/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  // Make sure you store the refreshToken somewhere!
  User.findOrCreate(..., function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});

passport.use(strategy);
refresh.use(strategy);
```

When you need to refresh the access token, call `requestNewAccessToken()`:

```js
const refresh = require('passport-oauth2-refresh');
refresh.requestNewAccessToken(
  'facebook',
  'some_refresh_token',
  function (err, accessToken, refreshToken) {
    // You have a new access token, store it in the user object,
    // or use it to make a new request.
    // `refreshToken` may or may not exist, depending on the strategy you are using.
    // You probably don't need it anyway, as according to the OAuth 2.0 spec,
    // it should be the same as the initial refresh token.
  },
);
```

### Specific name

Instead of using the default `strategy.name`, you can setup `passport-oauth2-refresh` to use an specific name instead.

```js
// Setup
passport.use('gmail', googleStrategy);

// To refresh
refresh.requestNewAccessToken('gmail', 'some_refresh_token', done);
```

This can be useful if you'd like to reuse strategy objects but under a different name.

### Custom OAuth2 behaviour

Most passport strategies that use OAuth 2.0 should work without any additional configuration. Some strategies, however require custom OAuth configuration, or do not expose an oauth2 adapter for internal use. In these cases, a callback can be specified by calling the `use` function with an extra `options` parameter:

```js
const { OAuth2 } = require('oauth');

refresh.use(strategy, {
  setRefreshOAuth2() {
    return new OAuth2(/* custom oauth config */);
  },
});
```

The `setRefreshOAuth2` callback should return an instance of [the node-oauth OAuth2 class](https://github.com/ciaranj/node-oauth#oauth20).

The callback is called with two named parameters, which can be used to further customise the OAuth2 adapter:

```js
refresh.use(strategy, {
  setRefreshOAuth2({ strategyOAuth2, refreshOAuth2 }) {
    // These named parameters are set for most strategies.
    // The `refreshOAuth2` instance is a clone of the one supplied by the strategy, inheriting most of its config.
    // Customise it here and return if necessary.
    // For example, to set a proxy:
    refreshOAuth2.setAgent(new HttpsProxyAgent(agentUrl));
    return refreshOAuth2;
  },
});
```

### Additional parameters

Some endpoints require additional parameters to be sent when requesting a new access token. To send these parameters, specify the parameters when calling `requestNewAccessToken` as follows:

```js
const extraParams = { some: 'extra_param' };
refresh.requestNewAccessToken('gmail', 'some_refresh_token', extraParams, done);
```

## Examples

- See [issue #1](https://github.com/fiznool/passport-oauth2-refresh/issues/1) for an example of how to refresh a token when requesting data from the Google APIs.

## Why?

Passport is a library which doesn't deal in implementation-specific details. From the author:

> Passport is a library for authenticating requests, and only that. It is not going to get involved in anything that is specific to OAuth, or any other authorization protocol.

Fair enough. Hence, this add-on was born as a way to help deal with refreshing OAuth 2.0 tokens.

It is particularly useful when dealing with Google's OAuth 2.0 implementation, which expires access tokens after 1 hour.

## License

MIT
