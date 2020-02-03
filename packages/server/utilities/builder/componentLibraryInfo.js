const { readJSON, exists } = require("fs-extra")
const { resolve, join, dirname } = require("path")

const getLibDir = (appPath, libname) => {
  try {
    const componentsFile = require.resolve(join(libname, "components.json"), {
      paths: [appPath],
    })
    return dirname(componentsFile)
  } catch (e) {
    console.log(e)
  }
}

const getComponentsFilepath = libPath => resolve(libPath, "components.json")

module.exports.componentsFilepath = (appPath, libname) =>
  getComponentsFilepath(getLibDir(appPath, libname))

module.exports.componentLibraryInfo = async (appPath, libname) => {
  const libDir = getLibDir(appPath, libname)
  const componentsPath = getComponentsFilepath(libDir)

  if (!(await exists(componentsPath))) {
    const e = new Error(
      `could not find components definition file at ${componentsPath}`
    )
    e.statusCode = 404
    throw e
  }

  try {
    const components = await readJSON(componentsPath)
    const namespacedComponents = { _lib: components._lib }
    for (let cname in components) {
      if (cname === "_lib" || cname == "_generators") continue
      const namespacedName = `${libname}/${cname}`
      components[cname].name = namespacedName
      namespacedComponents[namespacedName] = components[cname]
    }

    const namespacedGenerators = {}
    if (components._generators) {
      namespacedGenerators._lib = components._generators._lib || "generators.js"
      for (let gname in components._generators) {
        if (gname === "_lib") continue
        const namespacedName = `${libname}/${gname}`
        components._generators[gname].name = namespacedName
        namespacedGenerators[namespacedName] = components._generators[gname]
      }
    }

    return {
      components: namespacedComponents,
      generators: namespacedGenerators,
      libDir,
      componentsPath,
    }
  } catch (e) {
    const err = `could not parse JSON - ${componentsPath} : ${e.message}`
    throw new Error(err)
  }
}
