var EndStream = require("end-stream")

module.exports = LevelWriteStream

function LevelWriteStream(db) {
    return writeStream

    function writeStream(options) {
        options = options || {}

        var queue = []
            , stream = EndStream(write)

        return stream

        function write(chunk, callback) {
            if (queue.length === 0) {
                process.nextTick(drain)
            }

            queue.push(chunk)
            stream.once("_drain", callback)
        }

        function drain() {
            if (queue.length === 1) {
                var chunk = queue[0]
                db.put(chunk.key, chunk.value, options, emit)
            } else {
                var arr = queue.map(function (chunk) {
                    chunk.type = "put"
                    return chunk
                })

                db.batch(arr, options, emit)
            }

            queue.length = 0
        }

        function emit(err) {
            stream.emit("_drain", err)
        }
    }
}
