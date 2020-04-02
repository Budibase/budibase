import { flatten, values, uniq, map } from "lodash/fp"
import { pipe } from "components/common/core"

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

export const libUrlsForPreview = (appPackage, pageName) => {
  const resolve = path => {
    let file = appPackage.components.libraryPaths[path]
    if (file.startsWith("./")) file = file.substring(2)
    if (file.startsWith("/")) file = file.substring(1)

    let newPath = path

    if (!newPath.startsWith("./") && !newPath.startsWith("/")) {
      newPath = `/node_modules/${path}`
    }

    return {
      importPath: `/lib${newPath}/${file}`,
      libName: path,
    }
  }

  return pipe([appPackage.pages[pageName]], [libsFromPages, map(resolve)])
}
