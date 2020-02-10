const getPages = require("./getPages")
const { appPackageFolder } = require("../createAppPackage")
const { writeJSON, writeFile } = require("fs-extra")
const { join } = require("path")
const publicPath = require("./publicPath")

module.exports = async (config, appname, appDefinition, accessLevels) => {
  const appPath = appPackageFolder(config, appname)

  await writeJSON(`${appPath}/appDefinition.json`, appDefinition, {
    spaces: 2,
  })

  await writeJSON(`${appPath}/access_levels.json`, accessLevels, {
    spaces: 2,
  })

  const pages = await getPages(appPath)
  for (let pageName in pages) {
    const pagePublicPath = publicPath(appPath, pageName)
    const filename = join(pagePublicPath, "clientBackendDefinition.js")
    const appDefString = JSON.stringify(appDefinition)
    await writeFile(
      filename,
      `window['##BUDIBASE_FRONTEND_DEINITION##'] = ${appDefString};`
    )
  }
}
