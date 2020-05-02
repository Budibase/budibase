const { readJSON, exists } = require("fs-extra")
const { resolve, join, dirname } = require("path")

/**
 * @param {string} appPath - budibase application name
 * @param {string} libname - component library name
 * @returns {string} directory name of component definitions for a specific budibase application.
 */
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

/**
 * @param {string} appPath - the path to a budibase application
 * @param {string} libname - the name of the component libary to use for namespacing
 * @returns {object} tree of components namespaced by their component library name.
 */
module.exports.componentLibraryInfo = async (appPath, libname) => {
  const libDir = getLibDir(appPath, libname)
  const componentsPath = resolve(libDir, "components.json")

  const componentDefinitionExists = await exists(componentsPath)

  if (!componentDefinitionExists) {
    const e = new Error(
      `could not find components definition file at ${componentsPath}`
    )
    e.statusCode = 404
    throw e
  }

  const addNamespace = name => `${libname}/${name}`

  try {
    const componentDefinitions = await readJSON(componentsPath)
    const namespacedComponents = { _lib: componentDefinitions._lib }
    for (let componentKey in componentDefinitions) {
      if (componentKey === "_lib" || componentKey === "_templates") continue
      const namespacedName = addNamespace(componentKey)
      componentDefinitions[componentKey].name = namespacedName
      namespacedComponents[namespacedName] = componentDefinitions[componentKey]
    }

    const namespacedTemplates = { _lib: componentDefinitions._lib }
    for (let templateKey in componentDefinitions._templates || {}) {
      const template = componentDefinitions._templates[templateKey]
      if (template.component)
        template.component = addNamespace(template.component)
      const namespacedName = addNamespace(templateKey)
      template.name = namespacedName
      namespacedTemplates[namespacedName] =
        componentDefinitions._templates[templateKey]
    }

    return {
      components: namespacedComponents,
      templates: namespacedTemplates,
      libDir,
      componentsPath,
    }
  } catch (e) {
    const err = `could not parse JSON - ${componentsPath} : ${e.message}`
    throw new Error(err)
  }
}
