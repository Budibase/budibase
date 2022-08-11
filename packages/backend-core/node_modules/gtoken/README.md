# node-gtoken

Node.js Google Authentication Service Account Tokens

[![Build Status](https://travis-ci.org/google/node-gtoken.svg?branch=master)](https://travis-ci.org/google/node-gtoken)
[![dependencies Status](https://david-dm.org/google/node-gtoken/status.svg)](https://david-dm.org/google/node-gtoken)
[![Known Vulnerabilities](https://snyk.io/test/npm/google-p12-pem/badge.svg)](https://snyk.io/test/npm/google-p12-pem)

## Installation

``` sh
npm install gtoken
```

## Usage

### Use with a `.pem` or `.p12` key file:

``` js
var GoogleToken = require('gtoken');
var gtoken = GoogleToken({
  keyFile: 'path/to/key.pem', // or path to .p12 key file
  email: 'my_service_account_email@developer.gserviceaccount.com',
  scope: ['https://scope1', 'https://scope2'] // or space-delimited string of scopes
});

gtoken.getToken(function(err, token) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(token);
});
```

### Use with a service account `.json` key file:

``` js
var GoogleToken = require('gtoken');
var gtoken = GoogleToken({
  keyFile: 'path/to/key.json',
  scope: ['https://scope1', 'https://scope2'] // or space-delimited string of scopes
});

gtoken.getToken(function(err, token) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(token);
});
```

### Pass the private key as a string directly:

``` js
var key = '-----BEGIN RSA PRIVATE KEY-----\nXXXXXXXXXXX...';
var GoogleToken = require('gtoken');
var gtoken = GoogleToken({
  email: 'my_service_account_email@developer.gserviceaccount.com',
  scope: ['https://scope1', 'https://scope2'], // or space-delimited string of scopes
  key: key
});
```

## Options

> Various options that can be set when creating initializing the `gtoken` object.

- `options.email or options.iss`: The service account email address.
- `options.scope`: An array of scope strings or space-delimited string of scopes.
- `options.sub`: The email address of the user requesting delegated access.
- `options.keyFile`: The filename of `.json` key, `.pem` key or `.p12` key.
- `options.key`: The raw RSA private key value, in place of using `options.keyFile`.

### .getToken(callback)

> Returns the cached token or requests a new one and returns it.

``` js
gtoken.getToken(function(err, token) {
  console.log(err || token);
  // gtoken.token value is also set
});
```

### Properties

> Various properties set on the gtoken object after call to `.getToken()`.

- `gtoken.token`: The access token.
- `gtoken.expires_at`: The expiry date as milliseconds since 1970/01/01
- `gtoken.key`: The raw key value.
- `gtoken.raw_token`: Most recent raw token data received from Google.

### .hasExpired()

> Returns true if the token has expired, or token does not exist.

``` js
gtoken.getToken(function(err, token) {
  if(token) {
    gtoken.hasExpired(); // false
  }
});
```

### .revokeToken()

> Revoke the token if set.

``` js
gtoken.revokeToken(function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Token revoked!');
});
```

## Downloading your private `.p12` key from Google

1. Open the [Google Developer Console][gdevconsole].
2. Open your project and under "APIs & auth", click Credentials.
3. Generate a new `.p12` key and download it into your project.

## Converting your `.p12` key to a `.pem` key

You can just specify your `.p12` file (with `.p12` extension) as the `keyFile` and it will automatically be converted to a `.pem` on the fly, however this results in a slight performance hit. If you'd like to convert to a `.pem` for use later, use OpenSSL if you have it installed.

``` sh
$ openssl pkcs12 -in key.p12 -nodes -nocerts > key.pem
```

Don't forget, the passphrase when converting these files is the string `'notasecret'`

## License

MIT

[gdevconsole]: https://console.developers.google.com
