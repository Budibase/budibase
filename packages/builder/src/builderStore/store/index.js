import { values } from "lodash/fp"
import { backendUiStore } from "builderStore"
import * as backendStoreActions from "./backend"
import { writable, get } from "svelte/store"
import api from "../api"
import { DEFAULT_PAGES_OBJECT } from "../../constants"
import { getExactComponent } from "components/userInterface/pagesParsing/searchComponents"
import { rename } from "components/userInterface/pagesParsing/renameScreen"
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
} from "../storeUtils"

export const getStore = () => {
  const initial = {
    apps: [],
    appname: "",
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

  store.createDatabaseForApp = backendStoreActions.createDatabaseForApp(store)

  store.saveScreen = saveScreen(store)
  store.renameScreen = renameScreen(store)
  store.deleteScreen = deleteScreen(store)
  store.setCurrentScreen = setCurrentScreen(store)
  store.setCurrentPage = setCurrentPage(store)
  store.createScreen = createScreen(store)
  store.addStylesheet = addStylesheet(store)
  store.removeStylesheet = removeStylesheet(store)
  store.savePage = savePage(store)
  store.addChildComponent = addChildComponent(store)
  store.selectComponent = selectComponent(store)
  store.setComponentProp = setComponentProp(store)
  store.setComponentStyle = setComponentStyle(store)
  store.setComponentCode = setComponentCode(store)
  store.setScreenType = setScreenType(store)
  store.getPathToComponent = getPathToComponent(store)
  store.addTemplatedComponent = addTemplatedComponent(store)
  store.setMetadataProp = setMetadataProp(store)
  return store
}

export default getStore

export const getComponentDefinition = (state, name) =>
  name.startsWith("##") ? getBuiltin(name) : state.components[name]

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
  initial.appname = pkg.application.name
  initial.appId = pkg.application._id
  initial.pages = pkg.pages
  initial.hasAppPackage = true
  initial.screens = values(pkg.screens)
  initial.builtins = [getBuiltin("##builtin/screenslot")]
  initial.appInstances = pkg.application.instances
  initial.appId = pkg.application._id

  store.set(initial)
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
      name: screenName || "",
      description: "",
      url: "",
      _css: "",
      uiFunctions: "",
      props: createProps(rootComponent).props,
    }

    newScreen.route = route
    state.currentPreviewItem = newScreen
    state.currentComponentInfo = newScreen.props
    state.currentFrontEndType = "screen"

    _saveScreen(store, state, newScreen)

    return state
  })
}

const setCurrentScreen = store => screenName => {
  store.update(s => {
    const screen = getExactComponent(s.screens, screenName)
    screen._css = generate_screen_css([screen.props])
    s.currentPreviewItem = screen
    s.currentFrontEndType = "screen"
    s.currentView = "detail"

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

const deleteScreen = store => name => {
  store.update(s => {
    const components = s.components.filter(c => c.name !== name)
    const screens = s.screens.filter(c => c.name !== name)

    s.components = components
    s.screens = screens
    if (s.currentPreviewItem.name === name) {
      s.currentPreviewItem = null
      s.currentFrontEndType = ""
    }

    api.delete(`/_builder/api/${s.appId}/screen/${name}`)

    return s
  })
}

const renameScreen = store => (oldname, newname) => {
  store.update(s => {
    const { screens, pages, error, changedScreens } = rename(
      s.pages,
      s.screens,
      oldname,
      newname
    )

    if (error) {
      // should really do something with this
      return s
    }

    s.screens = screens
    s.pages = pages
    if (s.currentPreviewItem.name === oldname)
      s.currentPreviewItem.name = newname

    const saveAllChanged = async () => {
      for (let screenName of changedScreens) {
        const changedScreen = getExactComponent(screens, screenName)
        await api.post(`/_builder/api/${s.appId}/screen`, changedScreen)
      }
    }

    api
      .patch(`/_builder/api/${s.appId}/screen`, {
        oldname,
        newname,
      })
      .then(() => saveAllChanged())
      .then(() => {
        _savePage(s)
      })

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
    state.currentPreviewItem._css = generate_screen_css([
      state.currentPreviewItem.props,
    ])

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
const addChildComponent = store => (componentToAdd, presetName) => {
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

    const presetProps = presetName ? component.presets[presetName] : {}

    const instanceId = get(backendUiStore).selectedDatabase._id

    const newComponent = createProps(
      component,
      {
        ...presetProps,
        _instanceId: instanceId,
      },
      state
    )

    state.currentComponentInfo._children = state.currentComponentInfo._children.concat(
      newComponent.props
    )

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
    state.currentPreviewItem._css = generate_screen_css([
      state.currentPreviewItem.props,
    ])

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
    const current_component = state.currentComponentInfo
    state.currentComponentInfo[name] = value

    _saveCurrentPreviewItem(state)

    state.currentComponentInfo = current_component
    return state
  })
}

const setComponentStyle = store => (type, name, value) => {
  store.update(state => {
    if (!state.currentComponentInfo._styles) {
      state.currentComponentInfo._styles = {}
    }
    state.currentComponentInfo._styles[type][name] = value

    state.currentPreviewItem._css = generate_screen_css([
      state.currentPreviewItem.props,
    ])

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
