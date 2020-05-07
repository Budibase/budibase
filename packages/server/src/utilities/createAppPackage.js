const { resolve } = require("path")
const { cwd } = require("process")

const appPackageFolder = (config, appname) =>
  resolve(cwd(), config.latestPackagesFolder, appname)

module.exports.appPackageFolder = appPackageFolder
