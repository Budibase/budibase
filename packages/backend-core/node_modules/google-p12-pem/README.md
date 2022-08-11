# google-p12-pem

Convert Google `.p12` keys to `.pem` keys.

[![Build Status](https://travis-ci.org/ryanseys/google-p12-pem.svg?branch=travis)](https://travis-ci.org/ryanseys/google-p12-pem)

## Installation

``` sh
npm install google-p12-pem
```

## Usage

### Asynchronous

``` js
var gp12 = require('google-p12-pem');
gp12('/path/to/key.p12', function(err, pem) {
  if (err) {
    console.log(err);
  } else {
    console.log(pem); // '-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAK...'
  }
});
```

### Synchronous

Note: If an error occurs and the callback is omitted, it will **throw** the error.

``` js
var gp12 = require('google-p12-pem');
var pem = gp12('/path/to/key.p12');
console.log(pem); // '-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAK...'
```

### CLI

``` sh
gp12-pem myfile.p12 > output.pem
```

## License

MIT
