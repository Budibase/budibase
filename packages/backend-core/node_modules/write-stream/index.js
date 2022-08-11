var Stream = require("stream")

module.exports = WriteStream

WriteStream.toArray = require("./array")

function WriteStream(write, end) {
    var stream = new Stream()
        , ended = false

    end = end || defaultEnd

    stream.write = handleWrite
    stream.end = handleEnd

    // Support 0.8 pipe [LEGACY]
    stream.writable = true

    return stream

    function handleWrite(chunk) {
        var result = write.call(stream, chunk)
        return result === false ? false : true
    }

    function handleEnd(chunk) {
        if (ended) {
            return
        }

        ended = true
        if (arguments.length) {
            stream.write(chunk)
        }
        end.call(stream)
    }
}

function defaultEnd() {
    this.emit("finish")
}
