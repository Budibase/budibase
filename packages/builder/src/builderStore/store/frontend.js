import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import {
  createProps,
  getBuiltin,
  makePropsSafe,
} from "components/userInterface/assetParsing/createProps"
import {
  allScreens,
  backendUiStore,
  currentAsset,
  mainLayout,
} from "builderStore"
import { fetchComponentLibDefinitions } from "../loadComponentLibraries"
import api from "../api"
import { FrontendTypes } from "../../constants"
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
  layouts: [],
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
      const { layouts, screens, application } = pkg

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
    selectAssetType: type => {
      store.update(state => {
        state.currentFrontEndType = type

        const asset = get(currentAsset)

        state.currentComponentInfo = asset && asset.props ? asset.props : null
        state.currentPreviewItem = asset
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
      select: async screenId => {
        let promise
        store.update(state => {
          const screen = get(allScreens).find(screen => screen._id === screenId)
          state.currentPreviewItem = screen
          state.currentFrontEndType = FrontendTypes.SCREEN
          state.currentAssetId = screenId
          state.currentView = "detail"

          promise = store.actions.screens.regenerateCss(screen)
          const safeProps = makePropsSafe(
            state.components[screen.props._component],
            screen.props
          )
          screen.props = safeProps
          state.currentComponentInfo = safeProps
          return state
        })
        await promise
      },
      create: async screen => {
        screen = await store.actions.screens.save(screen)
        store.update(state => {
          state.currentPreviewItem = screen
          state.currentComponentInfo = screen.props
          state.currentFrontEndType = FrontendTypes.SCREEN
          return state
        })
        return screen
      },
      save: async screen => {
        const creatingNewScreen = screen._id === undefined
        const response = await api.post(`/api/screens`, screen)
        screen = await response.json()

        store.update(state => {
          const foundScreen = state.screens.findIndex(
            el => el._id === screen._id
          )
          if (foundScreen !== -1) {
            state.screens.splice(foundScreen, 1)
          }
          state.screens.push(screen)

          if (creatingNewScreen) {
            state.currentPreviewItem = screen
            const safeProps = makePropsSafe(
              state.components[screen.props._component],
              screen.props
            )
            state.currentComponentInfo = safeProps
            screen.props = safeProps
          }
          return state
        })
        return screen
      },
      regenerateCss: async asset => {
        const response = await api.post("/api/css/generate", asset)
        asset._css = (await response.json())?.css
      },
      regenerateCssForCurrentScreen: async () => {
        const { currentPreviewItem } = get(store)
        if (currentPreviewItem) {
          await store.actions.screens.regenerateCss(currentPreviewItem)
        }
      },
      delete: async screens => {
        const screensToDelete = Array.isArray(screens) ? screens : [screens]

        const screenDeletePromises = []
        store.update(state => {
          for (let screenToDelete of screensToDelete) {
            state.screens = state.screens.filter(
              screen => screen._id !== screenToDelete._id
            )
            screenDeletePromises.push(
              api.delete(
                `/api/screens/${screenToDelete._id}/${screenToDelete._rev}`
              )
            )
          }
          return state
        })
        await Promise.all(screenDeletePromises)
      },
    },
    preview: {
      saveSelected: async () => {
        const state = get(store)
        const selectedAsset = get(currentAsset)
        if (state.currentFrontEndType !== FrontendTypes.LAYOUT) {
          await store.actions.screens.save(selectedAsset)
        } else {
          await store.actions.layouts.save(selectedAsset)
        }
      },
    },
    layouts: {
      select: async layoutId => {
        store.update(state => {
          const layout = store.actions.layouts.find(layoutId)

          state.currentFrontEndType = FrontendTypes.LAYOUT
          state.currentView = "detail"
          state.currentAssetId = layout._id

          // This is the root of many problems.
          // Uncaught (in promise) TypeError: Cannot read property '_component' of undefined
          // it appears that the currentLayout sometimes has _props instead of props
          // why
          const safeProps = makePropsSafe(
            state.components[layout.props._component],
            layout.props
          )
          state.currentComponentInfo = safeProps
          layout.props = safeProps
          state.currentPreviewItem = layout

          return state
        })
        let cssPromises = []
        cssPromises.push(store.actions.screens.regenerateCssForCurrentScreen())

        for (let screen of get(allScreens)) {
          cssPromises.push(store.actions.screens.regenerateCss(screen))
        }
        await Promise.all(cssPromises)
      },
      save: async layout => {
        const layoutToSave = cloneDeep(layout)
        delete layoutToSave._css

        const response = await api.post(`/api/layouts`, layoutToSave)

        const json = await response.json()

        if (!json.ok) throw new Error("Error updating layout")

        store.update(state => {
          layoutToSave._rev = json.rev
          layoutToSave._id = json.id

          const layoutIdx = state.layouts.findIndex(
            stateLayout => stateLayout._id === layoutToSave._id
          )

          if (layoutIdx >= 0) {
            // update existing layout
            state.layouts.splice(layoutIdx, 1, layoutToSave)
          } else {
            // save new layout
            state.layouts.push(layoutToSave)
          }

          return state
        })
      },
      find: layoutId => {
        if (!layoutId) {
          return get(mainLayout)
        }
        const storeContents = get(store)
        return storeContents.layouts.find(layout => layout._id === layoutId)
      },
      delete: async layoutToDelete => {
        const response = await api.delete(
          `/api/layouts/${layoutToDelete._id}/${layoutToDelete._rev}`
        )

        if (response.status !== 200) {
          const json = await response.json()
          throw new Error(json.message)
        }

        store.update(state => {
          state.layouts = state.layouts.filter(
            layout => layout._id !== layoutToDelete._id
          )
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
            if (!component_array) {
              return false
            }
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
            findSlot(get(currentAsset)?.props._children)
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
      paste: async (targetComponent, mode) => {
        let promises = []
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

          promises.push(store.actions.screens.regenerateCssForCurrentScreen())
          promises.push(store.actions.preview.saveSelected())
          store.actions.components.select(componentToPaste)

          return state
        })
        await Promise.all(promises)
      },
      updateStyle: async (type, name, value) => {
        let promises = []
        store.update(state => {
          if (!state.currentComponentInfo._styles) {
            state.currentComponentInfo._styles = {}
          }
          state.currentComponentInfo._styles[type][name] = value

          promises.push(store.actions.screens.regenerateCssForCurrentScreen())

          // save without messing with the store
          promises.push(store.actions.preview.saveSelected())
          return state
        })
        await Promise.all(promises)
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

        // Remove root entry since it's the screen or layout.
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
          let promises = []
          const layout = get(mainLayout)
          store.update(state => {
            // Try to extract a nav component from the master layout
            const nav = findChildComponentType(
              layout,
              "@budibase/standard-components/navigation"
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

              // Save layout and regenerate all CSS because otherwise weird things happen
              nav._children = [...nav._children, newLink]
              state.currentAssetId = layout._id
              promises.push(store.actions.screens.regenerateCss(layout))
              for (let screen of get(allScreens)) {
                promises.push(store.actions.screens.regenerateCss(screen))
              }
              promises.push(store.actions.layouts.save(layout))
            }
            return state
          })
          await Promise.all(promises)
        },
      },
    },
  }

  return store
}
