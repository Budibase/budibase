const { constants, copyFile, writeFile, readFile } = require("fs-extra")
const { join, resolve } = require("../centralPath")
const sqrl = require("squirrelly")
const { convertCssToFiles } = require("./convertCssToFiles")
const publicPath = require("./publicPath")
const { budibaseAppsDir } = require("../budibaseDir")

module.exports = async (appId, pageName, pkg) => {
  const appPath = join(budibaseAppsDir(), appId)

  pkg.screens = pkg.screens || []

  await convertCssToFiles(publicPath(appPath, pageName), pkg)

  await buildIndexHtml(appId, pageName, appPath, pkg)

  await buildFrontendAppDefinition(appId, pageName, pkg, appPath)

  await copyClientLib(appPath, pageName)
}

const copyClientLib = async (appPath, pageName) => {
  const sourcepath = require.resolve("@budibase/client")
  const destPath = join(publicPath(appPath, pageName), "budibase-client.js")

  await copyFile(sourcepath, destPath, constants.COPYFILE_FICLONE)

  await copyFile(
    sourcepath + ".map",
    destPath + ".map",
    constants.COPYFILE_FICLONE
  )
}

const buildIndexHtml = async (appId, pageName, appPath, pkg) => {
  const appPublicPath = publicPath(appPath, pageName)

  const stylesheetUrl = s => (s.startsWith("http") ? s : `/${appId}/${s}`)

  const templateObj = {
    title: pkg.page.title || "Budibase App",
    favicon: `${pkg.page.favicon || "/_shared/favicon.png"}`,
    stylesheets: (pkg.page.stylesheets || []).map(stylesheetUrl),
    screenStyles: pkg.screens.filter(s => s._css).map(s => s._css),
    pageStyle: pkg.page._css,
    appId,
    pageName,
  }

  const indexHtmlTemplate = await readFile(
    resolve(__dirname, "index.template.html"),
    "utf8"
  )

  const indexHtmlPath = join(appPublicPath, "index.html")
  const deployableHtmlPath = join(appPublicPath, "index.production.html")

  const indexHtml = sqrl.Render(indexHtmlTemplate, templateObj)
  const deployableHtml = sqrl.Render(indexHtmlTemplate, {
    ...templateObj,
    production: true,
  })

  await writeFile(indexHtmlPath, indexHtml, { flag: "w+" })
  await writeFile(deployableHtmlPath, deployableHtml, { flag: "w+" })
}

const buildFrontendAppDefinition = async (appId, pageName, pkg) => {
  const appPath = join(budibaseAppsDir(), appId)
  const appPublicPath = publicPath(appPath, pageName)

  const filename = join(appPublicPath, "clientFrontendDefinition.js")

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
