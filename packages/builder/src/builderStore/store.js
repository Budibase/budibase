import { hierarchy as hierarchyFunctions } from "../../../core/src"
import {
  filter,
  cloneDeep,
  sortBy,
  map,
  last,
  concat,
  find,
  isEmpty,
  values,
} from "lodash/fp"
import {
  pipe,
  getNode,
  validate,
  constructHierarchy,
  templateApi,
} from "../common/core"
import { writable } from "svelte/store"
import { defaultPagesObject } from "../userInterface/pagesParsing/defaultPagesObject"
import api from "./api"
import { getExactComponent } from "../userInterface/pagesParsing/searchComponents"
import { rename } from "../userInterface/pagesParsing/renameScreen"
import {
  getNewScreen,
  createProps,
  makePropsSafe,
  getBuiltin,
} from "../userInterface/pagesParsing/createProps"
import { expandComponentDefinition } from "../userInterface/pagesParsing/types"
import { loadLibs, loadLibUrls } from "./loadComponentLibraries"
import { buildCodeForScreens } from "./buildCodeForScreens"
import { generate_screen_css } from "./generate_css"
import { insertCodeMetadata } from "./insertCodeMetadata"
import { uuid } from "./uuid"

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
    activeNav: "database",
    isBackend: true,
    hasAppPackage: false,
    accessLevels: { version: 0, levels: [] },
    currentNode: null,
    libraries: null,
    showSettings: false,
    useAnalytics: true,
  }

  const store = writable(initial)

  store.initialise = initialise(store, initial)
  store.newChildRecord = newRecord(store, false)
  store.newRootRecord = newRecord(store, true)
  store.selectExistingNode = selectExistingNode(store)
  store.newChildIndex = newIndex(store, false)
  store.newRootIndex = newIndex(store, true)
  store.saveCurrentNode = saveCurrentNode(store)
  store.importAppDefinition = importAppDefinition(store)
  store.deleteCurrentNode = deleteCurrentNode(store)
  store.saveField = saveField(store)
  store.deleteField = deleteField(store)
  store.saveAction = saveAction(store)
  store.deleteAction = deleteAction(store)
  store.saveTrigger = saveTrigger(store)
  store.deleteTrigger = deleteTrigger(store)
  store.saveLevel = saveLevel(store)
  store.deleteLevel = deleteLevel(store)
  store.setActiveNav = setActiveNav(store)
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
  store.showFrontend = showFrontend(store)
  store.showBackend = showBackend(store)
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
  return store
}

export default getStore

const initialise = (store, initial) => async () => {
  appname = window.location.hash
    ? last(window.location.hash.substr(1).split("/"))
    : ""

  if (!appname) {
    initial.apps = await api.get(`/_builder/api/apps`).then(r => r.json())
    initial.hasAppPackage = false
    store.set(initial)
    return initial
  }

  const pkg = await api
    .get(`/_builder/api/${appname}/appPackage`)
    .then(r => r.json())

  const [main_screens, unauth_screens] = await Promise.all([
    api.get(`/_builder/api/${appname}/pages/main/screens`).then(r => r.json()),
    api
      .get(`/_builder/api/${appname}/pages/unauthenticated/screens`)
      .then(r => r.json()),
  ])

  pkg.pages = {
    componentLibraries: ["@budibase/standard-components"],
    stylesheets: [],
    main: {
      ...pkg.pages.main,
      _screens: Object.values(main_screens),
    },
    unauthenticated: {
      ...pkg.pages.unauthenticated,
      _screens: Object.values(unauth_screens),
    },
  }

  initial.libraries = await loadLibs(appname, pkg)
  initial.loadLibraryUrls = () => loadLibUrls(appname, pkg)
  initial.appname = appname
  initial.pages = pkg.pages
  initial.hasAppPackage = true
  initial.hierarchy = pkg.appDefinition.hierarchy
  initial.accessLevels = pkg.accessLevels
  initial.screens = values(pkg.screens)
  initial.components = values(pkg.components.components).map(
    expandComponentDefinition
  )
  initial.builtins = [getBuiltin("##builtin/screenslot")]
  initial.actions = values(pkg.appDefinition.actions)
  initial.triggers = pkg.appDefinition.triggers

  if (!!initial.hierarchy && !isEmpty(initial.hierarchy)) {
    initial.hierarchy = constructHierarchy(initial.hierarchy)
    const shadowHierarchy = createShadowHierarchy(initial.hierarchy)
    if (initial.currentNode !== null)
      initial.currentNode = getNode(shadowHierarchy, initial.currentNode.nodeId)
  }

  store.set(initial)
  return initial
}

const showSettings = store => () => {
  store.update(s => {
    s.showSettings = !s.showSettings
    return s
  })
}

const useAnalytics = store => () => {
  store.update(s => {
    s.useAnalytics = !s.useAnalytics
    return s
  })
}

const showBackend = store => () => {
  store.update(s => {
    s.isBackend = true
    return s
  })
}

const showFrontend = store => () => {
  store.update(s => {
    s.isBackend = false
    return s
  })
}

const newRecord = (store, useRoot) => () => {
  store.update(s => {
    s.currentNodeIsNew = true
    const shadowHierarchy = createShadowHierarchy(s.hierarchy)
    const parent = useRoot
      ? shadowHierarchy
      : getNode(shadowHierarchy, s.currentNode.nodeId)
    s.errors = []
    s.currentNode = templateApi(shadowHierarchy).getNewRecordTemplate(
      parent,
      "",
      true
    )
    return s
  })
}

const selectExistingNode = store => nodeId => {
  store.update(s => {
    const shadowHierarchy = createShadowHierarchy(s.hierarchy)
    s.currentNode = getNode(shadowHierarchy, nodeId)
    s.currentNodeIsNew = false
    s.errors = []
    s.activeNav = "database"
    return s
  })
}

const newIndex = (store, useRoot) => () => {
  store.update(s => {
    s.currentNodeIsNew = true
    s.errors = []
    const shadowHierarchy = createShadowHierarchy(s.hierarchy)
    const parent = useRoot
      ? shadowHierarchy
      : getNode(shadowHierarchy, s.currentNode.nodeId)

    s.currentNode = templateApi(shadowHierarchy).getNewIndexTemplate(parent)
    return s
  })
}

const saveCurrentNode = store => () => {
  store.update(s => {
    const errors = validate.node(s.currentNode)
    s.errors = errors
    if (errors.length > 0) {
      return s
    }

    const parentNode = getNode(s.hierarchy, s.currentNode.parent().nodeId)

    const existingNode = getNode(s.hierarchy, s.currentNode.nodeId)

    let index = parentNode.children.length
    if (existingNode) {
      // remove existing
      index = existingNode.parent().children.indexOf(existingNode)
      existingNode.parent().children = pipe(existingNode.parent().children, [
        filter(c => c.nodeId !== existingNode.nodeId),
      ])
    }

    // should add node into existing hierarchy
    const cloned = cloneDeep(s.currentNode)
    templateApi(s.hierarchy).constructNode(parentNode, cloned)

    const newIndexOfchild = child => {
      if (child === cloned) return index
      const currentIndex = parentNode.children.indexOf(child)
      return currentIndex >= index ? currentIndex + 1 : currentIndex
    }

    parentNode.children = pipe(parentNode.children, [sortBy(newIndexOfchild)])

    if (!existingNode && s.currentNode.type === "record") {
      const defaultIndex = templateApi(s.hierarchy).getNewIndexTemplate(
        cloned.parent()
      )
      defaultIndex.name = `all_${cloned.collectionName}`
      defaultIndex.allowedRecordNodeIds = [cloned.nodeId]
    }

    s.currentNodeIsNew = false

    saveBackend(s)

    return s
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

const deleteCurrentNode = store => () => {
  store.update(s => {
    const nodeToDelete = getNode(s.hierarchy, s.currentNode.nodeId)
    s.currentNode = hierarchyFunctions.isRoot(nodeToDelete.parent())
      ? find(n => n != s.currentNode)(s.hierarchy.children)
      : nodeToDelete.parent()
    if (hierarchyFunctions.isRecord(nodeToDelete)) {
      nodeToDelete.parent().children = filter(
        c => c.nodeId !== nodeToDelete.nodeId
      )(nodeToDelete.parent().children)
    } else {
      nodeToDelete.parent().indexes = filter(
        c => c.nodeId !== nodeToDelete.nodeId
      )(nodeToDelete.parent().indexes)
    }
    s.errors = []
    saveBackend(s)
    return s
  })
}

const saveField = databaseStore => field => {
  databaseStore.update(db => {
    db.currentNode.fields = filter(f => f.name !== field.name)(
      db.currentNode.fields
    )

    templateApi(db.hierarchy).addField(db.currentNode, field)
    return db
  })
}

const deleteField = databaseStore => field => {
  databaseStore.update(db => {
    db.currentNode.fields = filter(f => f.name !== field.name)(
      db.currentNode.fields
    )

    return db
  })
}

const saveAction = store => (newAction, isNew, oldAction = null) => {
  store.update(s => {
    const existingAction = isNew
      ? null
      : find(a => a.name === oldAction.name)(s.actions)

    if (existingAction) {
      s.actions = pipe(s.actions, [
        map(a => (a === existingAction ? newAction : a)),
      ])
    } else {
      s.actions.push(newAction)
    }
    saveBackend(s)
    return s
  })
}

const deleteAction = store => action => {
  store.update(s => {
    s.actions = filter(a => a.name !== action.name)(s.actions)
    saveBackend(s)
    return s
  })
}

const saveTrigger = store => (newTrigger, isNew, oldTrigger = null) => {
  store.update(s => {
    const existingTrigger = isNew
      ? null
      : find(a => a.name === oldTrigger.name)(s.triggers)

    if (existingTrigger) {
      s.triggers = pipe(s.triggers, [
        map(a => (a === existingTrigger ? newTrigger : a)),
      ])
    } else {
      s.triggers.push(newTrigger)
    }
    saveBackend(s)
    return s
  })
}

const deleteTrigger = store => trigger => {
  store.update(s => {
    s.triggers = filter(t => t.name !== trigger.name)(s.triggers)
    return s
  })
}

const incrementAccessLevelsVersion = s =>
  (s.accessLevels.version = (s.accessLevels.version || 0) + 1)

const saveLevel = store => (newLevel, isNew, oldLevel = null) => {
  store.update(s => {
    const levels = s.accessLevels.levels

    const existingLevel = isNew
      ? null
      : find(a => a.name === oldLevel.name)(levels)

    if (existingLevel) {
      s.accessLevels.levels = pipe(levels, [
        map(a => (a === existingLevel ? newLevel : a)),
      ])
    } else {
      s.accessLevels.levels.push(newLevel)
    }

    incrementAccessLevelsVersion(s)

    saveBackend(s)
    return s
  })
}

const deleteLevel = store => level => {
  store.update(s => {
    s.accessLevels.levels = filter(t => t.name !== level.name)(
      s.accessLevels.levels
    )
    incrementAccessLevelsVersion(s)
    saveBackend(s)
    return s
  })
}

const setActiveNav = store => navName => {
  store.update(s => {
    s.activeNav = navName
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
    .then(async savedScreen => {
      const updatedScreen = await savedScreen.json()
      const screens = [
        ...currentPageScreens.filter(
          storeScreen => storeScreen.name !== updatedScreen.name
        ),
        updatedScreen,
      ]
      s.pages[s.currentPageName]._screens = screens
      s.screens = screens
      _savePage(s)
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

    return _saveScreen(store, s, newScreen)
  })
}

const setCurrentScreen = store => screenName => {
  store.update(s => {
    const screen = getExactComponent(s.screens, screenName)

    s.currentPreviewItem = screen
    s.currentFrontEndType = "screen"

    s.currentComponentInfo = makePropsSafe(
      getContainerComponent(s.components),
      screen.props
    )

    setCurrentScreenFunctions(s)
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
    `/_builder/api/${appname}/componentlibrary?lib=${encodeURI(lib)}`,
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

  await api.post(`/_builder/api/${appname}/pages/${s.currentPageName}`, {
    page: { componentLibraries: s.pages.componentLibraries, ...page },
    uiFunctions: "{'1234':() => 'test return'}",
    screens: page._screens,
  })
}

const saveBackend = async s => {
  await api.post(`/_builder/api/${appname}/backend`, {
    appDefinition: {
      hierarchy: s.hierarchy,
      actions: s.actions,
      triggers: s.triggers,
    },
    accessLevels: s.accessLevels,
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
    s.currentComponentInfo = makePropsSafe(
      getContainerComponent(s.components),
      s.pages[pageName].props
    )
    s.currentPreviewItem = s.pages[pageName]

    setCurrentScreenFunctions(s)
    return s
  })
}

const getContainerComponent = components =>
  components.find(c => c.name === "@budibase/standard-components/container")

/**
 * @param  {string} componentToAdd - name of the component to add to the application
 * @param  {string} presetName - name of the component preset if defined
 */
const addChildComponent = store => (componentToAdd, presetName) => {
  store.update(state => {
    const component = componentToAdd.startsWith("##")
      ? getBuiltin(componentToAdd)
      : state.components.find(({ name }) => name === componentToAdd)
    const presetProps = presetName ? component.presets[presetName] : {}
    const newComponent = createProps(component, presetProps)

    state.currentComponentInfo._children = state.currentComponentInfo._children.concat(
      newComponent.props
    )

    _savePage(state)

    return state
  })
}

const selectComponent = store => component => {
  store.update(s => {
    const componentDef = component._component.startsWith("##")
      ? component
      : s.components.find(c => c.name === component._component)
    s.currentComponentInfo = makePropsSafe(componentDef, component)
    return s
  })
}

const setComponentProp = store => (name, value) => {
  store.update(s => {
    const current_component = s.currentComponentInfo
    s.currentComponentInfo[name] = value

    if (s.currentFrontEndType) {
      _savePage(s)
    } else {
      _saveScreen(store, s, s.currentPreviewItem)
    }

    s.currentComponentInfo = current_component
    return s
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
    s.currentFrontEndType === "page"
      ? _savePage(s)
      : _saveScreenApi(s.currentPreviewItem, s)
    return s
  })
}

const setComponentCode = store => code => {
  store.update(s => {
    s.currentComponentInfo._code = code

    setCurrentScreenFunctions(s)
    // save without messing with the store
    _saveScreenApi(s.currentPreviewItem, s)

    return s
  })
}

const setCurrentScreenFunctions = s => {
  s.currentScreenFunctions =
    s.currentPreviewItem === "screen"
      ? buildCodeForScreens([s.currentPreviewItem])
      : "({});"

  insertCodeMetadata(s.currentPreviewItem.props)
}

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

    s.currentFrontEndType === "page"
      ? _savePage(s)
      : _saveScreenApi(s.currentPreviewItem, s)

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
    s.currentFrontEndType === "page"
      ? _savePage(s)
      : _saveScreenApi(s.currentPreviewItem, s)

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
    s.currentFrontEndType === "page"
      ? _savePage(s)
      : _saveScreenApi(s.currentPreviewItem, s)

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
    s.currentFrontEndType === "page"
      ? _savePage(s)
      : _saveScreenApi(s.currentPreviewItem, s)
    s.currentComponentInfo = copiedComponent
    return s
  })
}

const getParent = (rootProps, child) => {
  let parent
  walkProps(rootProps, (p, breakWalk) => {
    if (p._children.includes(child)) {
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
