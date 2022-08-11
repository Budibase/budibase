# level-write-stream

A writeStream implementation for leveldb

## Example

This implements the writeStream logic for a levelup interface.

Just pass it a db with `put` and `batch` method and it will do
    the rest!

```js
var LevelWriteStream = require("level-write-stream")

var db = someleveldb()

var writeStream = LevelWriteStream(db)

var stream = writeStream(options)

stream.write({
    key: key
    , value: value
})
```

## Installation

`npm install level-write-stream`

## Contributors

 - Raynos

## MIT Licenced
