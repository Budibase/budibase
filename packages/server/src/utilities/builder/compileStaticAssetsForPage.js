const { ensureDir, constants, copyFile, writeFile } = require("fs-extra")
const { join } = require("../centralPath")
const { convertCssToBundle } = require("./convertCssToFiles")
const { budibaseAppsDir } = require("../budibaseDir")

module.exports = async (appId, pageName, pkg) => {
  const pagePath = join(budibaseAppsDir(), appId, "public", pageName)

  pkg.screens = pkg.screens || []

  await ensureDir(pagePath)

  await convertCssToBundle(pagePath, pkg)

  await buildFrontendAppDefinition(pagePath, pkg)

  await copyClientLib(pagePath)
}

const copyClientLib = async pagePath => {
  const sourcepath = require.resolve("@budibase/client")
  const destPath = join(pagePath, "budibase-client.js")

  await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE)

  await copyFile(
    sourcepath + ".map",
    destPath + ".map",
    constants.COPYFILE_FICLONE
  )
}

const buildFrontendAppDefinition = async (pagePath, pkg) => {
  const filename = join(pagePath, "clientFrontendDefinition.js")

  delete pkg.page._css

  for (let screen of pkg.screens) {
    if (screen._css) {
      delete pkg.page._css
    }
  }

  const clientUiDefinition = JSON.stringify({
    page: pkg.page,
    screens: pkg.screens,
    libraries: ["@budibase/standard-components"],
  })

  await writeFile(
    filename,
    `
     window['##BUDIBASE_FRONTEND_DEFINITION##'] = ${clientUiDefinition};
    `
  )
}
