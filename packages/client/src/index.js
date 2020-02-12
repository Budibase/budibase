import { createApp } from "./createApp"
import { trimSlash } from "./common/trimSlash"
import { builtins, builtinLibName } from "./render/builtinComponents"

export const loadBudibase = async (opts) => {

  let componentLibraries = opts && opts.componentLibraries
  let page = opts && opts.page
  let screens = opts && opts.screens
  const _window = window || (opts && opts.window)
  const _localStorage = localStorage || (opts && opts.localStorage)

  const backendDefinition = _window["##BUDIBASE_BACKEND_DEFINITION##"]
  const frontendDefinition = _window["##BUDIBASE_FRONTEND_DEFINITION##"]
  const uiFunctionsFromWindow = _window["##BUDIBASE_FRONTEND_FUNCTIONS##"]
  const uiFunctions = uiFunctionsFromWindow || (opts && opts.uiFunctions)

  const userFromStorage = _localStorage.getItem("budibase:user")

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

  componentLibraries[builtinLibName] = builtins(_window)

  if (!page) {
    page = frontendDefinition.page
  }

  if (!screens) {
    screens = frontendDefinition.screens
  }

  const { initialisePage, screenStore, pageStore, routeTo, rootNode } = createApp(
    _window.document,
    componentLibraries,
    frontendDefinition,
    backendDefinition,
    user,
    uiFunctions || {},
    screens
  )

  const route = _window.location 
                ? _window.location.pathname.replace(rootPath, "")
                : "";

  return {
    rootNode: initialisePage(page, _window.document.body, route),
    screenStore,
    pageStore,
    routeTo,
    rootNode
  }
}

if (window) {
  window.loadBudibase = loadBudibase
}
