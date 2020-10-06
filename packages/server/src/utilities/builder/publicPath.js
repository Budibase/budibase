const { join } = require("../sanitisedPath")

module.exports = (appPath, pageName) => join(appPath, "public", pageName)
