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

    components: await getComponents(appPath, pages),
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
  await writeJSON(compPath, screen, {
    encoding: "utf8",
    flag: "w",
    spaces: 2,
  })
  component.stateOrigins = buildStateOrigins(component);
  return component;
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

module.exports.componentLibraryInfo = async (config, appname, lib) => {
  const appPath = appPackageFolder(config, appname)
  return await componentLibraryInfo(appPath, lib)
}

const getComponents = async (appPath, pages, lib) => {
  let libs
  if (!lib) {
    pages = pages || (await getPages(appPath))

    if (!pages) return []

    libs = $(pages, [values, map(p => p.componentLibraries), flatten])
  } else {
    libs = [lib]
  }

  const components = {}
  const generators = {}

  for (let l of libs) {
    const info = await componentLibraryInfo(appPath, l)
    merge(components, info.components)
    merge(generators, info.generators)
  }

  if (components._lib) delete components._lib
  if (components._generators) delete components._generators

  return { components, generators }
}

/**
 * buildStateOrigins
 *
 * Builds an object that details all the bound state in the application, and what updates it. 
 *
 * @param screenDefinition - the screen definition metadata.
 * @returns {Object} an object with the client state values and how they are managed. 
 */
const buildStateOrigins = screenDefinition => {
  const origins = {};

  function traverse(propValue) {
    for (let key in propValue) {
      if (!Array.isArray(propValue[key])) continue;

      if (key === "_children") propValue[key].forEach(traverse);

      for (let element of propValue[key]) {
        if (element["##eventHandlerType"] === "Set State") origins[element.parameters.path] = element;
      }
    }
  }

  traverse(screenDefinition.props);

  return origins;
};

module.exports.buildStateOrigins = buildStateOrigins;

const fetchscreens = async (appPath, relativePath = "") => {
  const currentDir = join(appPath, "components", relativePath)

  const contents = await readdir(currentDir)

  const components = []

  for (let item of contents) {
    const itemRelativePath = join(relativePath, item)
    const itemFullPath = join(currentDir, item)
    const stats = await stat(itemFullPath)

    if (stats.isFile()) {
      if (!item.endsWith(".json")) continue

      const component = await readJSON(itemFullPath)

      component.name = itemRelativePath
        .substring(0, itemRelativePath.length - 5)
        .replace(/\\/g, "/")

      component.props = component.props || {}

      component.stateOrigins = buildStateOrigins(component);

      components.push(component)
    } else {
      const childComponents = await fetchscreens(
        appPath,
        join(relativePath, item)
      )

      for (let c of childComponents) {
        components.push(c)
      }
    }
  }

  return components
}

module.exports.getComponents = getComponents
