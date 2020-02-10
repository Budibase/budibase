const { appPackageFolder } = require("../createAppPackage")
const { componentLibraryInfo } = require("./componentLibraryInfo")
const {
  stat,
  ensureDir,
  pathExists,
  constants,
  copyFile,
  writeFile,
  readFile,
  writeJSON,
} = require("fs-extra")
const { join, resolve, dirname } = require("path")
const sqrl = require("squirrelly")
const { convertCssToFiles } = require("./convertCssToFiles")
const publicPath = require("./publicPath")

module.exports = async (config, appname, pageName, pkg) => {
  const appPath = appPackageFolder(config, appname)

  await convertCssToFiles(publicPath(appPath, pageName), pkg)

  await buildIndexHtml(config, appname, pageName, appPath, pkg)

  await buildFrontendAppDefinition(config, appname, pageName, pkg, appPath)

  await copyClientLib(appPath, pageName)

  await savePageJson(appPath, pageName, pkg)
}

const rootPath = (config, appname) =>
  config.useAppRootPath ? `/${appname}` : ""

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

const buildIndexHtml = async (config, appname, pageName, appPath, pkg) => {
  const appPublicPath = publicPath(appPath, pageName)
  const appRootPath = rootPath(config, appname)

  const stylesheetUrl = s =>
    s.indexOf("http://") === 0 || s.indexOf("https://") === 0
      ? s
      : `/${rootPath(config, appname)}/${s}`

  const templateObj = {
    title: pkg.page.title || "Budibase App",
    favicon: `${appRootPath}/${pkg.page.favicon || "/_shared/favicon.png"}`,
    stylesheets: (pkg.page.stylesheets || []).map(stylesheetUrl),
    screenStyles: pkg.screens.filter(s => s._css).map(s => s._css),
    pageStyle: pkg.page._css,
    appRootPath,
  }

  const indexHtmlTemplate = await readFile(
    resolve(__dirname, "index.template.html"),
    "utf8"
  )

  const indexHtmlPath = join(appPublicPath, "index.html")

  const indexHtml = sqrl.Render(indexHtmlTemplate, templateObj)

  await writeFile(indexHtmlPath, indexHtml, { flag: "w+" })
}

const buildFrontendAppDefinition = async (config, appname, pageName, pkg) => {
  const appPath = appPackageFolder(config, appname)
  const appPublicPath = publicPath(appPath, pageName)
  const appRootPath = rootPath(config, appname)

  const componentLibraries = []

  for (let lib of pkg.page.componentLibraries) {
    const info = await componentLibraryInfo(appPath, lib)
    const libFile = info.components._lib || "index.js"
    const source = join(info.libDir, libFile)
    const moduleDir = join(
      appPublicPath,
      "lib",
      info.libDir.replace(appPath, "")
    )
    const destPath = join(moduleDir, libFile)

    await ensureDir(dirname(destPath))

    componentLibraries.push({
      importPath: destPath.replace(appPublicPath, "").replace(/\\/g, "/"),
      libName: lib,
    })

    let shouldCopy = !(await pathExists(destPath))
    if (!shouldCopy) {
      const destStat = await stat(destPath)
      const sourceStat = await stat(source)
      shouldCopy = destStat.ctimeMs !== sourceStat.ctimeMs
    }

    if (shouldCopy) {
      await copyFile(source, destPath, constants.COPYFILE_FICLONE)
    }
  }

  const filename = join(appPublicPath, "clientFrontendDefinition.js")

  if (pkg.page._css) {
    delete pkg.page._css
  }

  for (let screen of pkg.screens) {
    if (screen._css) {
      delete pkg.page._css
    }
  }

  const clientUiDefinition = JSON.stringify({
    componentLibraries: componentLibraries,
    appRootPath: appRootPath,
    page: pkg.page,
    screens: pkg.screens,
  })

  await writeFile(
    filename,
    `window['##BUDIBASE_FRONTEND_DEINITION##'] = ${clientUiDefinition};
window['##BUDIBASE_FRONTEND_FUNCTIONS##'] = ${pkg.uiFunctions}`
  )
}

const savePageJson = async (appPath, pageName, pkg) => {
  const pageFile = join(appPath, "pages", pageName, "page.json")

  if (pkg.page._css) {
    delete pkg.page._css
  }

  if (pkg.page.name) {
    delete pkg.page.name
  }

  await writeJSON(pageFile, pkg.page, {
    spaces: 2,
  })
}
