const { appPackageFolder } = require("../createAppPackage")
const { writeJSON } = require("fs-extra")
const buildApp = require("./buildApp")

module.exports = async (config, appname, pkg) => {
  const appPath = appPackageFolder(config, appname)
  await writeJSON(`${appPath}/appDefinition.json`, pkg.appDefinition, {
    spaces: 2,
  })

  await writeJSON(`${appPath}/access_levels.json`, pkg.accessLevels, {
    spaces: 2,
  })

  await writeJSON(`${appPath}/pages.json`, pkg.pages, { spaces: 2 })

  await buildApp(config, appname, pkg.pages, pkg.appDefinition)
}
