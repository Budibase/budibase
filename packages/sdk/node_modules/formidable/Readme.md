<p align="center">
  <img alt="npm formidable package logo" src="https://raw.githubusercontent.com/node-formidable/formidable/master/logo.png" />
</p>

# formidable [![npm version][npmv-img]][npmv-url] [![MIT license][license-img]][license-url] [![Libera Manifesto][libera-manifesto-img]][libera-manifesto-url]

> A Node.js module for parsing form data, especially file uploads.

### Important Notes

For more info, check the [CHANGELOG](https://github.com/node-formidable/formidable/blob/master/CHANGELOG.md) on the master branch.

#### v1 is deprecated

All `v1` versions are deprecated in NPM for over 2 years. You can find it at `formidable@v1` or `formidable@legacy` on NPM, and on [v1-legacy branch][v1branch] on GitHub.  
We highly recommend to use `v2` or `v3`. Both are already in use by many, especially `v2` which was on `formidable@canary` for 2 years.

- **Status: Not Maintained!**
- We won't provide support or accept reports on that version.
- **No Backporting:** bugfixes, security fixes, or new features WILL NOT happen!
- Please move to at least **v2**! 
- Try with installing `formidable@v2` and if still have the problem - report!

---

#### v2 is the new `latest`
The `v2` will be simultaneously on two places for some time - `formidable@latest` and `formidable@v2`.
The source code be available **only** on [v2 branch][v2branch].
If you want to use v2, it's recommended to use the v2 dist-tag `formidable@v2`. 

**Main Differences from v1:**
- Better organization and modernized code, requiring newer Node.js versions (>= v10).
- A lot of bugfixes, closed issues, merged or closed PRs.
- **Backward compatible to v1!** Should not have problems, the major version bump is just for ensurance.
- Better docs, new features (plugins, parsers, options) and optimizations.

---

#### v3 - ESModules, Promises, Monorepo structure
We recommend to use `formidable@v3`, as it uses more modern Node.js Streams, has support for Promises and more stuff.
You can see more info and track some ideas on [issue#635](https://github.com/node-formidable/formidable/issues/635).

- The source code can be found on the [master branch](https://github.com/node-formidable/formidable) on GitHub.
- It will be published on `formidable@latest` after some time.
- Dropping older Node.js versions, requiring higher than v12-v14.
- Dropping v1 compatibility.
- Rewritten to ESModules, more optimizations.
- Moving to monorepo structure, more plugins & helper utils.

[v1branch]: https://github.com/node-formidable/formidable/tree/v1-legacy
[v2branch]: https://github.com/node-formidable/formidable/tree/v2
[v3branch]: https://github.com/node-formidable/formidable/tree/v3

---

[![Code style][codestyle-img]][codestyle-url]
[![codecoverage][codecov-img]][codecov-url]
[![linux build status][linux-build-img]][build-url]
[![windows build status][windows-build-img]][build-url]
[![macos build status][macos-build-img]][build-url]

If you have any _how-to_ kind of questions, please read the [Contributing
Guide][contributing-url] and [Code of Conduct][code_of_conduct-url]
documents.<br /> For bugs reports and feature requests, [please create an
issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore)
at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![Minimum Required Nodejs][nodejs-img]][npmv-url]
[![Tidelift Subcsription][tidelift-img]][tidelift-url]
[![Buy me a Kofi][kofi-img]][kofi-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]

This project is [semantically versioned](https://semver.org) and available as
part of the [Tidelift Subscription][tidelift-url] for professional grade
assurances, enhanced support and security.
[Learn more.](https://tidelift.com/subscription/pkg/npm-formidable?utm_source=npm-formidable&utm_medium=referral&utm_campaign=enterprise)

_The maintainers of `formidable` and thousands of other packages are working
with Tidelift to deliver commercial support and maintenance for the Open Source
dependencies you use to build your applications. Save time, reduce risk, and
improve code health, while paying the maintainers of the exact dependencies you
use._

[![][npm-weekly-img]][npmv-url] [![][npm-monthly-img]][npmv-url]
[![][npm-yearly-img]][npmv-url] [![][npm-alltime-img]][npmv-url]

## v1 status: not maintained!

## Project Status: Maintained

This module was initially developed by
[**@felixge**](https://github.com/felixge) for
[Transloadit](http://transloadit.com/), a service focused on uploading and
encoding images and videos. It has been battle-tested against hundreds of GBs of
file uploads from a large variety of clients and is considered production-ready
and is used in production for years.

Currently, we are few maintainers trying to deal with it. :) More contributors
are always welcome! :heart: Jump on
[issue #412](https://github.com/felixge/node-formidable/issues/412) which is
closed, but if you are interested we can discuss it and add you after strict
rules, like enabling Two-Factor Auth in your npm and GitHub accounts.

## Features

* Fast (~500mb/sec), non-buffering multipart parser
* Automatically writing file uploads to disk
* Low memory footprint
* Graceful error handling
* Very high test coverage

## Installation

```sh
npm install formidable@v1
npm install formidable@v2
npm install formidable@v3
```

This is a low-level package, and if you're using a high-level framework it may already be included. However, [Express v4](http://expressjs.com) does not include any multipart handling, nor does [body-parser](https://github.com/expressjs/body-parser).

Note: Formidable requires [gently](http://github.com/felixge/node-gently) to run the unit tests, but you won't need it for just using the library.

## Example

Parse an incoming file upload.
```javascript
var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8080);
```
## API

### Formidable.IncomingForm
```javascript
var form = new formidable.IncomingForm()
```
Creates a new incoming form.

```javascript
form.encoding = 'utf-8';
```
Sets encoding for incoming form fields.

```javascript
form.uploadDir = "/my/dir";
```
Sets the directory for placing file uploads in. You can move them later on using
`fs.rename()`. The default is `os.tmpdir()`.

```javascript
form.keepExtensions = false;
```
If you want the files written to `form.uploadDir` to include the extensions of the original files, set this property to `true`.

```javascript
form.type
```
Either 'multipart' or 'urlencoded' depending on the incoming request.

```javascript
form.maxFieldsSize = 20 * 1024 * 1024;
```
Limits the amount of memory all fields together (except files) can allocate in bytes.
If this value is exceeded, an `'error'` event is emitted. The default
size is 20MB.

```javascript
form.maxFileSize = 200 * 1024 * 1024;
```
Limits the size of uploaded file.
If this value is exceeded, an `'error'` event is emitted. The default
size is 200MB.

```javascript
form.maxFields = 1000;
```
Limits the number of fields that the querystring parser will decode. Defaults
to 1000 (0 for unlimited).

```javascript
form.hash = false;
```
If you want checksums calculated for incoming files, set this to either `'sha1'` or `'md5'`.

```javascript
form.multiples = false;
```
If this option is enabled, when you call `form.parse`, the `files` argument will contain arrays of files for inputs which submit multiple files using the HTML5 `multiple` attribute.

```javascript
form.bytesReceived
```
The amount of bytes received for this form so far.

```javascript
form.bytesExpected
```
The expected number of bytes in this form.

```javascript
form.parse(request, [cb]);
```
Parses an incoming node.js `request` containing form data. If `cb` is provided, all fields and files are collected and passed to the callback:


```javascript
form.parse(req, function(err, fields, files) {
  // ...
});

form.onPart(part);
```
You may overwrite this method if you are interested in directly accessing the multipart stream. Doing so will disable any `'field'` / `'file'` events  processing which would occur otherwise, making you fully responsible for handling the processing.

```javascript
form.onPart = function(part) {
  part.addListener('data', function() {
    // ...
  });
}
```
If you want to use formidable to only handle certain parts for you, you can do so:
```javascript
form.onPart = function(part) {
  if (!part.filename) {
    // let formidable handle all non-file parts
    form.handlePart(part);
  }
}
```
Check the code in this method for further inspiration.


### Formidable.File
```javascript
file.size = 0
```
The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'` event), this property says how many bytes of the file have been written to disk yet.
```javascript
file.path = null
```
The path this file is being written to. You can modify this in the `'fileBegin'` event in
case you are unhappy with the way formidable generates a temporary path for your files.
```javascript
file.name = null
```
The name this file had according to the uploading client.
```javascript
file.type = null
```
The mime type of this file, according to the uploading client.
```javascript
file.lastModifiedDate = null
```
A date object (or `null`) containing the time this file was last written to. Mostly
here for compatibility with the [W3C File API Draft](http://dev.w3.org/2006/webapi/FileAPI/).
```javascript
file.hash = null
```
If hash calculation was set, you can read the hex digest out of this var.

#### Formidable.File#toJSON()

  This method returns a JSON-representation of the file, allowing you to
  `JSON.stringify()` the file which is useful for logging and responding
  to requests.

### Events


#### 'progress'

Emitted after each incoming chunk of data that has been parsed. Can be used to roll your own progress bar.

```javascript
form.on('progress', function(bytesReceived, bytesExpected) {
});
```



#### 'field'

Emitted whenever a field / value pair has been received.

```javascript
form.on('field', function(name, value) {
});
```

#### 'fileBegin'

Emitted whenever a new file is detected in the upload stream. Use this event if
you want to stream the file to somewhere else while buffering the upload on
the file system.

```javascript
form.on('fileBegin', function(name, file) {
});
```

#### 'file'

Emitted whenever a field / file pair has been received. `file` is an instance of `File`.

```javascript
form.on('file', function(name, file) {
});
```

#### 'error'

Emitted when there is an error processing the incoming form. A request that experiences an error is automatically paused, you will have to manually call `request.resume()` if you want the request to continue firing `'data'` events.

```javascript
form.on('error', function(err) {
});
```

#### 'aborted'


Emitted when the request was aborted by the user. Right now this can be due to a 'timeout' or 'close' event on the socket. After this event is emitted, an `error` event will follow. In the future there will be a separate 'timeout' event (needs a change in the node core).
```javascript
form.on('aborted', function() {
});
```

##### 'end'
```javascript
form.on('end', function() {
});
```
Emitted when the entire request has been received, and all contained files have finished flushing to disk. This is a great place for you to send your response.



## Changelog

[./CHANGELOG.md](./CHANGELOG.md)

## Credits

- [multipart-parser](http://github.com/FooBarWidget/multipart-parser): a C++
  parser based on formidable
- [Ryan Dahl](http://twitter.com/ryah) for his work on
  [http-parser](http://github.com/ry/http-parser) which heavily inspired the
  initial `multipart_parser.js`.

From [Felix blog post](https://felixge.de/2013/03/11/the-pull-request-hack/):

- [Sven Lito](https://github.com/svnlto) for fixing bugs and merging patches
- [egirshov](https://github.com/egirshov) for contributing many improvements to the node-formidable multipart parser
- [Andrew Kelley](https://github.com/superjoe30) for also helping with fixing bugs and making improvements
- [Mike Frey](https://github.com/mikefrey) for contributing JSON support


## Contributing

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction. If you would like to help us fix
a bug or add a new feature, please check our [Contributing
Guide][contributing-url]. Pull requests are welcome!


## License

Formidable is licensed under the [MIT License][license-url].

<!-- badges -->
<!-- prettier-ignore-start -->

[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb%20%2B%20prettier/ff5a5f?icon=airbnb&cache=300
[codecov-url]: https://codecov.io/gh/node-formidable/formidable
[codecov-img]: https://badgen.net/codecov/c/github/node-formidable/formidable/master?icon=codecov
[npmv-canary-img]: https://badgen.net/npm/v/formidable/canary?icon=npm
[npmv-dev-img]: https://badgen.net/npm/v/formidable/dev?icon=npm
[npmv-img]: https://badgen.net/npm/v/formidable?icon=npm
[npmv-url]: https://npmjs.com/package/formidable
[license-img]: https://badgen.net/npm/license/formidable
[license-url]: https://github.com/node-formidable/formidable/blob/master/LICENSE
[chat-img]: https://badgen.net/badge/chat/on%20gitter/46BC99?icon=gitter
[chat-url]: https://gitter.im/node-formidable/Lobby
[libera-manifesto-url]: https://liberamanifesto.com
[libera-manifesto-img]: https://badgen.net/badge/libera/manifesto/grey
[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green?cache=300
[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green?cache=300
[prs-welcome-url]: http://makeapullrequest.com
[twitter-url]: https://twitter.com/tunnckoCore
[twitter-img]: https://badgen.net/twitter/follow/tunnckoCore?icon=twitter&color=1da1f2&cache=300

[npm-weekly-img]: https://badgen.net/npm/dw/formidable?icon=npm&cache=300
[npm-monthly-img]: https://badgen.net/npm/dm/formidable?icon=npm&cache=300
[npm-yearly-img]: https://badgen.net/npm/dy/formidable?icon=npm&cache=300
[npm-alltime-img]: https://badgen.net/npm/dt/formidable?icon=npm&cache=300&label=total%20downloads

[nodejs-img]: https://badgen.net/badge/node/>=%2010.13/green?cache=300

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/green?cache=300

[contributing-url]: https://github.com/node-formidable/.github/blob/master/CONTRIBUTING.md
[code_of_conduct-url]: https://github.com/node-formidable/.github/blob/master/CODE_OF_CONDUCT.md

[open-issue-url]: https://github.com/node-formidable/formidable/issues/new

[tidelift-url]: https://tidelift.com/subscription/pkg/npm-formidable?utm_source=npm-formidable&utm_medium=referral&utm_campaign=enterprise
[tidelift-img]: https://badgen.net/badge/tidelift/subscription/4B5168?labelColor=F6914D

[kofi-url]: https://ko-fi.com/tunnckoCore/commissions
[kofi-img]: https://badgen.net/badge/ko-fi/support/29abe0c2?cache=300&icon=https://rawcdn.githack.com/tunnckoCore/badgen-icons/f8264c6414e0bec449dd86f2241d50a9b89a1203/icons/kofi.svg

[linux-build-img]: https://badgen.net/github/checks/node-formidable/formidable/master/ubuntu?cache=300&label=linux%20build&icon=github
[macos-build-img]: https://badgen.net/github/checks/node-formidable/formidable/master/macos?cache=300&label=macos%20build&icon=github
[windows-build-img]: https://badgen.net//github/checks/node-formidable/formidable/master/windows?cache=300&label=windows%20build&icon=github
[build-url]: https://github.com/node-formidable/formidable/actions?query=workflow%3Anodejs
<!-- prettier-ignore-end -->

