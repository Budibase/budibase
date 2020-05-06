import { createApp } from "./createApp"
import { trimSlash } from "./common/trimSlash"
import { builtins, builtinLibName } from "./render/builtinComponents"
// import * as standardComponents from "../../standard-components/dist";
// import * as materialDesignComponents from "../../materialdesign-components/dist";

/**
 * create a web application from static budibase definition files.
 * @param  {object} opts - configuration options for budibase client libary
 */
export const loadBudibase = async opts => {
  const _window = (opts && opts.window) || window
  const _localStorage = (opts && opts.localStorage) || localStorage

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

  let { appRootPath } = frontendDefinition;
  appRootPath = appRootPath === "" ? "" : "/" + trimSlash(appRootPath)


  const componentLibraryModules = {};
  const libraries = frontendDefinition.libraries || [
    "@budibase/standard-components",
    "@budibase/materialdesign-components",
  ];
  for (let library of libraries) {
    // fetch the JavaScript for the component libraries from the server 
    componentLibraryModules[library] = await import(
      `/${frontendDefinition.appId}/componentlibrary?library=${encodeURI(library)}`
    );
  };

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
