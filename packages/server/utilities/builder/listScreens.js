const { appPackageFolder } = require("../createAppPackage")
const { readJSON, readdir, stat } = require("fs-extra")
const { join } = require("path")
const { keyBy } = require("lodash/fp")

module.exports = async (config, appname, pagename) => {
  const appPath = appPackageFolder(config, appname)
  return keyBy("name")(await fetchscreens(appPath, pagename))
}

const fetchscreens = async (appPath, pagename, relativePath = "") => {
  const currentDir = join(appPath, "pages", pagename, "screens", relativePath)

  const contents = await readdir(currentDir)

  const screens = []

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

      screens.push(component)
    } else {
      const childComponents = await fetchscreens(
        appPath,
        join(relativePath, item)
      )

      for (let c of childComponents) {
        screens.push(c)
      }
    }
  }

  return screens
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