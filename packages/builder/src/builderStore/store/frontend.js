import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import {
  createProps,
  getBuiltin,
  makePropsSafe,
} from "components/userInterface/pagesParsing/createProps"
import { allScreens, backendUiStore, currentAsset } from "builderStore"
import { fetchComponentLibDefinitions } from "../loadComponentLibraries"
import api from "../api"
import { DEFAULT_PAGES_OBJECT } from "../../constants"
import getNewComponentName from "../getNewComponentName"
import analytics from "analytics"
import {
  findChildComponentType,
  generateNewIdsForComponent,
  getComponentDefinition,
  getParent,
} from "../storeUtils"

const INITIAL_FRONTEND_STATE = {
  apps: [],
  name: "",
  description: "",
  layouts: DEFAULT_PAGES_OBJECT,
  screens: [],
  mainUi: {},
  unauthenticatedUi: {},
  components: [],
  currentPreviewItem: null,
  currentComponentInfo: null,
  currentFrontEndType: "none",
  currentAssetId: "",
  currentComponentProps: null,
  errors: [],
  hasAppPackage: false,
  libraries: null,
  appId: "",
  routes: {},
}

export const getFrontendStore = () => {
  const store = writable({ ...INITIAL_FRONTEND_STATE })

  store.actions = {
    initialise: async pkg => {
      const layouts = pkg.layouts, screens = pkg.screens, application = pkg.application
      store.update(state => {
        state.appId = application._id
        return state
      })

      const components = await fetchComponentLibDefinitions(pkg.application._id)

      store.update(state => ({
        ...state,
        libraries: pkg.application.componentLibraries,
        components,
        name: pkg.application.name,
        description: pkg.application.description,
        appId: pkg.application._id,
        layouts,
        screens,
        hasAppPackage: true,
        builtins: [getBuiltin("##builtin/screenslot")],
        appInstance: pkg.application.instance,
      }))

      await backendUiStore.actions.database.select(pkg.application.instance)
    },
    selectPageOrScreen: type => {
      store.update(state => {
        state.currentFrontEndType = type

        const page = get(currentAsset)

        const pageOrScreen = type === "page" ? page : page._screens[0]

        state.currentComponentInfo = pageOrScreen ? pageOrScreen.props : null
        state.currentPreviewItem = pageOrScreen
        state.currentView = "detail"
        return state
      })
    },
    routing: {
      fetch: async () => {
        const response = await api.get("/api/routing")
        const json = await response.json()

        store.update(state => {
          state.routes = json.routes
          return state
        })
      },
    },
    screens: {
      select: screenId => {
        store.update(state => {
          const screen = get(allScreens).find(screen => screen._id === screenId)
          state.currentPreviewItem = screen
          state.currentFrontEndType = "screen"
          state.currentView = "detail"

          store.actions.screens.regenerateCssForCurrentScreen()
          const safeProps = makePropsSafe(
            state.components[screen.props._component],
            screen.props
          )
          screen.props = safeProps
          state.currentComponentInfo = safeProps
          return state
        })
      },
      create: async screen => {
        let savePromise
        store.update(state => {
          state.currentPreviewItem = screen
          state.currentComponentInfo = screen.props
          state.currentFrontEndType = "screen"

          if (state.currentPreviewItem) {
            store.actions.screens.regenerateCss(state.currentPreviewItem)
          }

          savePromise = store.actions.screens.save(screen)
          return state
        })

        await savePromise
      },
      save: async screen => {
        const page = get(currentAsset)
        const currentPageScreens = page._screens

        const creatingNewScreen = screen._id === undefined

        let savePromise
        const response = await api.post(`/api/screens/${page._id}`, screen)
        const json = await response.json()
        screen._rev = json.rev
        screen._id = json.id
        const foundScreen = page._screens.findIndex(el => el._id === screen._id)
        if (foundScreen !== -1) {
          page._screens.splice(foundScreen, 1)
        }
        page._screens.push(screen)

        // TODO: should carry out all server updates to screen in a single call
        store.update(state => {
          page._screens = currentPageScreens

          if (creatingNewScreen) {
            state.currentPreviewItem = screen
            const safeProps = makePropsSafe(
              state.components[screen.props._component],
              screen.props
            )
            state.currentComponentInfo = safeProps
            screen.props = safeProps
          }
          savePromise = store.actions.layouts.save()

          return state
        })
        if (savePromise) await savePromise
      },
      regenerateCss: async asset => {
        const response = await api.post("/api/css/generate", asset)
        asset._css = await response.json()
      },
      regenerateCssForCurrentScreen: () => {
        const { currentPreviewItem } = get(store)
        if (currentPreviewItem) {
          store.actions.screens.regenerateCss(currentPreviewItem)
        }
      },
      delete: async screens => {
        let deletePromise

        const screensToDelete = Array.isArray(screens) ? screens : [screens]

        store.update(state => {
          const currentPage = get(currentAsset)

          for (let screenToDelete of screensToDelete) {
            // Remove screen from current page as well
            // TODO: Should be done server side
            currentPage._screens = currentPage._screens.filter(
              scr => scr._id !== screenToDelete._id
            )

            deletePromise = api.delete(
              `/api/screens/${screenToDelete._id}/${screenToDelete._rev}`
            )
          }
          return state
        })
        await deletePromise
      },
    },
    preview: {
      saveSelected: async () => {
        const state = get(store)
        if (state.currentFrontEndType !== "page") {
          await store.actions.screens.save(state.currentPreviewItem)
        }
        await store.actions.layouts.save()
      },
    },
    layouts: {
      select: pageName => {
        store.update(state => {
          const currentPage = state.layouts[pageName]

          state.currentFrontEndType = "page"
          state.currentView = "detail"
          state.currentAssetId = pageName

          // This is the root of many problems.
          // Uncaught (in promise) TypeError: Cannot read property '_component' of undefined
          // it appears that the currentPage sometimes has _props instead of props
          // why
          const safeProps = makePropsSafe(
            state.components[currentPage.props._component],
            currentPage.props
          )
          state.currentComponentInfo = safeProps
          currentPage.props = safeProps
          state.currentPreviewItem = state.layouts[pageName]
          store.actions.screens.regenerateCssForCurrentScreen()

          for (let screen of get(allScreens)) {
            screen._css = store.actions.screens.regenerateCss(screen)
          }

          return state
        })
      },
      save: async page => {
        const storeContents = get(store)
        const pageName = storeContents.currentAssetId || "main"
        const pageToSave = page || storeContents.pages[pageName]

        // TODO: revisit. This sends down a very weird payload
        const response = await api.post(`/api/pages/${pageToSave._id}`, {
          page: {
            componentLibraries: storeContents.pages.componentLibraries,
            ...pageToSave,
          },
          screens: pageToSave._screens,
        })

        const json = await response.json()

        if (!json.ok) throw new Error("Error updating page")

        store.update(state => {
          state.layouts[pageName]._rev = json.rev
          return state
        })
      },
    },
    components: {
      select: component => {
        store.update(state => {
          const componentDef = component._component.startsWith("##")
            ? component
            : state.components[component._component]
          state.currentComponentInfo = makePropsSafe(componentDef, component)
          state.currentView = "component"
          return state
        })
      },
      create: (componentToAdd, presetProps) => {
        store.update(state => {
          function findSlot(component_array) {
            for (let component of component_array) {
              if (component._component === "##builtin/screenslot") {
                return true
              }

              if (component._children) findSlot(component)
            }
            return false
          }

          if (
            componentToAdd.startsWith("##") &&
            findSlot(state.layouts[state.currentAssetId].props._children)
          ) {
            return state
          }

          const component = getComponentDefinition(state, componentToAdd)

          const instanceId = get(backendUiStore).selectedDatabase._id
          const instanceName = getNewComponentName(component, state)

          const newComponent = createProps(component, {
            ...presetProps,
            _instanceId: instanceId,
            _instanceName: instanceName,
          })

          const currentComponent =
            state.components[state.currentComponentInfo._component]

          const targetParent = currentComponent.children
            ? state.currentComponentInfo
            : getParent(
                state.currentPreviewItem.props,
                state.currentComponentInfo
              )

          // Don't continue if there's no parent
          if (!targetParent) {
            return state
          }

          targetParent._children = targetParent._children.concat(
            newComponent.props
          )

          store.actions.preview.saveSelected()

          state.currentView = "component"
          state.currentComponentInfo = newComponent.props
          analytics.captureEvent("Added Component", {
            name: newComponent.props._component,
          })
          return state
        })
      },
      copy: (component, cut = false) => {
        store.update(state => {
          state.componentToPaste = cloneDeep(component)
          state.componentToPaste.isCut = cut
          if (cut) {
            const parent = getParent(
              state.currentPreviewItem.props,
              component._id
            )
            parent._children = parent._children.filter(
              child => child._id !== component._id
            )
            store.actions.components.select(parent)
          }

          return state
        })
      },
      paste: (targetComponent, mode) => {
        store.update(state => {
          if (!state.componentToPaste) return state

          const componentToPaste = cloneDeep(state.componentToPaste)
          // retain the same ids as things may be referencing this component
          if (componentToPaste.isCut) {
            // in case we paste a second time
            state.componentToPaste.isCut = false
          } else {
            generateNewIdsForComponent(componentToPaste, state)
          }
          delete componentToPaste.isCut

          if (mode === "inside") {
            targetComponent._children.push(componentToPaste)
            return state
          }

          const parent = getParent(
            state.currentPreviewItem.props,
            targetComponent
          )

          const targetIndex = parent._children.indexOf(targetComponent)
          const index = mode === "above" ? targetIndex : targetIndex + 1
          parent._children.splice(index, 0, cloneDeep(componentToPaste))

          store.actions.screens.regenerateCssForCurrentScreen()
          store.actions.preview.saveSelected()
          store.actions.components.select(componentToPaste)

          return state
        })
      },
      updateStyle: (type, name, value) => {
        store.update(state => {
          if (!state.currentComponentInfo._styles) {
            state.currentComponentInfo._styles = {}
          }
          state.currentComponentInfo._styles[type][name] = value

          store.actions.screens.regenerateCssForCurrentScreen()

          // save without messing with the store
          store.actions.preview.saveSelected()
          return state
        })
      },
      updateProp: (name, value) => {
        store.update(state => {
          let current_component = state.currentComponentInfo
          current_component[name] = value

          state.currentComponentInfo = current_component
          store.actions.preview.saveSelected()
          return state
        })
      },
      findRoute: component => {
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
        return IdList.join("/")
      },
      links: {
        save: async (url, title) => {
          let savePromise
          store.update(state => {
            // Try to extract a nav component from the master screen
            const nav = findChildComponentType(
              state.layouts.main,
              "@budibase/standard-components/Navigation"
            )
            if (nav) {
              let newLink

              // Clone an existing link if one exists
              if (nav._children && nav._children.length) {
                // Clone existing link style
                newLink = cloneDeep(nav._children[0])

                // Manipulate IDs to ensure uniqueness
                generateNewIdsForComponent(newLink, state, false)

                // Set our new props
                newLink._instanceName = `${title} Link`
                newLink.url = url
                newLink.text = title
              } else {
                // Otherwise create vanilla new link
                const component = getComponentDefinition(
                  state,
                  "@budibase/standard-components/link"
                )
                const instanceId = get(backendUiStore).selectedDatabase._id
                newLink = createProps(component, {
                  url,
                  text: title,
                  _instanceName: `${title} Link`,
                  _instanceId: instanceId,
                }).props
              }

              // Save page and regenerate all CSS because otherwise weird things happen
              nav._children = [...nav._children, newLink]
              state.currentAssetId = "main"
              store.actions.screens.regenerateCss(state.layouts.main)
              for (let screen of state.layouts.main._screens) {
                store.actions.screens.regenerateCss(screen)
              }
              savePromise = store.actions.layouts.save()
            }
            return state
          })
          await savePromise
        },
      },
    },
  }

  return store
}
