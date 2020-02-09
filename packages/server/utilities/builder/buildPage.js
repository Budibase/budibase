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
} = require("fs-extra")
const { join, resolve, dirname } = require("path")
const sqrl = require("squirrelly")

module.exports = async (config, appname, pkg) => {
  const appPath = appPackageFolder(config, appname)

  await buildClientAppDefinition(config, appname, pkg, appPath)

  await buildIndexHtml(config, appname, appPath, pkg.pageName, pkg.page)

  await copyClientLib(appPath, pkg.pageName)
}

const publicPath = (appPath, pageName) => join(appPath, "public", pageName)
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

const buildIndexHtml = async (config, appname, appPath, pageName, page) => {
  const appPublicPath = publicPath(appPath, pageName)
  const appRootPath = rootPath(config, appname)

  const stylesheetUrl = s =>
    s.indexOf("http://") === 0 || s.indexOf("https://") === 0
      ? s
      : `/${rootPath(config, appname)}/${s}`

  const templateObj = {
    title: page.title || "Budibase App",
    favicon: `${appRootPath}/${page.favicon || "/_shared/favicon.png"}`,
    stylesheets: (page.stylesheets || []).map(stylesheetUrl),
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

const buildClientAppDefinition = async (config, appname, pkg) => {
  const appPath = appPackageFolder(config, appname)
  const appPublicPath = publicPath(appPath, pkg.pageName)
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

  const filename = join(appPublicPath, "clientAppDefinition.js")

  const clientAppDefObj = {
    hierarchy: pkg.appDefinition.hierarchy,
    componentLibraries: componentLibraries,
    appRootPath: appRootPath,
    props: pkg.props,
  }

  await writeFile(
    filename,
    `window['##BUDIBASE_APPDEFINITION##'] = ${JSON.stringify(clientAppDefObj)};
window['##BUDIBASE_UIFUNCTIONS##'] = ${pkg.uiFunctions}`
  )
}
