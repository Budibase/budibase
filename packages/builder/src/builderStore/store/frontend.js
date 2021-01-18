import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import {
  createProps,
  getBuiltin,
} from "components/userInterface/assetParsing/createProps"
import {
  allScreens,
  backendUiStore,
  hostingStore,
  currentAsset,
  mainLayout,
  selectedComponent,
  selectedAccessRole,
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
  findParent,
} from "../storeUtils"

const INITIAL_FRONTEND_STATE = {
  apps: [],
  name: "",
  url: "",
  description: "",
  layouts: [],
  screens: [],
  components: [],
  currentFrontEndType: "none",
  selectedScreenId: "",
  selectedLayoutId: "",
  selectedComponentId: "",
  errors: [],
  hasAppPackage: false,
  libraries: null,
  appId: "",
  routes: {},
  bottomDrawerVisible: false,
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
        url: pkg.application.url,
        description: pkg.application.description,
        appId: pkg.application._id,
        layouts,
        screens,
        hasAppPackage: true,
        builtins: [getBuiltin("##builtin/screenslot")],
        appInstance: pkg.application.instance,
      }))

      await hostingStore.actions.fetch()
      await backendUiStore.actions.database.select(pkg.application.instance)
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
          let screens = get(allScreens)
          let screen =
            screens.find(screen => screen._id === screenId) || screens[0]
          if (!screen) return state

          // Update role to the screen's role setting so that it will always
          // be visible
          selectedAccessRole.set(screen.routing.roleId)

          state.currentFrontEndType = FrontendTypes.SCREEN
          state.selectedScreenId = screen._id
          state.currentView = "detail"
          state.selectedComponentId = screen.props?._id
          return state
        })
      },
      create: async screen => {
        screen = await store.actions.screens.save(screen)
        store.update(state => {
          state.selectedScreenId = screen._id
          state.selectedComponentId = screen.props._id
          state.currentFrontEndType = FrontendTypes.SCREEN
          selectedAccessRole.set(screen.routing.roleId)
          return state
        })
        return screen
      },
      save: async screen => {
        const creatingNewScreen = screen._id === undefined
        const response = await api.post(`/api/screens`, screen)
        screen = await response.json()
        await store.actions.routing.fetch()

        store.update(state => {
          const foundScreen = state.screens.findIndex(
            el => el._id === screen._id
          )
          if (foundScreen !== -1) {
            state.screens.splice(foundScreen, 1)
          }
          state.screens.push(screen)
          return state
        })

        if (creatingNewScreen) {
          store.actions.screens.select(screen._id)
        }

        return screen
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
            if (screenToDelete._id === state.selectedScreenId) {
              state.selectedScreenId = null
            }
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
      select: layoutId => {
        store.update(state => {
          const layout =
            store.actions.layouts.find(layoutId) || get(store).layouts[0]
          if (!layout) return
          state.currentFrontEndType = FrontendTypes.LAYOUT
          state.currentView = "detail"
          state.selectedLayoutId = layout._id
          state.selectedComponentId = layout.props?._id
          return state
        })
      },
      save: async layout => {
        const layoutToSave = cloneDeep(layout)
        const creatingNewLayout = layoutToSave._id === undefined
        const response = await api.post(`/api/layouts`, layoutToSave)
        const savedLayout = await response.json()

        store.update(state => {
          const layoutIdx = state.layouts.findIndex(
            stateLayout => stateLayout._id === savedLayout._id
          )
          if (layoutIdx >= 0) {
            // update existing layout
            state.layouts.splice(layoutIdx, 1, savedLayout)
          } else {
            // save new layout
            state.layouts.push(savedLayout)
          }
          return state
        })

        // Select layout if creating a new one
        if (creatingNewLayout) {
          store.actions.layouts.select(savedLayout._id)
        }

        return savedLayout
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
          if (layoutToDelete._id === state.selectedLayoutId) {
            state.selectedLayoutId = get(mainLayout)._id
          }
          return state
        })
      },
    },
    components: {
      select: component => {
        store.update(state => {
          state.selectedComponentId = component._id
          state.currentView = "component"
          return state
        })
      },
      create: (componentToAdd, presetProps) => {
        const selectedAsset = get(currentAsset)

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
            findSlot(selectedAsset?.props._children)
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

          const selected = get(selectedComponent)

          const currentComponentDefinition =
            state.components[selected._component]

          const allowsChildren = currentComponentDefinition.children

          // Determine where to put the new component.
          let targetParent
          if (allowsChildren) {
            // Child of the selected component
            targetParent = selected
          } else {
            // Sibling of selected component
            targetParent = findParent(selectedAsset.props, selected)
          }

          // Don't continue if there's no parent
          if (!targetParent) return state

          // Push the new component
          targetParent._children.push(newComponent.props)

          store.actions.preview.saveSelected()

          state.currentView = "component"
          state.selectedComponentId = newComponent.props._id

          analytics.captureEvent("Added Component", {
            name: newComponent.props._component,
          })
          return state
        })
      },
      copy: (component, cut = false) => {
        const selectedAsset = get(currentAsset)
        store.update(state => {
          state.componentToPaste = cloneDeep(component)
          state.componentToPaste.isCut = cut
          if (cut) {
            const parent = findParent(selectedAsset.props, component._id)
            parent._children = parent._children.filter(
              child => child._id !== component._id
            )
            store.actions.components.select(parent)
          }

          return state
        })
      },
      paste: async (targetComponent, mode) => {
        const selectedAsset = get(currentAsset)
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

          const parent = findParent(selectedAsset.props, targetComponent)

          const targetIndex = parent._children.indexOf(targetComponent)
          const index = mode === "above" ? targetIndex : targetIndex + 1
          parent._children.splice(index, 0, cloneDeep(componentToPaste))

          promises.push(store.actions.preview.saveSelected())
          store.actions.components.select(componentToPaste)

          return state
        })
        await Promise.all(promises)
      },
      updateStyle: async (type, name, value) => {
        const selected = get(selectedComponent)
        if (value == null || value === "") {
          delete selected._styles[type][name]
        } else {
          selected._styles[type][name] = value
        }
        await store.actions.preview.saveSelected()
      },
      updateCustomStyle: async style => {
        const selected = get(selectedComponent)
        selected._styles.custom = style
        await store.actions.preview.saveSelected()
      },
      resetStyles: async () => {
        const selected = get(selectedComponent)
        selected._styles = { normal: {}, hover: {}, active: {} }
        await store.actions.preview.saveSelected()
      },
      updateProp: (name, value) => {
        store.update(state => {
          let current_component = get(selectedComponent)
          current_component[name] = value

          state.selectedComponentId = current_component._id
          store.actions.preview.saveSelected()
          return state
        })
      },
      findRoute: component => {
        // Gets all the components to needed to construct a path.
        const selectedAsset = get(currentAsset)
        let pathComponents = []
        let parent = component
        let root = false
        while (!root) {
          parent = findParent(selectedAsset.props, parent)
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

              // Save layout
              nav._children = [...nav._children, newLink]
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
