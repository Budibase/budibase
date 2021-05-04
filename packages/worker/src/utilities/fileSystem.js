const { readFileSync } = require("fs")

exports.readStaticFile = (path) => {
  return readFileSync(path, "utf-8")
}
