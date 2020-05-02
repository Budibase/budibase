/**
 * Fetches the definitions for component library components. This includes
 * their props and other metadata from components.json.
 * @param {string} clientId - ID of the current client
 * @param {string} appId - ID of the currently running app
 */
export const fetchComponentLibDefinitions = async (clientId, appId) => {
  const LIB_DEFINITION_URL = `/${clientId}/${appId}/components/definitions`;
  try {
    const libDefinitionResponse = await fetch(LIB_DEFINITION_URL);
    return await libDefinitionResponse.json();
  } catch (err) {
    console.error(`Error fetching component definitions for ${appId}`, err);
  }
};

/**
 * Loads the JavaScript files for app component libraries and returns a map of their modules.
 * @param {object} application - package definition
 */
export const fetchComponentLibModules = async application => {
  const allLibraries = {}

  for (let libraryName of application.componentLibraries) {
    const LIBRARY_URL = `/${application._id}/componentlibrary?library=${libraryName}`;
    const libraryModule = await import(LIBRARY_URL)
    allLibraries[libraryName] = libraryModule
  }

  return allLibraries
}

// export const loadLibUrls = (appId, appPackage) => {
//   const allLibraries = []
//   for (let lib of libsFromPages(appPackage.pages)) {
//     const libUrl = makeLibraryUrl(appId, lib)
//     allLibraries.push({ libName: lib, importPath: libUrl })
//   }

//   return allLibraries
// }

// export const loadLib = async (appId, lib, allLibs) => {
//   allLibs[lib] = await import(makeLibraryUrl(appId, lib))
//   return allLibs
// }

// export const makeLibraryUrl = (appId, lib) =>
//   `/_builder/${appId}/componentlibrary?lib=${encodeURI(lib)}`

// export const libsFromPages = pages =>
//   pipe(pages, [values, map(p => p.componentLibraries), flatten, uniq])

// export const libUrlsForPreview = (appPackage, pageName) => {
//   const resolve = path => {
//     let file = appPackage.components.libraryPaths[path]
//     if (file.startsWith("./")) file = file.substring(2)
//     if (file.startsWith("/")) file = file.substring(1)

//     let newPath = path

//     if (!newPath.startsWith("./") && !newPath.startsWith("/")) {
//       newPath = `/node_modules/${path}`
//     }

//     return {
//       importPath: `/lib${newPath}/${file}`,
//       libName: path,
//     }
//   }

//   return pipe([appPackage.pages[pageName]], [libsFromPages, map(resolve)])
// }
