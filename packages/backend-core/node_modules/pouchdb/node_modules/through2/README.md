# through2

[![NPM](https://nodei.co/npm/through2.png?downloads&downloadRank)](https://nodei.co/npm/through2/)

**A tiny wrapper around Node.js streams.Transform (Streams2/3) to avoid explicit subclassing noise**

Inspired by [Dominic Tarr](https://github.com/dominictarr)'s [through](https://github.com/dominictarr/through) in that it's so much easier to make a stream out of a function than it is to set up the prototype chain properly: `through(function (chunk) { ... })`.

***Note: Users of Node.js 0.10 and 0.12 should install `through2@2.x`. As of through2@3.x, readable-stream@3 is being used and is not compatible with older versions of Node.js.*** _v2.x support is being maintained on the [v2.x](https://github.com/rvagg/through2/tree/v2.x) branch._

```js
fs.createReadStream('ex.txt')
  .pipe(through2(function (chunk, enc, callback) {
    for (var i = 0; i < chunk.length; i++)
      if (chunk[i] == 97)
        chunk[i] = 122 // swap 'a' for 'z'

    this.push(chunk)

    callback()
   }))
  .pipe(fs.createWriteStream('out.txt'))
  .on('finish', () => doSomethingSpecial())
```

Or object streams:

```js
var all = []

fs.createReadStream('data.csv')
  .pipe(csv2())
  .pipe(through2.obj(function (chunk, enc, callback) {
    var data = {
        name    : chunk[0]
      , address : chunk[3]
      , phone   : chunk[10]
    }
    this.push(data)

    callback()
  }))
  .on('data', (data) => {
    all.push(data)
  })
  .on('end', () => {
    doSomethingSpecial(all)
  })
```

Note that `through2.obj(fn)` is a convenience wrapper around `through2({ objectMode: true }, fn)`.

## API

<b><code>through2([ options, ] [ transformFunction ] [, flushFunction ])</code></b>

Consult the **[stream.Transform](https://nodejs.org/docs/latest/api/stream.html#stream_class_stream_transform)** documentation for the exact rules of the `transformFunction` (i.e. `this._transform`) and the optional `flushFunction` (i.e. `this._flush`).

### options

The options argument is optional and is passed straight through to `stream.Transform`. So you can use `objectMode:true` if you are processing non-binary streams (or just use `through2.obj()`).

The `options` argument is first, unlike standard convention, because if I'm passing in an anonymous function then I'd prefer for the options argument to not get lost at the end of the call:

```js
fs.createReadStream('/tmp/important.dat')
  .pipe(through2({ objectMode: true, allowHalfOpen: false },
    (chunk, enc, cb) => {
      cb(null, 'wut?') // note we can use the second argument on the callback
                       // to provide data as an alternative to this.push('wut?')
    }
  ))
  .pipe(fs.createWriteStream('/tmp/wut.txt'))
```

### transformFunction

The `transformFunction` must have the following signature: `function (chunk, encoding, callback) {}`. A minimal implementation should call the `callback` function to indicate that the transformation is done, even if that transformation means discarding the chunk.

To queue a new chunk, call `this.push(chunk)`&mdash;this can be called as many times as required before the `callback()` if you have multiple pieces to send on.

Alternatively, you may use `callback(err, chunk)` as shorthand for emitting a single chunk or an error.

If you **do not provide a `transformFunction`** then you will get a simple pass-through stream.

### flushFunction

The optional `flushFunction` is provided as the last argument (2nd or 3rd, depending on whether you've supplied options) is called just prior to the stream ending. Can be used to finish up any processing that may be in progress.

```js
fs.createReadStream('/tmp/important.dat')
  .pipe(through2(
    (chunk, enc, cb) => cb(null, chunk), // transform is a noop
    function (cb) { // flush function
      this.push('tacking on an extra buffer to the end');
      cb();
    }
  ))
  .pipe(fs.createWriteStream('/tmp/wut.txt'));
```

<b><code>through2.ctor([ options, ] transformFunction[, flushFunction ])</code></b>

Instead of returning a `stream.Transform` instance, `through2.ctor()` returns a **constructor** for a custom Transform. This is useful when you want to use the same transform logic in multiple instances.

```js
var FToC = through2.ctor({objectMode: true}, function (record, encoding, callback) {
  if (record.temp != null && record.unit == "F") {
    record.temp = ( ( record.temp - 32 ) * 5 ) / 9
    record.unit = "C"
  }
  this.push(record)
  callback()
})

// Create instances of FToC like so:
var converter = new FToC()
// Or:
var converter = FToC()
// Or specify/override options when you instantiate, if you prefer:
var converter = FToC({objectMode: true})
```

## See Also

  - [through2-map](https://github.com/brycebaril/through2-map) - Array.prototype.map analog for streams.
  - [through2-filter](https://github.com/brycebaril/through2-filter) - Array.prototype.filter analog for streams.
  - [through2-reduce](https://github.com/brycebaril/through2-reduce) - Array.prototype.reduce analog for streams.
  - [through2-spy](https://github.com/brycebaril/through2-spy) - Wrapper for simple stream.PassThrough spies.
  - the [mississippi stream utility collection](https://github.com/maxogden/mississippi) includes `through2` as well as many more useful stream modules similar to this one

## License

**through2** is Copyright (c) Rod Vagg and additional contributors and licensed under the MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
