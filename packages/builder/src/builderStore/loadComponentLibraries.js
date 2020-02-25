import { flatten, values, uniq, map } from "lodash/fp"
import { pipe } from "../common/core"

export const loadLibs = async (appName, appPackage) => {
  const allLibraries = {}

  for (let lib of libsFromPages(appPackage.pages)) {
    const libModule = await import(makeLibraryUrl(appName, lib))
    allLibraries[lib] = libModule
  }

  return allLibraries
}

export const loadLibUrls = (appName, appPackage) => {
  const allLibraries = []
  for (let lib of libsFromPages(appPackage.pages)) {
    const libUrl = makeLibraryUrl(appName, lib)
    allLibraries.push({ libName: lib, importPath: libUrl })
  }

  return allLibraries
}

export const loadLib = async (appName, lib, allLibs) => {
  allLibs[lib] = await import(makeLibraryUrl(appName, lib))
  return allLibs
}

export const makeLibraryUrl = (appName, lib) =>
  `/_builder/${appName}/componentlibrary?lib=${encodeURI(lib)}`

export const libsFromPages = pages =>
  pipe(pages, [values, map(p => p.componentLibraries), flatten, uniq])
