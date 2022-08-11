# end-stream

A stream that ends after computation finishes

## Example

When you end this writable stream it will only emit `"finish"`
    after it's finished asynchronously writing each chunk
    you've written to the stream

```js
var stream = EndStream(function write(value, cb) {
    // do something async
    async(value, function (err) {
        // tell cb that your done writing it.
        // Optionally pass it an err as a shorthand for
        // stream.emit("error", err)
        cb(err)
    })
})

stream.write(foo)
stream.write(bar)

stream.end()
stream.on("finish", function () {
    // only called after both foo and bar have been
    // asynchronously written. e.g. persisted to db.
})
```

## Installation

`npm install end-stream`

## Contributors

 - Raynos

## MIT Licenced
