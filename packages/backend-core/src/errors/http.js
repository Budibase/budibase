const { GenericError } = require("./generic")

class HTTPError extends GenericError {
  constructor(message, httpStatus, code = "http", type = "generic") {
    super(message, code, type)
    this.status = httpStatus
  }
}

module.exports = {
  HTTPError,
}
