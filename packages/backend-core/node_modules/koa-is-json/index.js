
module.exports = isJSON;

/**
 * Check if `body` should be interpreted as json.
 */

function isJSON(body) {
  if (!body) return false;
  if ('string' == typeof body) return false;
  if ('function' == typeof body.pipe) return false;
  if (Buffer.isBuffer(body)) return false;
  return true;
}
