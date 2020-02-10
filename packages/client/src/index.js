import { createApp } from "./createApp"
import { trimSlash } from "./common/trimSlash"
import { builtins, builtinLibName } from "./render/builtinComponents"

export const loadBudibase = async ({
  componentLibraries,
  page,
  screens,
  window,
  localStorage,
  uiFunctions,
}) => {
  const backendDefinition = window["##BUDIBASE_BACKEND_DEFINITION##"]
  const frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
  const uiFunctionsFromWindow = window["##BUDIBASE_FRONTEND_FUNCTIONS##"]
  uiFunctions = uiFunctionsFromWindow || uiFunctions

  const userFromStorage = localStorage.getItem("budibase:user")

  const user = userFromStorage
    ? JSON.parse(userFromStorage)
    : {
        name: "annonymous",
        permissions: [],
        isUser: false,
        temp: false,
      }

  const rootPath =
    frontendDefinition.appRootPath === ""
      ? ""
      : "/" + trimSlash(frontendDefinition.appRootPath)

  if (!componentLibraries) {
    
    const componentLibraryUrl = lib => rootPath + "/" + trimSlash(lib)
    componentLibraries = {}

    for (let lib of frontendDefinition.componentLibraries) {
      componentLibraries[lib.libName] = await import(
        componentLibraryUrl(lib.importPath)
      )
    }
  }

  componentLibraries[builtinLibName] = builtins(window)

  if (!page) {
    page = frontendDefinition.page
  }

  if (!screens) {
    screens = frontendDefinition.screens
  }

  const { initialisePage, screenStore, pageStore, routeTo, rootNode } = createApp(
    window.document,
    componentLibraries,
    frontendDefinition,
    backendDefinition,
    user,
    uiFunctions || {},
    screens
  )

  const route = window.location 
                ? window.location.pathname.replace(rootPath, "")
                : "";

  return {
    rootNode: initialisePage(page, window.document.body, route),
    screenStore,
    pageStore,
    routeTo,
    rootNode
  }
}

if (window) {
  window.loadBudibase = loadBudibase
}
