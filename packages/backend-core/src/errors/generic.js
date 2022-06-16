const { BudibaseError } = require("./base")

class GenericError extends BudibaseError {
  constructor(message, code, type) {
    super(message, code, type ? type : "generic")
  }
}

module.exports = {
  GenericError,
}
