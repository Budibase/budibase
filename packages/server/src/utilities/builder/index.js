const { appPackageFolder } = require("../createAppPackage")
const {
  readJSON,
  writeJSON,
  readdir,
  ensureDir,
  rename,
  unlink,
  rmdir,
} = require("fs-extra")
const { join, dirname, resolve } = require("path")
const env = require("../../environment")

const buildPage = require("./buildPage")
const getPages = require("./getPages")
const listScreens = require("./listScreens")
const deleteCodeMeta = require("./deleteCodeMeta")

module.exports.buildPage = buildPage
module.exports.listScreens = listScreens

const getAppDefinition = async appPath =>
  await readJSON(`${appPath}/appDefinition.json`)

module.exports.getPackageForBuilder = async (config, application) => {
  const appPath = resolve(config.latestPackagesFolder, application._id)

  const pages = await getPages(appPath)

  return {
    pages,

    application,

    clientId: env.CLIENT_ID,
  }
}

const screenPath = (appPath, pageName, name) =>
  join(appPath, "pages", pageName, "screens", name + ".json")

module.exports.saveScreen = async (config, appname, pagename, screen) => {
  const appPath = appPackageFolder(config, appname)
  const compPath = screenPath(appPath, pagename, screen.props._id)

  await ensureDir(dirname(compPath))
  if (screen._css) {
    delete screen._css
  }

  if (screen._fontUrls) {
    delete screen._fontUrls
  }

  deleteCodeMeta(screen.props)

  await writeJSON(compPath, screen, {
    encoding: "utf8",
    flag: "w",
    spaces: 2,
  })
  return screen
}

module.exports.renameScreen = async (
  config,
  appname,
  pagename,
  oldName,
  newName
) => {
  const appPath = appPackageFolder(config, appname)

  const oldComponentPath = screenPath(appPath, pagename, oldName)

  const newComponentPath = screenPath(appPath, pagename, newName)

  await ensureDir(dirname(newComponentPath))
  await rename(oldComponentPath, newComponentPath)
}

module.exports.deleteScreen = async (config, appname, pagename, name) => {
  const appPath = appPackageFolder(config, appname)
  const componentFile = screenPath(appPath, pagename, name)
  await unlink(componentFile)

  const dir = dirname(componentFile)
  if ((await readdir(dir)).length === 0) {
    await rmdir(dir)
  }
}

module.exports.savePage = async (config, appname, pagename, page) => {
  const appPath = appPackageFolder(config, appname)
  const pageDir = join(appPath, "pages", pagename)

  await ensureDir(pageDir)
  await writeJSON(join(pageDir, "page.json"), page, {
    encoding: "utf8",
    flag: "w",
    space: 2,
  })
  const appDefinition = await getAppDefinition(appPath)
  await buildPage(config, appname, appDefinition, pagename, page)
}
