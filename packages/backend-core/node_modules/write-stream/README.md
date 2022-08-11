# write-stream

Base class for writable streams

## Example array

```
var toArray = require("write-stream").toArray
    , array = []
    , stream = toArray(array, function end() {
        /* never called as process.stdin does not end */
    })

process.stdin.pipe(stream)

setInterval(function () {
    // peek at the buffered array of chunks from stdin every second
    console.log(array)
}, 1000)
```

## Example function

```
var WriteStream = require("write-stream")
    , stream = WriteStream(function write(chunk) {
        // chunks from stdin
    })

process.stdin.pipe(stream)
```

## Installation

`npm install write-stream`

## Contributors

 - Raynos

## MIT Licenced