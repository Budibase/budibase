import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import {
  allScreens,
  hostingStore,
  currentAsset,
  mainLayout,
  selectedComponent,
  selectedAccessRole,
} from "builderStore"
import {
  datasources,
  integrations,
  queries,
  database,
  tables,
} from "stores/backend"

import { fetchComponentLibDefinitions } from "../loadComponentLibraries"
import api from "../api"
import { FrontendTypes } from "constants"
import analytics from "analytics"
import {
  findComponentType,
  findComponentParent,
  findClosestMatchingComponent,
  findAllMatchingComponents,
} from "../storeUtils"
import { uuid } from "../uuid"
import { removeBindings } from "../dataBinding"

const INITIAL_FRONTEND_STATE = {
  apps: [],
  name: "",
  url: "",
  description: "",
  layouts: [],
  screens: [],
  components: [],
  clientFeatures: {
    spectrumThemes: false,
    intelligentLoading: false,
    deviceAwareness: false,
    state: false,
    customThemes: false,
  },
  currentFrontEndType: "none",
  selectedScreenId: "",
  selectedLayoutId: "",
  selectedComponentId: "",
  errors: [],
  hasAppPackage: false,
  libraries: null,
  appId: "",
  routes: {},
  clientLibPath: "",
  theme: "",
  customTheme: {},
}

export const getFrontendStore = () => {
  const store = writable({ ...INITIAL_FRONTEND_STATE })

  store.actions = {
    initialise: async pkg => {
      const { layouts, screens, application, clientLibPath } = pkg
      const components = await fetchComponentLibDefinitions(application.appId)
      store.update(state => ({
        ...state,
        libraries: application.componentLibraries,
        components,
        clientFeatures: {
          ...state.clientFeatures,
          ...components.features,
        },
        name: application.name,
        description: application.description,
        appId: application.appId,
        url: application.url,
        layouts,
        screens,
        theme: application.theme || "spectrum--light",
        customTheme: application.customTheme,
        hasAppPackage: true,
        appInstance: application.instance,
        clientLibPath,
        previousTopNavPath: {},
        version: application.version,
        revertableVersion: application.revertableVersion,
      }))
      await hostingStore.actions.fetch()

      // Initialise backend stores
      const [_integrations] = await Promise.all([
        api.get("/api/integrations").then(r => r.json()),
      ])
      datasources.init()
      integrations.set(_integrations)
      queries.init()
      database.set(application.instance)
      tables.init()
    },
    theme: {
      save: async theme => {
        const appId = get(store).appId
        const response = await api.put(`/api/applications/${appId}`, { theme })
        if (response.status === 200) {
          store.update(state => {
            state.theme = theme
            return state
          })
        } else {
          throw new Error("Error updating theme")
        }
      },
    },
    customTheme: {
      save: async customTheme => {
        const appId = get(store).appId
        const response = await api.put(`/api/applications/${appId}`, {
          customTheme,
        })
        if (response.status === 200) {
          store.update(state => {
            state.customTheme = customTheme
            return state
          })
        } else {
          throw new Error("Error updating theme")
        }
      },
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
        if (response.status !== 200) {
          return
        }
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

        // Abort if saving failed
        if (response.status !== 200) {
          return
        }

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
        if (!component) {
          return
        }

        // If this is the root component, select the asset instead
        const asset = get(currentAsset)
        const parent = findComponentParent(asset.props, component._id)
        if (parent == null) {
          const state = get(store)
          const isLayout = state.currentFrontEndType === FrontendTypes.LAYOUT
          if (isLayout) {
            store.actions.layouts.select(asset._id)
          } else {
            store.actions.screens.select(asset._id)
          }
          return
        }

        // Otherwise select the component
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
        if (!componentName.startsWith("@budibase")) {
          componentName = `@budibase/standard-components/${componentName}`
        }
        return get(store).components[componentName]
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
        if (componentName.endsWith("/formstep")) {
          const parentForm = findClosestMatchingComponent(
            get(currentAsset).props,
            get(selectedComponent)._id,
            component => component._component.endsWith("/form")
          )
          const formSteps = findAllMatchingComponents(parentForm, component =>
            component._component.endsWith("/formstep")
          )
          extras.step = formSteps.length + 1
          extras._instanceName = `Step ${formSteps.length + 1}`
        }

        return {
          _id: uuid(),
          _component: definition.component,
          _styles: { normal: {}, hover: {}, active: {} },
          _instanceName: `New ${definition.name}`,
          ...cloneDeep(props),
          ...extras,
        }
      },
      create: async (componentName, presetProps) => {
        const selected = get(selectedComponent)
        const asset = get(currentAsset)

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
        await store.actions.preview.saveSelected()
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
      delete: async component => {
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
        await store.actions.preview.saveSelected()
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

          // defines if this is a copy or a cut
          const cut = state.componentToPaste.isCut

          // immediately need to remove bindings, currently these aren't valid when pasted
          if (!cut) {
            state.componentToPaste = removeBindings(state.componentToPaste)
          }

          // Clone the component to paste
          // Retain the same ID if cutting as things may be referencing this component
          delete state.componentToPaste.isCut
          let componentToPaste = cloneDeep(state.componentToPaste)
          if (cut) {
            state.componentToPaste = null
          } else {
            const randomizeIds = component => {
              if (!component) {
                return
              }
              component._id = uuid()
              component._children?.forEach(randomizeIds)
            }
            randomizeIds(componentToPaste)
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
      updateStyle: async (name, value) => {
        const selected = get(selectedComponent)
        if (value == null || value === "") {
          delete selected._styles.normal[name]
        } else {
          selected._styles.normal[name] = value
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
      updateConditions: async conditions => {
        const selected = get(selectedComponent)
        selected._conditions = conditions
        await store.actions.preview.saveSelected()
      },
      updateProp: async (name, value) => {
        let component = get(selectedComponent)
        if (!name || !component) {
          return
        }
        component[name] = value
        store.update(state => {
          state.selectedComponentId = component._id
          return state
        })
        await store.actions.preview.saveSelected()
      },
      links: {
        save: async (url, title) => {
          const layout = get(mainLayout)
          if (!layout) {
            return
          }

          // Add link setting to main layout
          if (layout.props._component.endsWith("layout")) {
            // If using a new SDK, add to the layout component settings
            if (!layout.props.links) {
              layout.props.links = []
            }
            layout.props.links.push({
              text: title,
              url,
            })
          } else {
            // If using an old SDK, add to the navigation component
            // TODO: remove this when we can assume everyone has updated
            const nav = findComponentType(
              layout.props,
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
              nav._children = [...nav._children, newLink]
            }
          }

          // Save layout
          await store.actions.layouts.save(layout)
        },
      },
    },
  }

  return store
}
