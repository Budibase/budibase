# sanitize-s3-objectkey
0 dependencies library to sanitize S3 object keys.

## Motivation
You can use any UTF-8 character in an S3 object key name. However, using certain characters in key names may cause problems with some applications and protocols ([source](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html)).
This library applies some conversions on the provided object key to help mitigate these problems.  
In particular:
- spaces at the beginning and end of the string are removed
- spaces inside the string are replaced by a (configurable) separator
- accents from latin characters are removed
- illegal characters are removed

This project is heavily inspired by [s3-filename](https://github.com/hamxabaig/s3-filename).

## Installation
```sh
npm install sanitize-s3-objectkey
```

## Usage
```js
const sanitize = require('sanitize-s3-objectkey');

sanitize('áêīòü'); // aeiou
sanitize('pipes|are|not|valid'); // pipesarenotvalid
sanitize('spaces should be replaced'); // spaces-should-be-replaced
sanitize('spaces should be replaced', '/'); // spaces/should/be/replaced
```

## Contributing
Feedback, bug reports, and pull requests are welcome.

For pull requests, make sure to follow the following guidelines:
* Add tests for each new feature and bug fix.
* Follow the existing code style, enforced by eslint.
* Separate unrelated changes into multiple pull requests.

## License
Apache License 2.0, see [LICENSE](LICENSE.md).
