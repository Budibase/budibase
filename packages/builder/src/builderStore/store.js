import { hierarchy as hierarchyFunctions } from "../../../core/src"
import {
  filter,
  cloneDeep,
  sortBy,
  map,
  last,
  keys,
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
import {
  isRootComponent,
  getExactComponent,
} from "../userInterface/pagesParsing/searchComponents"
import { rename } from "../userInterface/pagesParsing/renameScreen"
import {
  getNewScreen,
  createProps,
} from "../userInterface/pagesParsing/createProps"
import {
  loadLibs,
  loadLibUrls,
  loadGeneratorLibs,
} from "./loadComponentLibraries"
import { buildCodeForScreens } from "./buildCodeForScreens"
import { generate_screen_css } from "./generate_css"
// import { uuid } from "./uuid"

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
  store.refreshComponents = refreshComponents(store)
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

  console.log(main_screens, unauth_screens, Object.values(main_screens))

  pkg.pages = {
    componentLibraries: ["@budibase/standard-components"],
    stylesheets: [],
    main: {
      ...pkg.pages.main,
      _screens: Object.values(main_screens),
    },
    unauthenticated: {
      ...pkg.pages.unauthenticated,
      _screens: Object.values(main_screens),
    },
  }

  initial.libraries = await loadLibs(appname, pkg)
  initial.generatorLibraries = await loadGeneratorLibs(appname, pkg)
  initial.loadLibraryUrls = () => loadLibUrls(appname, pkg)
  initial.appname = appname
  initial.pages = pkg.pages
  initial.hasAppPackage = true
  initial.hierarchy = pkg.appDefinition.hierarchy
  initial.accessLevels = pkg.accessLevels
  initial.screens = values(pkg.screens)
  initial.generators = generatorsArray(pkg.components.generators)
  initial.components = values(pkg.components.components)
  initial.actions = values(pkg.appDefinition.actions)
  initial.triggers = pkg.appDefinition.triggers

  if (!!initial.hierarchy && !isEmpty(initial.hierarchy)) {
    initial.hierarchy = constructHierarchy(initial.hierarchy)
    const shadowHierarchy = createShadowHierarchy(initial.hierarchy)
    if (initial.currentNode !== null)
      initial.currentNode = getNode(shadowHierarchy, initial.currentNode.nodeId)
  }

  store.set(initial)
  console.log(initial)
  return initial
}

const generatorsArray = generators =>
  pipe(generators, [keys, filter(k => k !== "_lib"), map(k => generators[k])])

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

    savePackage(store, s)

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
    savePackage(store, s)
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
    savePackage(store, s)
    return s
  })
}

const deleteAction = store => action => {
  store.update(s => {
    s.actions = filter(a => a.name !== action.name)(s.actions)
    savePackage(store, s)
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
    savePackage(store, s)
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

    savePackage(store, s)
    return s
  })
}

const deleteLevel = store => level => {
  store.update(s => {
    s.accessLevels.levels = filter(t => t.name !== level.name)(
      s.accessLevels.levels
    )
    incrementAccessLevelsVersion(s)
    savePackage(store, s)
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

const _saveScreen = (store, s, screen) => {
  const screens = pipe(s.pages[s.currentPageName]._screens, [
    filter(c => c.name !== screen.name),
    concat([screen]),
  ])
  // console.log('saveScreen', screens, screen)
  s.pages[s.currentPageName]._screens = screens
  s.screens = s.pages[s.currentPageName]._screens
  // s.currentPreviewItem = screen
  // s.currentComponentInfo = screen.props

  api
    .post(
      `/_builder/api/${s.appname}/pages/${s.currentPageName}/screen`,
      screen
    )
    .then(() => savePackage(store, s))

  return s
}

const _save = (appname, screen, store, s) =>
  api
    .post(
      `/_builder/api/${s.appname}/pages/${s.currentPageName}/screen`,
      screen
    )
    .then(() => savePackage(store, s))

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
    s.currentComponentInfo = screen.props

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

      await savePackage(store, s)
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
        savePackage(store, s)
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
    savePackage(store, s)
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
        componentsArray.push(components[c])
      }

      s.components = pipe(s.components, [
        filter(c => !c.name.startsWith(`${lib}/`)),
        concat(componentsArray),
      ])

      s.pages.componentLibraries.push(lib)
      savePackage(store, s)
    }

    return s
  })
}

const removeComponentLibrary = store => lib => {
  store.update(s => {
    s.pages.componentLibraries = filter(l => l !== lib)(
      s.pages.componentLibraries
    )
    savePackage(store, s)

    return s
  })
}

const addStylesheet = store => stylesheet => {
  store.update(s => {
    s.pages.stylesheets.push(stylesheet)
    savePackage(store, s)
    return s
  })
}

const removeStylesheet = store => stylesheet => {
  store.update(s => {
    s.pages.stylesheets = filter(s => s !== stylesheet)(s.pages.stylesheets)
    savePackage(store, s)
    return s
  })
}

const refreshComponents = store => async () => {
  const componentsAndGenerators = await api
    .get(`/_builder/api/${db.appname}/components`)
    .then(r => r.json())

  const components = pipe(componentsAndGenerators.components, [
    keys,
    map(k => ({ ...componentsAndGenerators[k], name: k })),
  ])

  store.update(s => {
    s.components = pipe(s.components, [
      filter(c => !isRootComponent(c)),
      concat(components),
    ])
    s.generators = componentsAndGenerators.generators
    return s
  })
}

const savePackage = async (store, s) => {
  const page = s.pages[s.currentPageName]

  await api.post(`/_builder/api/${appname}/pages/${s.currentPageName}`, {
    appDefinition: {
      hierarchy: s.hierarchy,
      actions: s.actions,
      triggers: s.triggers,
    },
    accessLevels: s.accessLevels,
    page: { componentLibraries: s.pages.componentLibraries, ...page },
    uiFunctions: "{'1234':() => 'test return'}",
    props: page.props,
    screens: page.screens,
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
    s.currentComponentInfo = s.pages[pageName].props
    s.currentPreviewItem = s.pages[pageName]

    setCurrentScreenFunctions(s)
    return s
  })
}

const addChildComponent = store => componentName => {
  store.update(s => {
    const component = s.components.find(c => c.name === componentName)
    const newComponent = createProps(component)

    s.currentComponentInfo._children = s.currentComponentInfo._children.concat(
      newComponent.props
    )

    savePackage(store, s)

    return s
  })
}

const selectComponent = store => component => {
  store.update(s => {
    s.currentComponentInfo = component
    return s
  })
}

const setComponentProp = store => (name, value) => {
  store.update(s => {
    const current_component = s.currentComponentInfo
    s.currentComponentInfo[name] = value

    s.currentFrontEndType === "page"
      ? savePackage(store, s, s.currentPreviewItem)
      : _saveScreen(store, s, s.currentPreviewItem)

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
      ? savePackage(store, s, s.currentPreviewItem)
      : _save(s.appname, s.currentPreviewItem, store, s)
    return s
  })
}

const setComponentCode = store => code => {
  store.update(s => {
    s.currentComponentInfo._code = code

    setCurrentScreenFunctions(s)
    // save without messing with the store
    _save(s.appname, s.currentPreviewItem, store, s)

    return s
  })
}

const setCurrentScreenFunctions = s => {
  s.currentScreenFunctions =
    s.currentPreviewItem === "screen"
      ? buildCodeForScreens([s.currentPreviewItem])
      : "({});"
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
