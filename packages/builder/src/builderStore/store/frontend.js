import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import {
  allScreens,
  backendUiStore,
  currentAsset,
  mainLayout,
  selectedComponent,
  selectedAccessRole,
} from "builderStore"
import { fetchComponentLibDefinitions } from "../loadComponentLibraries"
import api from "../api"
import { FrontendTypes } from "../../constants"
import analytics from "analytics"
import {
  findComponentType,
  findComponentParent,
  findComponentPath,
} from "../storeUtils"
import { uuid } from "../uuid"

const INITIAL_FRONTEND_STATE = {
  apps: [],
  name: "",
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
}

export const getFrontendStore = () => {
  const store = writable({ ...INITIAL_FRONTEND_STATE })

  store.actions = {
    initialise: async pkg => {
      const { layouts, screens, application } = pkg
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
        appInstance: pkg.application.instance,
      }))
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
      getDefinition: componentName => {
        if (!componentName) {
          return null
        }
        const name = componentName.startsWith("@budibase")
          ? componentName
          : `@budibase/standard-components/${componentName}`
        return get(store).components[name]
      },
      createInstance: (componentName, presetProps) => {
        const definition = store.actions.components.getDefinition(componentName)
        if (!definition) {
          return null
        }

        // Generate default props
        let props = { ...presetProps }
        if (definition.settings) {
          definition.settings.forEach(setting => {
            if (setting.defaultValue !== undefined) {
              props[setting.key] = setting.defaultValue
            }
          })
        }

        // Add any extra properties the component needs
        let extras = {}
        if (definition.hasChildren) {
          extras._children = []
        }

        return {
          _id: uuid(),
          _component: definition.component,
          _styles: { normal: {}, hover: {}, active: {} },
          _instanceName: `New ${definition.component.split("/")[2]}`,
          ...cloneDeep(props),
          ...extras,
        }
      },
      create: (componentName, presetProps) => {
        // Create new component
        const componentInstance = store.actions.components.createInstance(
          componentName,
          presetProps
        )
        if (!componentInstance) {
          return
        }

        // Find parent node to attach this component to
        let parentComponent
        const selected = get(selectedComponent)
        const asset = get(currentAsset)
        if (!asset) {
          return
        }
        if (selected) {
          // Use current screen or layout as parent if no component is selected
          const definition = store.actions.components.getDefinition(
            selected._component
          )
          if (definition?.hasChildren) {
            // Use selected component if it allows children
            parentComponent = selected
          } else {
            // Otherwise we need to use the parent of this component
            parentComponent = findComponentParent(asset.props, selected._id)
          }
        } else {
          // Use screen or layout if no component is selected
          parentComponent = asset.props
        }

        // Attach component
        if (!parentComponent) {
          return
        }
        if (!parentComponent._children) {
          parentComponent._children = []
        }
        parentComponent._children.push(componentInstance)

        // Save components and update UI
        store.actions.preview.saveSelected()
        store.update(state => {
          state.currentView = "component"
          state.selectedComponentId = componentInstance._id
          return state
        })

        // Log event
        analytics.captureEvent("Added Component", {
          name: componentInstance._component,
        })

        return componentInstance
      },
      delete: component => {
        if (!component) {
          return
        }
        const asset = get(currentAsset)
        if (!asset) {
          return
        }
        const parent = findComponentParent(asset.props, component._id)
        if (parent) {
          parent._children = parent._children.filter(
            child => child._id !== component._id
          )
          store.actions.components.select(parent)
        }
        store.actions.preview.saveSelected()
      },
      copy: (component, cut = false) => {
        const selectedAsset = get(currentAsset)
        if (!selectedAsset) {
          return null
        }

        // Update store with copied component
        store.update(state => {
          state.componentToPaste = cloneDeep(component)
          state.componentToPaste.isCut = cut
          return state
        })

        // Remove the component from its parent if we're cutting
        if (cut) {
          const parent = findComponentParent(selectedAsset.props, component._id)
          if (parent) {
            parent._children = parent._children.filter(
              child => child._id !== component._id
            )
            store.actions.components.select(parent)
          }
        }
      },
      paste: async (targetComponent, mode) => {
        let promises = []
        store.update(state => {
          // Stop if we have nothing to paste
          if (!state.componentToPaste) {
            return state
          }

          // Clone the component to paste
          // Retain the same ID if cutting as things may be referencing this component
          const cut = state.componentToPaste.isCut
          delete state.componentToPaste.isCut
          let componentToPaste = cloneDeep(state.componentToPaste)
          if (cut) {
            state.componentToPaste = null
          } else {
            componentToPaste._id = uuid()
          }

          if (mode === "inside") {
            // Paste inside target component if chosen
            if (!targetComponent._children) {
              targetComponent._children = []
            }
            targetComponent._children.push(componentToPaste)
          } else {
            // Otherwise find the parent so we can paste in the correct order
            // in the parents child components
            const selectedAsset = get(currentAsset)
            if (!selectedAsset) {
              return state
            }
            const parent = findComponentParent(
              selectedAsset.props,
              targetComponent._id
            )
            if (!parent) {
              return state
            }

            // Insert the component in the correct position
            const targetIndex = parent._children.indexOf(targetComponent)
            const index = mode === "above" ? targetIndex : targetIndex + 1
            parent._children.splice(index, 0, cloneDeep(componentToPaste))
          }

          // Save and select the new component
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
        let component = get(selectedComponent)
        if (!name || !component) {
          return
        }
        component[name] = value
        store.update(state => {
          state.selectedComponentId = component._id
          return state
        })
        store.actions.preview.saveSelected()
      },
      findRoute: component => {
        const selectedAsset = get(currentAsset)
        if (!component || !selectedAsset) {
          return "/"
        }

        // Get the path to this component
        const path = findComponentPath(selectedAsset.props, component._id) || []

        // Remove root entry since it's the screen or layout
        return path.slice(1).join("/")
      },
      links: {
        save: async (url, title) => {
          const layout = get(mainLayout)
          if (!layout) {
            return
          }

          // Find a nav bar in the main layout
          const nav = findComponentType(
            layout,
            "@budibase/standard-components/navigation"
          )
          if (!nav) {
            return
          }

          let newLink
          if (nav._children && nav._children.length) {
            // Clone an existing link if one exists
            newLink = cloneDeep(nav._children[0])

            // Set our new props
            newLink._id = uuid()
            newLink._instanceName = `${title} Link`
            newLink.url = url
            newLink.text = title
          } else {
            // Otherwise create vanilla new link
            newLink = {
              ...store.actions.components.createInstance("link"),
              url,
              text: title,
              _instanceName: `${title} Link`,
            }
          }

          // Save layout
          nav._children = [...nav._children, newLink]
          await store.actions.layouts.save(layout)
        },
      },
    },
  }

  return store
}
