var to = require("./index")

module.exports = toArray

function toArray(array, end) {
    if (typeof array === "function") {
        end = array
        array = []
    }

    return to(writeArray, endArray)

    function writeArray(chunk) {
        array.push(chunk)
    }

    function endArray() {
        end(array)
        this.emit("end")
    }
}
