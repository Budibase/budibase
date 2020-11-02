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
const { join } = require("../centralPath")
const { dirname } = require("path")

const buildPage = require("./buildPage")
// const getPages = require("./getPages")
const listScreens = require("./listScreens")
const { budibaseAppsDir } = require("../budibaseDir")
// const { budibaseAppsDir } = require("../budibaseDir")

module.exports.buildPage = buildPage
module.exports.listScreens = listScreens

// const getAppDefinition = async appPath =>
//   await readJSON(`${appPath}/appDefinition.json`)

// module.exports.getPackageForBuilder = async application => {
//   const appPath = resolve(budibaseAppsDir(), application._id)

//   const pages = await getPages(appPath)

//   return {
//     pages,
//     application,
//   }
// }

const screenPath = (appPath, pageName, name) =>
  join(appPath, "pages", pageName, "screens", name + ".json")

module.exports.saveScreen = async (appId, pagename, screen) => {
  const appPath = join(budibaseAppsDir(), appId)
  const compPath = screenPath(appPath, pagename, screen.props._id)

  await ensureDir(dirname(compPath))
  if (screen._css) {
    delete screen._css
  }

  await writeJSON(compPath, screen, {
    encoding: "utf8",
    flag: "w",
    spaces: 2,
  })
  return screen
}

module.exports.renameScreen = async (
  config,
  appId,
  pagename,
  oldName,
  newName
) => {
  const appPath = join(budibaseAppsDir(), appId)

  const oldComponentPath = screenPath(appPath, pagename, oldName)

  const newComponentPath = screenPath(appPath, pagename, newName)

  await ensureDir(dirname(newComponentPath))
  await rename(oldComponentPath, newComponentPath)
}

module.exports.deleteScreen = async (config, appId, pagename, name) => {
  const appPath = join(budibaseAppsDir(), appId)
  const componentFile = screenPath(appPath, pagename, name)
  await unlink(componentFile)

  const dir = dirname(componentFile)
  if ((await readdir(dir)).length === 0) {
    await rmdir(dir)
  }
}

// module.exports.savePage = async (appId, pagename, page) => {
//   const appPath = join(budibaseAppsDir(), appId)
//   const pageDir = join(appPath, "pages", pagename)

//   await ensureDir(pageDir)
//   await writeJSON(join(pageDir, "page.json"), page, {
//     encoding: "utf8",
//     flag: "w",
//     space: 2,
//   })
//   const appDefinition = await getAppDefinition(appPath)
//   await buildPage(appId, appDefinition, pagename, page)
// }
