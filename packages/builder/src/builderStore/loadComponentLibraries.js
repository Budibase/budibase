import { map } from "lodash/fp"

export const loadLibs = async (appName, appPackage) => {
  const allLibraries = {}
  for (let lib of appPackage.pages.componentLibraries) {
    const libModule = await import(makeLibraryUrl(appName, lib))
    allLibraries[lib] = libModule
  }

  return allLibraries
}

export const loadGeneratorLibs = async (appName, appPackage) => {
  const allGeneratorLibs = {}
  for (let lib of appPackage.pages.componentLibraries) {
    const generatorModule = await import(makeGeneratorLibraryUrl(appName, lib))
    allGeneratorLibs[lib] = generatorModule
  }

  return allGeneratorLibs
}

export const loadLibUrls = (appName, appPackage) => {
  const allLibraries = []
  for (let lib of appPackage.pages.componentLibraries) {
    const libUrl = makeLibraryUrl(appName, lib)
    allLibraries.push({ libName: lib, importPath: libUrl })
  }

  return allLibraries
}

export const loadLib = async (appName, lib, allLibs) => {
  allLibs[lib] = await import(makeLibraryUrl(appName, lib))
  return allLibs
}

export const loadGeneratorLib = async (appName, lib, allGeneratorLibs) => {
  allGeneratorLibs[lib] = await import(makeGeneratorLibraryUrl(appName, lib))
  return allGeneratorLibs
}

export const makeLibraryUrl = (appName, lib) =>
  `/_builder/${appName}/componentlibrary?lib=${encodeURI(lib)}`

export const makeGeneratorLibraryUrl = (appName, lib) =>
  `/_builder/${appName}/componentlibraryGenerators?lib=${encodeURI(lib)}`
