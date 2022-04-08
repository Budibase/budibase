const { GenericError } = require("./generic")

class HTTPError extends GenericError {
  constructor(message, httpStatus, code, type) {
    super(message, code ? code : "http", type)
    this.status = httpStatus
  }
}

module.exports = {
  HTTPError,
}
