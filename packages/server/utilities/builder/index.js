const { appPackageFolder, appsFolder } = require("../createAppPackage")
const {
  readJSON,
  writeJSON,
  readdir,
  ensureDir,
  rename,
  unlink,
  rmdir,
} = require("fs-extra")
const { join, dirname } = require("path")
const { $ } = require("@budibase/core").common
const { intersection, map, values, flatten } = require("lodash/fp")
const { merge } = require("lodash")

const { componentLibraryInfo } = require("./componentLibraryInfo")
const buildPage = require("./buildPage")
const getPages = require("./getPages")
const listScreens = require("./listScreens")
const saveBackend = require("./saveBackend")
const deleteCodeMeta = require("./deleteCodeMeta")

module.exports.buildPage = buildPage
module.exports.listScreens = listScreens
module.exports.saveBackend = saveBackend

const getAppDefinition = async appPath =>
  await readJSON(`${appPath}/appDefinition.json`)

module.exports.getPackageForBuilder = async (config, appname) => {
  const appPath = appPackageFolder(config, appname)

  const pages = await getPages(appPath)

  return {
    appDefinition: await getAppDefinition(appPath),

    accessLevels: await readJSON(`${appPath}/access_levels.json`),

    pages,

    components: await getComponentDefinitions(appPath, pages),
  }
}

module.exports.getApps = async (config, master) => {
  const dirs = await readdir(appsFolder(config))

  return $(master.listApplications(), [map(a => a.name), intersection(dirs)])
}

const screenPath = (appPath, pageName, name) =>
  join(appPath, "pages", pageName, "screens", name + ".json")

module.exports.saveScreen = async (config, appname, pagename, screen) => {
  const appPath = appPackageFolder(config, appname)
  const compPath = screenPath(appPath, pagename, screen.name)
  await ensureDir(dirname(compPath))
  if (screen._css) {
    delete screen._css
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

module.exports.componentLibraryInfo = async (config, appname, componentLibrary) => {
  const appPath = appPackageFolder(config, appname)
  return await componentLibraryInfo(appPath, componentLibrary)
}

/**
 * @param {string} appPath - path to a budibase application
 * @param {Array} pages - a list of budibase application pages 
 * @param {string} componentLibrary - component library to fetch components for
 * @returns {object} - an object containing component definitions namespaced by their component library
 */
const getComponentDefinitions = async (appPath, pages, componentLibrary) => {
  let componentLibraries
  if (!componentLibrary) {
    pages = pages || (await getPages(appPath))

    if (!pages) return []

    componentLibraries = $(pages, [
      values,
      map(p => p.componentLibraries),
      flatten,
    ])
  } else {
    componentLibraries = [componentLibrary]
  }

  const components = {}
  const templates = {}

  for (let library of componentLibraries) {
    const info = await componentLibraryInfo(appPath, library)
    merge(components, info.components)
    merge(templates, info.templates)
  }

  if (components._lib) delete components._lib
  if (templates._lib) delete templates._lib

  return { components, templates }
}

module.exports.getComponentDefinitions = getComponentDefinitions
