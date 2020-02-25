import { createApp } from "./createApp"
import { trimSlash } from "./common/trimSlash"
import { builtins, builtinLibName } from "./render/builtinComponents"

/**
 * create a web application from static budibase definition files.
 * @param  {object} opts - configuration options for budibase client libary
 */
export const loadBudibase = async opts => {
  let componentLibraries = opts && opts.componentLibraries
  const _window = (opts && opts.window) || window
  const _localStorage = (opts && opts.localStorage) || localStorage

  const backendDefinition = _window["##BUDIBASE_BACKEND_DEFINITION##"]
  const frontendDefinition = _window["##BUDIBASE_FRONTEND_DEFINITION##"]
  const uiFunctions = _window["##BUDIBASE_FRONTEND_FUNCTIONS##"]

  const userFromStorage = _localStorage.getItem("budibase:user")

  const user = userFromStorage
    ? JSON.parse(userFromStorage)
    : {
        name: "annonymous",
        permissions: [],
        isUser: false,
        temp: false,
      }

  frontendDefinition.appRootPath =
    frontendDefinition.appRootPath === ""
      ? ""
      : "/" + trimSlash(frontendDefinition.appRootPath)

  if (!componentLibraries) {
    const componentLibraryUrl = lib =>
      frontendDefinition.appRootPath + "/" + trimSlash(lib)
    componentLibraries = {}

    for (let lib of frontendDefinition.componentLibraries) {
      componentLibraries[lib.libName] = await import(
        componentLibraryUrl(lib.importPath)
      )
    }
  }

  componentLibraries[builtinLibName] = builtins(_window)

  const { initialisePage, screenStore, pageStore, routeTo, rootNode } = createApp(
    componentLibraries,
    frontendDefinition,
    backendDefinition,
    user,
    uiFunctions || {},
    _window,
    rootNode
  )

  const route = _window.location
    ? _window.location.pathname.replace(frontendDefinition.appRootPath, "")
    : ""

  return {
    rootNode: initialisePage(
      frontendDefinition.page,
      _window.document.body,
      route
    ),
    screenStore,
    pageStore,
    routeTo,
    rootNode
  }
}

if (window) {
  window.loadBudibase = loadBudibase
}
