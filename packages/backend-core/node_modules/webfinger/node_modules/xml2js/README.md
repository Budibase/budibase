node-xml2js
===========

Ever had the urge to parse XML? And wanted to access the data in some sane,
easy way? Don't want to compile a C parser, for whatever reason? Then xml2js is
what you're looking for!

Description
===========

Simple XML to JavaScript object converter. Uses
[sax-js](https://github.com/isaacs/sax-js/).

Note: If you're looking for a full DOM parser, you probably want
[JSDom](https://github.com/tmpvar/jsdom).

Installation
============

Simplest way to install `xml2js` is to use [npm](http://npmjs.org), just `npm
install xml2js` which will download xml2js and all dependencies.

Usage
=====

This will have to do, unless you're looking for some fancy extensive
documentation. If you're looking for every single option and usage, see the
unit tests.

Simple as pie usage
-------------------

The simplest way to use it, is to use the optional callback interface added in
0.1.11. That's right, if you have been using xml-simple or a home-grown
wrapper, this is for you:

```javascript
var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/foo.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log('Done');
    });
});
```

Look ma, no event listeners! Alternatively you can still use the traditional
`addListener` variant:

```javascript
var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
parser.addListener('end', function(result) {
    console.dir(result);
    console.log('Done.');
});
fs.readFile(__dirname + '/foo.xml', function(err, data) {
    parser.parseString(data);
});
```

You can also use xml2js from
[CoffeeScript](http://jashkenas.github.com/coffee-script/), further reducing
the clutter:

```coffeescript
fs = require 'fs',
xml2js = require 'xml2js'

parser = new xml2js.Parser()
fs.readFile __dirname + '/foo.xml', (err, data) ->
  parser.parseString data, (err, result) ->
    console.dir result
    console.log 'Done.'
```

So you wanna some JSON?
-----------------------

Just wrap the `result` object in a call to `JSON.stringify` like this
`JSON.stringify(result)`. You get a string containing the JSON representation
of the parsed object that you can feed to JSON-hungry consumers.

Displaying results
------------------

You might wonder why, using `console.dir` or `console.log` the output at some
level is only `[Object]`. Don't worry, this is not because xml2js got lazy.
That's because Node uses `util.inspect` to convert the object into strings and
that function stops after `depth=2` which is a bit low for most XML.

To display the whole deal, you can use `console.log(util.inspect(result, false,
null))`, which displays the whole result.

So much for that, but what if you use
[eyes](https://github.com/cloudhead/eyes.js) for nice colored output and it
truncates the output with `…`? Don't fear, there's also a solution for that,
you just need to increase the `maxLength` limit by creating a custom inspector
`var inspect = require('eyes').inspector({maxLength: false})` and then you can
easily `inspect(result)`.

Options
=======

Apart from the default settings, there is a number of options that can be
specified for the parser. Options are specified by ``new Parser({optionName:
value})``. Possible options are:

  * `explicitCharkey` (default: `false`)
  * `trim` (default: `true`): Trim the whitespace at the beginning and end of
    text nodes.
  * `normalize` (default: `true`): Trim whitespaces inside text nodes.
  * `explicitRoot` (default: `false`): Set this if you want to get the root
    node in the resulting object.
  * `emptyTag` (default: `undefined`): what will the value of empty nodes be.
    Default is `{}`.
  * `explicitArray` (default: `false`): Always put child nodes in an array if
    true; otherwise an array is created only if there is more than one.
  * `ignoreAttrs` (default: `false`): Ignore all XML attributes and only create
    text nodes.
  * `mergeAttrs` (default: `false`): Merge attributes and child elements as
    properties of the parent, instead of keying attributes off a child
    attribute object. This option is ignored if `ignoreAttrs` is `false`.
  * `validator` (default `null`): You can specify a callable that validates
    the resulting structure somehow, however you want. See unit tests
    for an example.

These default settings are for backward-compatibility (and might change in the
future). For the most 'clean' parsing, you should disable `normalize` and
`trimming` and enable `explicitRoot`.

Running tests, development
==========================

The development requirements are handled by npm, you just need to install
them. We also have a number of unit tests, they can be run using `zap`
directly from the project root.
