const { join } = require("path")

module.exports = (appPath, pageName) => join(appPath, "public", pageName)
