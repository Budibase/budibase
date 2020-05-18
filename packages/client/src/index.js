import { createApp } from "./createApp"
import { builtins, builtinLibName } from "./render/builtinComponents"

/**
 * create a web application from static budibase definition files.
 * @param  {object} opts - configuration options for budibase client libary
 */
export const loadBudibase = async opts => {
  const _window = (opts && opts.window) || window
  // const _localStorage = (opts && opts.localStorage) || localStorage

  const frontendDefinition = _window["##BUDIBASE_FRONTEND_DEFINITION##"]
  const uiFunctions = _window["##BUDIBASE_FRONTEND_FUNCTIONS##"]

  // TODO: update
  const user = {}

  const componentLibraryModules = (opts && opts.componentLibraries) || {}

  const libraries = frontendDefinition.libraries || []

  for (let library of libraries) {
    // fetch the JavaScript for the component libraries from the server
    componentLibraryModules[library] = await import(
      `/${frontendDefinition.appId}/componentlibrary?library=${encodeURI(
        library
      )}`
    )
  }

  componentLibraryModules[builtinLibName] = builtins(_window)

  const {
    initialisePage,
    screenStore,
    pageStore,
    routeTo,
    rootNode,
  } = createApp(
    componentLibraryModules,
    frontendDefinition,
    user,
    uiFunctions || {},
    _window,
    rootNode
  )

  const route = _window.location
    ? _window.location.pathname.replace(frontendDefinition.appRootPath, "")
    : ""

  initialisePage(frontendDefinition.page, _window.document.body, route)

  return {
    screenStore,
    pageStore,
    routeTo,
    rootNode,
  }
}

if (window) {
  window.loadBudibase = loadBudibase
}
