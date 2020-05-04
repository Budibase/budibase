import { filter, cloneDeep, values } from "lodash/fp"
import { pipe } from "components/common/core"
import * as backendStoreActions from "./backend"
import { writable } from "svelte/store"
import api from "../api"
import { 
  DEFAULT_PAGES_OBJECT
} from "../../constants";
import { getExactComponent } from "components/userInterface/pagesParsing/searchComponents"
import { rename } from "components/userInterface/pagesParsing/renameScreen"
import {
  createProps,
  makePropsSafe,
  getBuiltin,
} from "components/userInterface/pagesParsing/createProps"
import { 
  fetchComponentLibModules, 
  fetchComponentLibDefinitions 
} from "../loadComponentLibraries"
import { buildCodeForScreens } from "../buildCodeForScreens"
import { generate_screen_css } from "../generate_css"
import { insertCodeMetadata } from "../insertCodeMetadata"
import { uuid } from "../uuid"

export const getStore = () => {
  const initial = {
    apps: [],
    appname: "",
    hierarchy: {},
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
    appId: ""
  }

  const store = writable(initial)

  store.setPackage = setPackage(store, initial)

  // store.saveLevel = backendStoreActions.saveLevel(store)
  // store.deleteLevel = backendStoreActions.deleteLevel(store)
  store.createDatabaseForApp = backendStoreActions.createDatabaseForApp(store)
  // store.saveAction = backendStoreActions.saveAction(store)
  // store.deleteAction = backendStoreActions.deleteAction(store)
  // store.saveTrigger = backendStoreActions.saveTrigger(store)
  // store.deleteTrigger = backendStoreActions.deleteTrigger(store)
  // store.importAppDefinition = importAppDefinition(store)

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
  store.deleteComponent = deleteComponent(store)
  store.moveUpComponent = moveUpComponent(store)
  store.moveDownComponent = moveDownComponent(store)
  store.copyComponent = copyComponent(store)
  store.addTemplatedComponent = addTemplatedComponent(store)
  store.setMetadataProp = setMetadataProp(store)
  return store
}

export default getStore

const setPackage = (store, initial) => async (pkg) => {

  const [main_screens, unauth_screens] = await Promise.all([
    api.get(`/_builder/api/${pkg.application._id}/pages/main/screens`).then(r => r.json()),
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

  initial.libraries = await fetchComponentLibModules(pkg.application)
  // TODO: Rename to componentDefinitions
  initial.components = await fetchComponentLibDefinitions(pkg.clientId, pkg.application._id); 
  initial.loadLibraryUrls = pageName => {
    const libs = libUrlsForPreview(pkg, pageName)
    return libs
  }
  initial.appname = pkg.application.name
  initial.appId = pkg.application._id
  initial.pages = pkg.pages
  initial.hasAppPackage = true
  initial.screens = values(pkg.screens)
  // initial.templates = pkg.components.templates
  initial.builtins = [getBuiltin("##builtin/screenslot")]
  initial.appInstances = pkg.application.instances
  initial.appId = pkg.application._id

  store.set(initial)
  console.log(initial)
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
    .post(
      `/_builder/api/${s.appId}/pages/${s.currentPageName}/screen`,
      screen
    )
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

const _saveScreenApi = (screen, s) =>
  api
    .post(
      `/_builder/api/${s.appId}/pages/${s.currentPageName}/screen`,
      screen
    )
    .then(() => _savePage(s))

const createScreen = store => (screenName, route, layoutComponentName) => {
  store.update(state => {
    console.log(layoutComponentName);
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
    const components = pipe(s.components, [filter(c => c.name !== name)])

    const screens = pipe(s.screens, [filter(c => c.name !== name)])

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
  store.update(s => {
    if (s.currentFrontEndType !== "page" || !s.currentPageName) {
      return s
    }

    s.pages[s.currentPageName] = page
    _savePage(s)
    return s
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
    state.pages.stylesheets = s.pages.stylesheets.filter(s => s !== stylesheet)
    _savePage(state)
    return state
  })
}

const _savePage = async s => {
  const page = s.pages[s.currentPageName]

  await api.post(`/_builder/api/${s.appId}/pages/${s.currentPageName}`, {
    page: { componentLibraries: s.pages.componentLibraries, ...page },
    uiFunctions: s.currentPageFunctions,
    screens: page._screens,
  })
}

const setCurrentPage = store => pageName => {
  store.update(state => {
    const current_screens = state.pages[pageName]._screens

    const currentPage = state.pages[pageName];

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

// const getComponentDefinition = (components, name) => components.find(c => c.name === name)

/**
 * @param  {string} componentToAdd - name of the component to add to the application
 * @param  {string} presetName - name of the component preset if defined
 */
const addChildComponent = store => (componentToAdd, presetName) => {
  // componentToAdd looks like: @budibase/standard-components/container
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

    const component = componentToAdd.startsWith("##")
      ? getBuiltin(componentToAdd)
      : state.components[componentToAdd]

    const presetProps = presetName ? component.presets[presetName] : {}
    const newComponent = createProps(component, presetProps)

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
    const componentDef = component._component.startsWith("##")
      ? component
      : state.components[component._component]
    state.currentComponentInfo = makePropsSafe(componentDef, component)
    state.currentView = "component"
    return state
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

    return s
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

const deleteComponent = store => componentName => {
  store.update(state => {
    const parent = getParent(state.currentPreviewItem.props, componentName)

    if (parent) {
      parent._children = parent._children.filter(component => component !== componentName)
    }

    _saveCurrentPreviewItem(state)

    return state
  })
}

const moveUpComponent = store => component => {
  store.update(s => {
    const parent = getParent(s.currentPreviewItem.props, component)

    if (parent) {
      const currentIndex = parent._children.indexOf(component)
      if (currentIndex === 0) return s

      const newChildren = parent._children.filter(c => c !== component)
      newChildren.splice(currentIndex - 1, 0, component)
      parent._children = newChildren
    }
    s.currentComponentInfo = component
    _saveCurrentPreviewItem(s)

    return s
  })
}

const moveDownComponent = store => component => {
  store.update(s => {
    const parent = getParent(s.currentPreviewItem.props, component)

    if (parent) {
      const currentIndex = parent._children.indexOf(component)
      if (currentIndex === parent._children.length - 1) return s

      const newChildren = parent._children.filter(c => c !== component)
      newChildren.splice(currentIndex + 1, 0, component)
      parent._children = newChildren
    }
    s.currentComponentInfo = component
    _saveCurrentPreviewItem(s)

    return s
  })
}

const copyComponent = store => component => {
  store.update(s => {
    const parent = getParent(s.currentPreviewItem.props, component)
    const copiedComponent = cloneDeep(component)
    walkProps(copiedComponent, p => {
      p._id = uuid()
    })
    parent._children = [...parent._children, copiedComponent]
    s.curren
    _saveCurrentPreviewItem(s)
    s.currentComponentInfo = copiedComponent
    return s
  })
}

const getParent = (rootProps, child) => {
  let parent
  walkProps(rootProps, (p, breakWalk) => {
    if (p._children && p._children.includes(child)) {
      parent = p
      breakWalk()
    }
  })
  return parent
}

const walkProps = (props, action, cancelToken = null) => {
  cancelToken = cancelToken || { cancelled: false }
  action(props, () => {
    cancelToken.cancelled = true
  })

  if (props._children) {
    for (let child of props._children) {
      if (cancelToken.cancelled) return
      walkProps(child, action, cancelToken)
    }
  }
}

const setMetadataProp = store => (name, prop) => {
  store.update(s => {
    s.currentPreviewItem[name] = prop
    return s
  })
}

const _saveCurrentPreviewItem = s =>
  s.currentFrontEndType === "page"
    ? _savePage(s)
    : _saveScreenApi(s.currentPreviewItem, s)
