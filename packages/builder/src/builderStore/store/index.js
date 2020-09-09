import { values, cloneDeep } from "lodash/fp"
import getNewComponentName from "../getNewComponentName"
import { backendUiStore } from "builderStore"
import { writable, get } from "svelte/store"
import api from "../api"
import { DEFAULT_PAGES_OBJECT } from "../../constants"
import { getExactComponent } from "components/userInterface/pagesParsing/searchComponents"
import {
  createProps,
  makePropsSafe,
  getBuiltin,
} from "components/userInterface/pagesParsing/createProps"
import { fetchComponentLibDefinitions } from "../loadComponentLibraries"
import { buildCodeForScreens } from "../buildCodeForScreens"
import { generate_screen_css } from "../generate_css"
import { insertCodeMetadata } from "../insertCodeMetadata"
import { uuid } from "../uuid"
import {
  selectComponent as _selectComponent,
  getParent,
  walkProps,
  savePage as _savePage,
  saveCurrentPreviewItem as _saveCurrentPreviewItem,
  saveScreenApi as _saveScreenApi,
  regenerateCssForCurrentScreen,
  generateNewIdsForComponent,
  getComponentDefinition,
} from "../storeUtils"
export const getStore = () => {
  const initial = {
    apps: [],
    name: "",
    description: "",
    pages: DEFAULT_PAGES_OBJECT,
    mainUi: {},
    unauthenticatedUi: {},
    components: [],
    currentPreviewItem: null,
    currentComponentInfo: null,
    currentFrontEndType: "none",
    currentPageName: "",
    currentComponentProps: null,
    errors: [],
    hasAppPackage: false,
    libraries: null,
    appId: "",
  }

  const store = writable(initial)

  store.setPackage = setPackage(store, initial)

  store.saveScreen = saveScreen(store)
  store.setCurrentScreen = setCurrentScreen(store)
  store.setCurrentPage = setCurrentPage(store)
  store.createScreen = createScreen(store)
  store.addStylesheet = addStylesheet(store)
  store.removeStylesheet = removeStylesheet(store)
  store.savePage = savePage(store)
  store.addChildComponent = addChildComponent(store)
  store.selectComponent = selectComponent(store)
  store.setComponentProp = setComponentProp(store)
  store.setPageOrScreenProp = setPageOrScreenProp(store)
  store.setComponentStyle = setComponentStyle(store)
  store.setComponentCode = setComponentCode(store)
  store.setScreenType = setScreenType(store)
  store.getPathToComponent = getPathToComponent(store)
  store.addTemplatedComponent = addTemplatedComponent(store)
  store.setMetadataProp = setMetadataProp(store)
  store.editPageOrScreen = editPageOrScreen(store)
  store.pasteComponent = pasteComponent(store)
  store.storeComponentForCopy = storeComponentForCopy(store)
  return store
}

export default getStore

const setPackage = (store, initial) => async pkg => {
  const [main_screens, unauth_screens] = await Promise.all([
    api
      .get(`/_builder/api/${pkg.application._id}/pages/main/screens`)
      .then(r => r.json()),
    api
      .get(`/_builder/api/${pkg.application._id}/pages/unauthenticated/screens`)
      .then(r => r.json()),
  ])

  pkg.pages = {
    main: {
      ...pkg.pages.main,
      _screens: Object.values(main_screens),
    },
    unauthenticated: {
      ...pkg.pages.unauthenticated,
      _screens: Object.values(unauth_screens),
    },
  }

  initial.libraries = pkg.application.componentLibraries
  initial.components = await fetchComponentLibDefinitions(pkg.application._id)
  initial.name = pkg.application.name
  initial.description = pkg.application.description
  initial.appId = pkg.application._id
  initial.pages = pkg.pages
  initial.hasAppPackage = true
  initial.screens = values(pkg.screens)
  initial.allScreens = [
    ...Object.values(main_screens),
    ...Object.values(unauth_screens),
  ]
  initial.builtins = [getBuiltin("##builtin/screenslot")]
  initial.appInstances = pkg.application.instances
  initial.appId = pkg.application._id
  store.set(initial)
  await backendUiStore.actions.database.select(initial.appInstances[0])
  return initial
}

const saveScreen = store => screen => {
  store.update(state => {
    return _saveScreen(store, state, screen)
  })
}

const _saveScreen = async (store, s, screen) => {
  const currentPageScreens = s.pages[s.currentPageName]._screens

  await api
    .post(`/_builder/api/${s.appId}/pages/${s.currentPageName}/screen`, screen)
    .then(() => {
      if (currentPageScreens.includes(screen)) return

      const screens = [...currentPageScreens, screen]

      store.update(innerState => {
        innerState.pages[s.currentPageName]._screens = screens
        innerState.screens = screens
        innerState.currentPreviewItem = screen
        innerState.allScreens = [...innerState.allScreens, screen]
        const safeProps = makePropsSafe(
          innerState.components[screen.props._component],
          screen.props
        )
        innerState.currentComponentInfo = safeProps
        screen.props = safeProps

        _savePage(innerState)
        return innerState
      })
    })

  return s
}

const createScreen = store => (screenName, route, layoutComponentName) => {
  store.update(state => {
    const rootComponent = state.components[layoutComponentName]

    const newScreen = {
      description: "",
      url: "",
      _css: "",
      props: createProps(rootComponent).props,
    }
    newScreen.route = route
    newScreen.name = newScreen.props._id
    newScreen.props._instanceName = screenName || ""
    state.currentPreviewItem = newScreen
    state.currentComponentInfo = newScreen.props
    state.currentFrontEndType = "screen"

    _saveScreen(store, state, newScreen)

    return state
  })
}

const setCurrentScreen = store => screenName => {
  store.update(s => {
    const screen = getExactComponent(s.screens, screenName, true)
    s.currentPreviewItem = screen
    s.currentFrontEndType = "screen"
    s.currentView = "detail"
    regenerateCssForCurrentScreen(s)
    const safeProps = makePropsSafe(
      s.components[screen.props._component],
      screen.props
    )
    screen.props = safeProps
    s.currentComponentInfo = safeProps
    setCurrentPageFunctions(s)
    return s
  })
}

const savePage = store => async page => {
  store.update(state => {
    if (state.currentFrontEndType !== "page" || !state.currentPageName) {
      return state
    }

    state.pages[state.currentPageName] = page
    _savePage(state)
    return state
  })
}

const addStylesheet = store => stylesheet => {
  store.update(s => {
    s.pages.stylesheets.push(stylesheet)
    _savePage(s)
    return s
  })
}

const removeStylesheet = store => stylesheet => {
  store.update(state => {
    state.pages.stylesheets = state.pages.stylesheets.filter(
      s => s !== stylesheet
    )
    _savePage(state)
    return state
  })
}

const setCurrentPage = store => pageName => {
  store.update(state => {
    const current_screens = state.pages[pageName]._screens

    const currentPage = state.pages[pageName]

    state.currentFrontEndType = "page"
    state.currentView = "detail"
    state.currentPageName = pageName
    state.screens = Array.isArray(current_screens)
      ? current_screens
      : Object.values(current_screens)
    const safeProps = makePropsSafe(
      state.components[currentPage.props._component],
      currentPage.props
    )
    state.currentComponentInfo = safeProps
    currentPage.props = safeProps
    state.currentPreviewItem = state.pages[pageName]
    regenerateCssForCurrentScreen(state)

    for (let screen of state.screens) {
      screen._css = generate_screen_css([screen.props])
    }

    setCurrentPageFunctions(state)
    return state
  })
}

/**
 * @param  {string} componentToAdd - name of the component to add to the application
 * @param  {string} presetName - name of the component preset if defined
 */
const addChildComponent = store => (componentToAdd, presetProps = {}) => {
  store.update(state => {
    function findSlot(component_array) {
      for (let i = 0; i < component_array.length; i += 1) {
        if (component_array[i]._component === "##builtin/screenslot") {
          return true
        }

        if (component_array[i]._children) findSlot(component_array[i])
      }

      return false
    }

    if (
      componentToAdd.startsWith("##") &&
      findSlot(state.pages[state.currentPageName].props._children)
    ) {
      return state
    }

    const component = getComponentDefinition(state, componentToAdd)

    const instanceId = get(backendUiStore).selectedDatabase._id
    const instanceName = getNewComponentName(componentToAdd, state)

    const newComponent = createProps(
      component,
      {
        ...presetProps,
        _instanceId: instanceId,
        _instanceName: instanceName,
      },
      state
    )

    const currentComponent =
      state.components[state.currentComponentInfo._component]

    const targetParent = currentComponent.children
      ? state.currentComponentInfo
      : getParent(state.currentPreviewItem.props, state.currentComponentInfo)

    targetParent._children = targetParent._children.concat(newComponent.props)

    state.currentFrontEndType === "page"
      ? _savePage(state)
      : _saveScreenApi(state.currentPreviewItem, state)

    state.currentView = "component"
    state.currentComponentInfo = newComponent.props

    return state
  })
}

/**
 * @param  {string} props - props to add, as child of current component
 */

const addTemplatedComponent = store => props => {
  store.update(state => {
    walkProps(props, p => {
      p._id = uuid()
    })
    state.currentComponentInfo._children = state.currentComponentInfo._children.concat(
      props
    )
    regenerateCssForCurrentScreen(state)

    setCurrentPageFunctions(state)
    _saveCurrentPreviewItem(state)

    return state
  })
}

const selectComponent = store => component => {
  store.update(state => {
    return _selectComponent(state, component)
  })
}

const setComponentProp = store => (name, value) => {
  store.update(state => {
    let current_component = state.currentComponentInfo
    current_component[name] = value

    state.currentComponentInfo = current_component
    _saveCurrentPreviewItem(state)
    return state
  })
}

const setPageOrScreenProp = store => (name, value) => {
  store.update(state => {
    if (name === "_instanceName" && state.currentFrontEndType === "screen") {
      state.currentPreviewItem.props[name] = value
    } else {
      state.currentPreviewItem[name] = value
    }
    _saveCurrentPreviewItem(state)
    return state
  })
}

const setComponentStyle = store => (type, name, value) => {
  store.update(state => {
    if (!state.currentComponentInfo._styles) {
      state.currentComponentInfo._styles = {}
    }
    state.currentComponentInfo._styles[type][name] = value

    regenerateCssForCurrentScreen(state)

    // save without messing with the store
    _saveCurrentPreviewItem(state)
    return state
  })
}

const setComponentCode = store => code => {
  store.update(state => {
    state.currentComponentInfo._code = code

    setCurrentPageFunctions(state)
    // save without messing with the store
    _saveScreenApi(state.currentPreviewItem, state)

    return state
  })
}

const setCurrentPageFunctions = s => {
  s.currentPageFunctions = buildPageCode(s.screens, s.pages[s.currentPageName])
  insertCodeMetadata(s.currentPreviewItem.props)
}

const buildPageCode = (screens, page) => buildCodeForScreens([page, ...screens])

const setScreenType = store => type => {
  store.update(state => {
    state.currentFrontEndType = type

    const pageOrScreen =
      type === "page"
        ? state.pages[state.currentPageName]
        : state.pages[state.currentPageName]._screens[0]

    state.currentComponentInfo = pageOrScreen ? pageOrScreen.props : null
    state.currentPreviewItem = pageOrScreen
    state.currentView = "detail"
    return state
  })
}

const editPageOrScreen = store => (key, value, setOnComponent = false) => {
  store.update(state => {
    setOnComponent
      ? (state.currentPreviewItem.props[key] = value)
      : (state.currentPreviewItem[key] = value)
    _saveCurrentPreviewItem(state)

    return state
  })
}

const getPathToComponent = store => component => {
  // Gets all the components to needed to construct a path.
  const tempStore = get(store)
  let pathComponents = []
  let parent = component
  let root = false
  while (!root) {
    parent = getParent(tempStore.currentPreviewItem.props, parent)
    if (!parent) {
      root = true
    } else {
      pathComponents.push(parent)
    }
  }

  // Remove root entry since it's the screen or page layout.
  // Reverse array since we need the correct order of the IDs
  const reversedComponents = pathComponents.reverse().slice(1)

  // Add component
  const allComponents = [...reversedComponents, component]

  // Map IDs
  const IdList = allComponents.map(c => c._id)

  // Construct ID Path:
  const path = IdList.join("/")

  return path
}

const setMetadataProp = store => (name, prop) => {
  store.update(s => {
    s.currentPreviewItem[name] = prop
    return s
  })
}

const storeComponentForCopy = store => (component, cut = false) => {
  store.update(s => {
    const copiedComponent = cloneDeep(component)
    s.componentToPaste = copiedComponent
    s.componentToPaste.isCut = cut
    if (cut) {
      const parent = getParent(s.currentPreviewItem.props, component._id)
      parent._children = parent._children.filter(c => c._id !== component._id)
      selectComponent(s, parent)
    }

    return s
  })
}

const pasteComponent = store => (targetComponent, mode) => {
  store.update(s => {
    if (!s.componentToPaste) return s

    const componentToPaste = cloneDeep(s.componentToPaste)
    // retain the same ids as things may be referencing this component
    if (componentToPaste.isCut) {
      // in case we paste a second time
      s.componentToPaste.isCut = false
    } else {
      generateNewIdsForComponent(componentToPaste, s)
    }
    delete componentToPaste.isCut

    if (mode === "inside") {
      targetComponent._children.push(componentToPaste)
      return s
    }

    const parent = getParent(s.currentPreviewItem.props, targetComponent)

    const targetIndex = parent._children.indexOf(targetComponent)
    const index = mode === "above" ? targetIndex : targetIndex + 1
    parent._children.splice(index, 0, cloneDeep(componentToPaste))
    regenerateCssForCurrentScreen(s)
    _saveCurrentPreviewItem(s)
    selectComponent(s, componentToPaste)

    return s
  })
}
