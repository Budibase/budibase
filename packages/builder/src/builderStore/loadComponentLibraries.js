import { flatten, values, uniq, map } from "lodash/fp"
import { pipe } from "components/common/core"

export const loadLibs = async (appId, appPackage) => {
  const allLibraries = {}

  for (let lib of libsFromPages(appPackage.pages)) {
    const libModule = await import(makeLibraryUrl(appId, lib))
    allLibraries[lib] = libModule
  }

  return allLibraries
}

export const loadLibUrls = (appId, appPackage) => {
  const allLibraries = []
  for (let lib of libsFromPages(appPackage.pages)) {
    const libUrl = makeLibraryUrl(appId, lib)
    allLibraries.push({ libName: lib, importPath: libUrl })
  }

  return allLibraries
}

export const loadLib = async (appId, lib, allLibs) => {
  allLibs[lib] = await import(makeLibraryUrl(appId, lib))
  return allLibs
}

export const makeLibraryUrl = (appId, lib) =>
  `/_builder/${appId}/componentlibrary?lib=${encodeURI(lib)}`

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
