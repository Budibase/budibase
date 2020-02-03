const statusCodes = require("./statusCodes")

const errorWithStatus = (message, statusCode) => {
  const e = new Error(message)
  e.statusCode = statusCode
  return e
}

module.exports.unauthorized = message =>
  errorWithStatus(message, statusCodes.UNAUTHORIZED)

module.exports.forbidden = message =>
  errorWithStatus(message, statusCodes.FORBIDDEN)

module.exports.notfound = message =>
  errorWithStatus(message, statusCodes.NOT_FOUND)
