/**
 * Makes sure that a URL has the correct number of slashes, while maintaining the
 * http(s):// double slashes.
 * @param {string} url The URL to test and remove any extra double slashes.
 * @return {string} The updated url.
 */
exports.checkSlashesInUrl = (url) => {
  return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}
