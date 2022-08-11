var WriteStream = require("..")
    , toArray = WriteStream.toArray
    , Stream = require("readable-stream")

var out1 = toArray([], function (buffer1) {
    console.log("out", buffer1)
})

createInput().pipe(out1)

var buffer2 = []
var out2 = WriteStream(function write(chunk) {
    buffer2.push(chunk)
}, function end() {
    console.log("out", buffer2)
})

createInput().pipe(out2)

var buffer3 = []
var out3 = WriteStream(function write(chunk) {
    var stream = this
    buffer3.push(chunk)
    setTimeout(function () {
        stream.emit("drain")
    }, 500)
    return false
}, function end() {
    console.log("out", buffer3)
})

createInput().pipe(out3)

function createInput() {
    var s = new Stream()
        , count = 0

    s.read = function () {
        if (++count < 5) {
            return count
        } else {
            s.emit("end")
        }
    }

    return s
}
