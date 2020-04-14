//
import { filter, cloneDeep, last, concat, isEmpty, values } from "lodash/fp"
import { pipe, getNode, constructHierarchy } from "components/common/core"
import * as backendStoreActions from "./backend"
import { writable } from "svelte/store"
import { defaultPagesObject } from "components/userInterface/pagesParsing/defaultPagesObject"
import api from "../api"
import { getExactComponent } from "components/userInterface/pagesParsing/searchComponents"
import { rename } from "components/userInterface/pagesParsing/renameScreen"
import {
  getNewScreen,
  createProps,
  makePropsSafe,
  getBuiltin,
} from "components/userInterface/pagesParsing/createProps"
import { expandComponentDefinition } from "components/userInterface/pagesParsing/types"
import { loadLibs, libUrlsForPreview } from "../loadComponentLibraries"
import { buildCodeForScreens } from "../buildCodeForScreens"
import { generate_screen_css } from "../generate_css"
import { insertCodeMetadata } from "../insertCodeMetadata"
import { uuid } from "../uuid"

let appname = ""

export const getStore = () => {
  const initial = {
    apps: [],
    appname: "",
    hierarchy: {},
    actions: [],
    triggers: [],
    pages: defaultPagesObject(),
    mainUi: {},
    unauthenticatedUi: {},
    components: [],
    currentPreviewItem: null,
    currentComponentInfo: null,
    currentFrontEndType: "none",
    currentPageName: "",
    currentComponentProps: null,
    currentNodeIsNew: false,
    errors: [],
    hasAppPackage: false,
    accessLevels: { version: 0, levels: [] },
    currentNode: null,
    libraries: null,
    showSettings: false,
    useAnalytics: true
  }

  const store = writable(initial)

  store.setPackage = setPackage(store, initial)

  store.newChildModel = backendStoreActions.newModel(store, false)
  store.newRootModel = backendStoreActions.newModel(store, true)
  store.selectExistingNode = backendStoreActions.selectExistingNode(store)
  store.newChildIndex = backendStoreActions.newIndex(store, false)
  store.newRootIndex = backendStoreActions.newIndex(store, true)
  store.saveCurrentNode = backendStoreActions.saveCurrentNode(store)
  store.deleteCurrentNode = backendStoreActions.deleteCurrentNode(store)
  store.saveField = backendStoreActions.saveField(store)
  store.deleteField = backendStoreActions.deleteField(store)
  store.saveLevel = backendStoreActions.saveLevel(store)
  store.deleteLevel = backendStoreActions.deleteLevel(store)
  store.createDatabaseForApp = backendStoreActions.createDatabaseForApp(store)
  store.saveAction = backendStoreActions.saveAction(store)
  store.deleteAction = backendStoreActions.deleteAction(store)
  store.saveTrigger = backendStoreActions.saveTrigger(store)
  store.deleteTrigger = backendStoreActions.deleteTrigger(store)
  store.importAppDefinition = importAppDefinition(store)

  store.saveScreen = saveScreen(store)
  store.addComponentLibrary = addComponentLibrary(store)
  store.renameScreen = renameScreen(store)
  store.deleteScreen = deleteScreen(store)
  store.setCurrentScreen = setCurrentScreen(store)
  store.setCurrentPage = setCurrentPage(store)
  store.createScreen = createScreen(store)
  store.removeComponentLibrary = removeComponentLibrary(store)
  store.addStylesheet = addStylesheet(store)
  store.removeStylesheet = removeStylesheet(store)
  store.savePage = savePage(store)
  store.showSettings = showSettings(store)
  store.useAnalytics = useAnalytics(store)
  store.createGeneratedComponents = createGeneratedComponents(store)
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
    api.get(`/_builder/api/${pkg.application.name}/pages/main/screens`).then(r => r.json()),
    api
      .get(`/_builder/api/${pkg.application.name}/pages/unauthenticated/screens`)
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

  initial.libraries = await loadLibs(pkg.application.name, pkg)
  initial.loadLibraryUrls = pageName => {
    const libs = libUrlsForPreview(pkg, pageName)
    return libs
  }
  initial.appname = pkg.application.name
  initial.pages = pkg.pages
  initial.hasAppPackage = true
  initial.hierarchy = pkg.appDefinition.hierarchy
  initial.accessLevels = pkg.accessLevels
  initial.screens = values(pkg.screens)
  initial.components = values(pkg.components.components).map(
    expandComponentDefinition
  )
  initial.templates = pkg.components.templates
  initial.builtins = [getBuiltin("##builtin/screenslot")]
  initial.actions = values(pkg.appDefinition.actions)
  initial.triggers = pkg.appDefinition.triggers
  initial.appInstances = pkg.application.instances
  initial.appId = pkg.application.id

  if (!!initial.hierarchy && !isEmpty(initial.hierarchy)) {
    initial.hierarchy = constructHierarchy(initial.hierarchy)
    const shadowHierarchy = createShadowHierarchy(initial.hierarchy)
    if (initial.currentNode !== null) {
      initial.currentNode = getNode(shadowHierarchy, initial.currentNode.nodeId)
    }
  }

  store.set(initial)
  return initial
}

const showSettings = store => () => {
  store.update(state => {
    state.showSettings = !state.showSettings
    return state
  })
}

const useAnalytics = store => () => {
  store.update(state => {
    state.useAnalytics = !state.useAnalytics
    return state
  })
}

const importAppDefinition = store => appDefinition => {
  store.update(s => {
    s.hierarchy = appDefinition.hierarchy
    s.currentNode =
      appDefinition.hierarchy.children.length > 0
        ? appDefinition.hierarchy.children[0]
        : null
    s.actions = appDefinition.actions
    s.triggers = appDefinition.triggers
    s.currentNodeIsNew = false
    return s
  })
}

const createShadowHierarchy = hierarchy =>
  constructHierarchy(JSON.parse(JSON.stringify(hierarchy)))

const saveScreen = store => screen => {
  store.update(s => {
    return _saveScreen(store, s, screen)
  })
}

const _saveScreen = async (store, s, screen) => {
  const currentPageScreens = s.pages[s.currentPageName]._screens

  await api
    .post(
      `/_builder/api/${s.appname}/pages/${s.currentPageName}/screen`,
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
          getComponentDefinition(
            innerState.components,
            screen.props._component
          ),
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
      `/_builder/api/${s.appname}/pages/${s.currentPageName}/screen`,
      screen
    )
    .then(() => _savePage(s))

const createScreen = store => (screenName, route, layoutComponentName) => {
  store.update(s => {
    const newScreen = getNewScreen(
      s.components,
      layoutComponentName,
      screenName
    )

    newScreen.route = route
    s.currentPreviewItem = newScreen
    s.currentComponentInfo = newScreen.props
    s.currentFrontEndType = "screen"

    _saveScreen(store, s, newScreen)

    return s
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
      getComponentDefinition(s.components, screen.props._component),
      screen.props
    )
    screen.props = safeProps
    s.currentComponentInfo = safeProps
    setCurrentPageFunctions(s)
    return s
  })
}

const createGeneratedComponents = store => components => {
  store.update(s => {
    s.components = [...s.components, ...components]
    s.screens = [...s.screens, ...components]

    const doCreate = async () => {
      for (let c of components) {
        await api.post(`/_builder/api/${s.appname}/screen`, c)
      }

      await _savePage(s)
    }

    doCreate()

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

    api.delete(`/_builder/api/${s.appname}/screen/${name}`)

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
        await api.post(`/_builder/api/${s.appname}/screen`, changedScreen)
      }
    }

    api
      .patch(`/_builder/api/${s.appname}/screen`, {
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

const addComponentLibrary = store => async lib => {
  const response = await api.get(
    `/_builder/api/${s.appname}/componentlibrary?lib=${encodeURI(lib)}`,
    undefined,
    false
  )

  const success = response.status === 200

  const components = success ? await response.json() : []

  store.update(s => {
    if (success) {
      const componentsArray = []
      for (let c in components) {
        componentsArray.push(expandComponentDefinition(components[c]))
      }

      s.components = pipe(s.components, [
        filter(c => !c.name.startsWith(`${lib}/`)),
        concat(componentsArray),
      ])

      s.pages.componentLibraries.push(lib)
      _savePage(s)
    }

    return s
  })
}

const removeComponentLibrary = store => lib => {
  store.update(s => {
    s.pages.componentLibraries = filter(l => l !== lib)(
      s.pages.componentLibraries
    )
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
  store.update(s => {
    s.pages.stylesheets = filter(s => s !== stylesheet)(s.pages.stylesheets)
    _savePage(s)
    return s
  })
}

const _savePage = async s => {
  const page = s.pages[s.currentPageName]

  await api.post(`/_builder/api/${s.appname}/pages/${s.currentPageName}`, {
    page: { componentLibraries: s.pages.componentLibraries, ...page },
    uiFunctions: s.currentPageFunctions,
    screens: page._screens,
  })
}

const setCurrentPage = store => pageName => {
  store.update(s => {
    const current_screens = s.pages[pageName]._screens

    s.currentFrontEndType = "page"
    s.currentPageName = pageName
    s.screens = Array.isArray(current_screens)
      ? current_screens
      : Object.values(current_screens)
    const safeProps = makePropsSafe(
      getComponentDefinition(s.components, s.pages[pageName].props._component),
      s.pages[pageName].props
    )
    s.currentComponentInfo = safeProps
    s.pages[pageName].props = safeProps
    s.currentPreviewItem = s.pages[pageName]
    s.currentPreviewItem._css = generate_screen_css([
      s.currentPreviewItem.props,
    ])

    for (let screen of s.screens) {
      screen._css = generate_screen_css([screen.props])
    }

    setCurrentPageFunctions(s)
    return s
  })
}

const getComponentDefinition = (components, name) =>
  components.find(c => c.name === name)

/**
 * @param  {string} componentToAdd - name of the component to add to the application
 * @param  {string} presetName - name of the component preset if defined
 */
const addChildComponent = store => (componentToAdd, presetName) => {
  store.update(state => {
    function findSlot(component_array) {
      for (let i = 0; i < component_array.length; i += 1) {
        if (component_array[i]._component === "##builtin/screenslot")
          return true
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
      : state.components.find(({ name }) => name === componentToAdd)

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
      : state.components.find(c => c.name === component._component)
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
  store.update(s => {
    if (!s.currentComponentInfo._styles) {
      s.currentComponentInfo._styles = {}
    }
    s.currentComponentInfo._styles[type][name] = value
    s.currentPreviewItem._css = generate_screen_css([
      s.currentPreviewItem.props,
    ])

    // save without messing with the store
    _saveCurrentPreviewItem(s)
    return s
  })
}

const setComponentCode = store => code => {
  store.update(s => {
    s.currentComponentInfo._code = code

    setCurrentPageFunctions(s)
    // save without messing with the store
    _saveScreenApi(s.currentPreviewItem, s)

    return s
  })
}

const setCurrentPageFunctions = s => {
  s.currentPageFunctions = buildPageCode(s.screens, s.pages[s.currentPageName])
  insertCodeMetadata(s.currentPreviewItem.props)
}

const buildPageCode = (screens, page) => buildCodeForScreens([page, ...screens])

const setScreenType = store => type => {
  store.update(s => {
    s.currentFrontEndType = type

    const pageOrScreen =
      type === "page"
        ? s.pages[s.currentPageName]
        : s.pages[s.currentPageName]._screens[0]

    s.currentComponentInfo = pageOrScreen ? pageOrScreen.props : null
    s.currentPreviewItem = pageOrScreen
    return s
  })
}

const deleteComponent = store => component => {
  store.update(s => {
    const parent = getParent(s.currentPreviewItem.props, component)

    if (parent) {
      parent._children = parent._children.filter(c => c !== component)
    }

    _saveCurrentPreviewItem(s)

    return s
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
