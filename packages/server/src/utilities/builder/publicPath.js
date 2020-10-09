const { join } = require("../centralPath")

module.exports = (appPath, pageName) => join(appPath, "public", pageName)
