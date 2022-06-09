const generic = require("./dist/src/cache/generic")

module.exports = {
  user: require("./dist/src/cache/user"),
  app: require("./dist/src/cache/appMetadata"),
  ...generic,
}
