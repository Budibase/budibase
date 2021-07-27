/**
 * Utility to handle authentication errors.
 *
 * @param {*} done The passport callback.
 * @param {*} message Message that will be returned in the response body
 * @param {*} err (Optional) error that will be logged
 */
exports.authError = function (done, message, err = null) {
  return done(
    err,
    null, // never return a user
    { message: message }
  )
}
