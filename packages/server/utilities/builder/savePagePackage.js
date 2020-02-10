const { appPackageFolder } = require("../createAppPackage")
const { writeJSON } = require("fs-extra")
const { join } = require("path")
const buildPage = require("./buildPage")

module.exports = async (config, appname, pageName, pkg) => {
  const appPath = appPackageFolder(config, appname)
  pkg.pageName = pageName
  await writeJSON(`${appPath}/appDefinition.json`, pkg.appDefinition, {
    spaces: 2,
  })

  await writeJSON(`${appPath}/access_levels.json`, pkg.accessLevels, {
    spaces: 2,
  })

  await buildPage(config, appname, pkg)

  const pageFile = join(appPath, "pages", pageName, "page.json")

  if (pkg.page._css) {
    delete pkg.page._css
  }

  await writeJSON(pageFile, pkg.page, {
    spaces: 2,
  })
}
