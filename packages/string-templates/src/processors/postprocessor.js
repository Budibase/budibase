const { FIND_HBS_REGEX } = require("../utilities")

class Postprocessor {
  constructor(name, fn) {
    this.name = name
    this.fn = fn
  }
}

module.exports.processors = []
