const { v4 } = require("uuid")

module.exports = function() {
  return v4().replace(/-/g, "")
}
