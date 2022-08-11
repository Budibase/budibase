var WriteStream = require("write-stream")

module.exports = EndStream

function EndStream(write, end) {
    var counter = 0
        , ended = false

    end = end || noop

    var stream = WriteStream(function (chunk) {
        counter++
        write(chunk, function (err) {
            if (err) {
                return stream.emit("error", err)
            }

            counter--

            if (counter === 0 && ended) {
                stream.emit("finish")
            }
        })
    }, function () {
        ended = true
        if (counter === 0) {
            this.emit("finish")
        }
    })

    return stream
}

function noop() {}
