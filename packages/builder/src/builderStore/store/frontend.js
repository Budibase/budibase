import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { selectedScreen, selectedComponent } from "builderStore"
import {
  datasources,
  integrations,
  queries,
  database,
  tables,
} from "stores/backend"
import { API } from "api"
import analytics, { Events } from "analytics"
import {
  findComponentParent,
  findClosestMatchingComponent,
  findAllMatchingComponents,
  findComponent,
  getComponentSettings,
  makeComponentUnique,
} from "../componentUtils"
import { Helpers } from "@budibase/bbui"
import { Utils } from "@budibase/frontend-core"

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
    rowSelection: false,
    customThemes: false,
    devicePreview: false,
    messagePassing: false,
    continueIfAction: false,
    showNotificationAction: false,
  },
  errors: [],
  hasAppPackage: false,
  libraries: null,
  appId: "",
  routes: {},
  clientLibPath: "",
  theme: "",
  customTheme: {},
  previewDevice: "desktop",
  highlightedSettingKey: null,

  // URL params
  selectedScreenId: null,
  selectedComponentId: null,
  selectedLayoutId: null,
}

export const getFrontendStore = () => {
  const store = writable({ ...INITIAL_FRONTEND_STATE })

  // This is a fake implementation of a "patch" API endpoint to try and prevent
  // 409s. All screen doc mutations (aside from creation) use this function,
  // which queues up invocations sequentially and ensures pending mutations are
  // always applied to the most up-to-date doc revision.
  // This is slightly better than just a traditional "patch" endpoint and this
  // supports deeply mutating the current doc rather than just appending data.
  const sequentialScreenPatch = Utils.sequential(async (patchFn, screenId) => {
    const state = get(store)
    const screen = state.screens.find(screen => screen._id === screenId)
    if (!screen) {
      return
    }
    let clone = cloneDeep(screen)
    const result = patchFn(clone)
    if (result === false) {
      return
    }
    return await store.actions.screens.save(clone)
  })

  store.actions = {
    reset: () => {
      store.set({ ...INITIAL_FRONTEND_STATE })
    },
    initialise: async pkg => {
      const { layouts, screens, application, clientLibPath } = pkg

      // Fetch component definitions.
      // Allow errors to propagate.
      let components = await API.fetchComponentLibDefinitions(application.appId)

      // Reset store state
      store.update(state => ({
        ...state,
        libraries: application.componentLibraries,
        components,
        clientFeatures: {
          ...INITIAL_FRONTEND_STATE.clientFeatures,
          ...components.features,
        },
        name: application.name,
        description: application.description,
        appId: application.appId,
        url: application.url,
        layouts: layouts || [],
        screens: screens || [],
        theme: application.theme || "spectrum--light",
        customTheme: application.customTheme,
        hasAppPackage: true,
        appInstance: application.instance,
        clientLibPath,
        previousTopNavPath: {},
        version: application.version,
        revertableVersion: application.revertableVersion,
        navigation: application.navigation || {},
      }))

      // Initialise backend stores
      database.set(application.instance)
      await datasources.init()
      await integrations.init()
      await queries.init()
      await tables.init()
    },
    theme: {
      save: async theme => {
        const appId = get(store).appId
        const app = await API.saveAppMetadata({
          appId,
          metadata: { theme },
        })
        store.update(state => {
          state.theme = app.theme
          return state
        })
      },
    },
    customTheme: {
      save: async customTheme => {
        const appId = get(store).appId
        const app = await API.saveAppMetadata({
          appId,
          metadata: { customTheme },
        })
        store.update(state => {
          state.customTheme = app.customTheme
          return state
        })
      },
    },
    navigation: {
      save: async navigation => {
        const appId = get(store).appId
        const app = await API.saveAppMetadata({
          appId,
          metadata: { navigation },
        })
        store.update(state => {
          state.navigation = app.navigation
          return state
        })
      },
    },
    screens: {
      select: screenId => {
        // Check this screen exists
        const state = get(store)
        const screen = state.screens.find(screen => screen._id === screenId)
        if (!screen) {
          return
        }

        // Check screen isn't already selected
        if (
          state.selectedScreenId === screen._id &&
          state.selectedComponentId === screen.props?._id
        ) {
          return
        }

        // Select new screen
        store.update(state => {
          state.selectedScreenId = screen._id
          state.selectedComponentId = screen.props?._id
          return state
        })
      },
      save: async screen => {
        const creatingNewScreen = screen._id === undefined
        const savedScreen = await API.saveScreen(screen)
        const routesResponse = await API.fetchAppRoutes()
        store.update(state => {
          // Update screen object
          const idx = state.screens.findIndex(x => x._id === savedScreen._id)
          if (idx !== -1) {
            state.screens.splice(idx, 1, savedScreen)
          } else {
            state.screens.push(savedScreen)
          }

          // Select the new screen if creating a new one
          if (creatingNewScreen) {
            state.selectedScreenId = savedScreen._id
            state.selectedComponentId = savedScreen.props._id
          }

          // Update routes
          state.routes = routesResponse.routes

          return state
        })
        return savedScreen
      },
      patch: async (patchFn, screenId) => {
        // Default to the currently selected screen
        if (!screenId) {
          const state = get(store)
          screenId = state.selectedScreenId
        }
        if (!screenId || !patchFn) {
          return
        }
        return await sequentialScreenPatch(patchFn, screenId)
      },
      delete: async screens => {
        const screensToDelete = Array.isArray(screens) ? screens : [screens]

        // Build array of promises to speed up bulk deletions
        const promises = []
        let deleteUrls = []
        screensToDelete.forEach(screen => {
          // Delete the screen
          promises.push(
            API.deleteScreen({
              screenId: screen._id,
              screenRev: screen._rev,
            })
          )
          // Remove links to this screen
          deleteUrls.push(screen.routing.route)
        })

        promises.push(store.actions.links.delete(deleteUrls))
        await Promise.all(promises)
        const deletedIds = screensToDelete.map(screen => screen._id)
        const routesResponse = await API.fetchAppRoutes()
        store.update(state => {
          // Remove deleted screens from state
          state.screens = state.screens.filter(screen => {
            return !deletedIds.includes(screen._id)
          })

          // Deselect the current screen if it was deleted
          if (deletedIds.includes(state.selectedScreenId)) {
            state.selectedScreenId = null
            state.selectedComponentId = null
          }

          // Update routing
          state.routes = routesResponse.routes

          return state
        })
      },
      updateSetting: async (screen, name, value) => {
        if (!screen || !name) {
          return
        }

        // Apply setting update
        const patch = screen => {
          if (!screen) {
            return false
          }
          // Skip update if the value is the same
          if (Helpers.deepGet(screen, name) === value) {
            return false
          }
          Helpers.deepSet(screen, name, value)
        }
        await store.actions.screens.patch(patch, screen._id)

        // Ensure we don't have more than one home screen for this new role.
        // This could happen after updating multiple different settings.
        const state = get(store)
        const updatedScreen = state.screens.find(s => s._id === screen._id)
        if (!updatedScreen) {
          return
        }
        const otherHomeScreens = state.screens.filter(s => {
          return (
            s.routing.roleId === updatedScreen.routing.roleId &&
            s.routing.homeScreen &&
            s._id !== screen._id
          )
        })
        if (otherHomeScreens.length) {
          const patch = screen => {
            screen.routing.homeScreen = false
          }
          for (let otherHomeScreen of otherHomeScreens) {
            await store.actions.screens.patch(patch, otherHomeScreen._id)
          }
        }
      },
      removeCustomLayout: async screen => {
        // Pull relevant settings from old layout, if required
        const layout = get(store).layouts.find(x => x._id === screen.layoutId)
        const patch = screen => {
          screen.layoutId = null
          screen.showNavigation = layout?.props.navigation !== "None"
          screen.width = layout?.props.width || "Large"
        }
        await store.actions.screens.patch(patch, screen._id)
      },
    },
    preview: {
      setDevice: device => {
        store.update(state => {
          state.previewDevice = device
          return state
        })
      },
    },
    layouts: {
      select: layoutId => {
        // Check this layout exists
        const state = get(store)
        const layout = state.layouts.find(layout => layout._id === layoutId)
        if (!layout) {
          return
        }

        // Check layout isn't already selected
        if (
          state.selectedLayoutId === layout._id &&
          state.selectedComponentId === layout.props?._id
        ) {
          return
        }

        // Select new layout
        store.update(state => {
          state.selectedLayoutId = layout._id
          state.selectedComponentId = layout.props?._id
          return state
        })
      },
      delete: async layout => {
        if (!layout?._id) {
          return
        }
        await API.deleteLayout({
          layoutId: layout._id,
          layoutRev: layout._rev,
        })
        store.update(state => {
          state.layouts = state.layouts.filter(x => x._id !== layout._id)
          return state
        })
      },
    },
    components: {
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
        const settings = getComponentSettings(componentName)
        let props = { ...presetProps }
        settings.forEach(setting => {
          if (setting.defaultValue !== undefined) {
            props[setting.key] = setting.defaultValue
          }
        })

        // Add any extra properties the component needs
        let extras = {}
        if (definition.hasChildren) {
          extras._children = []
        }
        if (componentName.endsWith("/formstep")) {
          const parentForm = findClosestMatchingComponent(
            get(selectedScreen).props,
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
          _id: Helpers.uuid(),
          _component: definition.component,
          _styles: { normal: {}, hover: {}, active: {} },
          _instanceName: `New ${definition.name}`,
          ...cloneDeep(props),
          ...extras,
        }
      },
      create: async (componentName, presetProps) => {
        const state = get(store)
        const componentInstance = store.actions.components.createInstance(
          componentName,
          presetProps
        )
        if (!componentInstance) {
          return
        }

        // Patch selected screen
        await store.actions.screens.patch(screen => {
          // Find the selected component
          const currentComponent = findComponent(
            screen.props,
            state.selectedComponentId
          )
          if (!currentComponent) {
            return false
          }

          // Find parent node to attach this component to
          let parentComponent
          if (currentComponent) {
            // Use selected component as parent if one is selected
            const definition = store.actions.components.getDefinition(
              currentComponent._component
            )
            if (definition?.hasChildren) {
              // Use selected component if it allows children
              parentComponent = currentComponent
            } else {
              // Otherwise we need to use the parent of this component
              parentComponent = findComponentParent(
                screen.props,
                currentComponent._id
              )
            }
          } else {
            // Use screen or layout if no component is selected
            parentComponent = screen.props
          }

          // Attach new component
          if (!parentComponent) {
            return false
          }
          if (!parentComponent._children) {
            parentComponent._children = []
          }
          parentComponent._children.push(componentInstance)
        })

        // Select new component
        store.update(state => {
          state.selectedComponentId = componentInstance._id
          return state
        })

        // Log event
        analytics.captureEvent(Events.COMPONENT_CREATED, {
          name: componentInstance._component,
        })

        return componentInstance
      },
      patch: async (patchFn, componentId, screenId) => {
        // Use selected component by default
        if (!componentId && !screenId) {
          const state = get(store)
          componentId = state.selectedComponentId
          screenId = state.selectedScreenId
        }
        // Invalid if only a screen or component ID provided
        if (!componentId || !screenId || !patchFn) {
          return
        }
        const patchScreen = screen => {
          let component = findComponent(screen.props, componentId)
          if (!component) {
            return false
          }
          return patchFn(component, screen)
        }
        await store.actions.screens.patch(patchScreen, screenId)
      },
      delete: async component => {
        if (!component) {
          return
        }

        // Determine the next component to select after deletion
        const state = get(store)
        let nextSelectedComponentId
        if (state.selectedComponentId === component._id) {
          nextSelectedComponentId = store.actions.components.getNext()
          if (!nextSelectedComponentId) {
            nextSelectedComponentId = store.actions.components.getPrevious()
          }
        }

        // Patch screen
        await store.actions.screens.patch(screen => {
          // Check component exists
          component = findComponent(screen.props, component._id)
          if (!component) {
            return false
          }

          // Check component has a valid parent
          const parent = findComponentParent(screen.props, component._id)
          if (!parent) {
            return false
          }
          parent._children = parent._children.filter(
            child => child._id !== component._id
          )
        })

        // Update selected component if required
        if (nextSelectedComponentId) {
          store.update(state => {
            state.selectedComponentId = nextSelectedComponentId
            return state
          })
        }
      },
      copy: (component, cut = false, selectParent = true) => {
        // Update store with copied component
        store.update(state => {
          state.componentToPaste = cloneDeep(component)
          state.componentToPaste.isCut = cut
          return state
        })

        // Select the parent if cutting
        if (cut) {
          const screen = get(selectedScreen)
          const parent = findComponentParent(screen?.props, component._id)
          if (parent) {
            if (selectParent) {
              store.update(state => {
                state.selectedComponentId = parent._id
                return state
              })
            }
          }
        }
      },
      paste: async (targetComponent, mode, targetScreen) => {
        const state = get(store)
        if (!state.componentToPaste) {
          return
        }
        let newComponentId

        // Patch screen
        const patch = screen => {
          // Get up to date ref to target
          targetComponent = findComponent(screen.props, targetComponent._id)
          if (!targetComponent) {
            return
          }
          const cut = state.componentToPaste.isCut
          const originalId = state.componentToPaste._id
          let componentToPaste = cloneDeep(state.componentToPaste)
          delete componentToPaste.isCut

          // Make new component unique if copying
          if (!cut) {
            makeComponentUnique(componentToPaste)
          }
          newComponentId = componentToPaste._id

          // Delete old component if cutting
          if (cut) {
            const parent = findComponentParent(screen.props, originalId)
            if (parent?._children) {
              parent._children = parent._children.filter(
                component => component._id !== originalId
              )
            }
          }

          // Check inside is valid
          if (mode === "inside") {
            const definition = store.actions.components.getDefinition(
              targetComponent._component
            )
            if (!definition.hasChildren) {
              mode = "below"
            }
          }

          // Paste new component
          if (mode === "inside") {
            // Paste inside target component if chosen
            if (!targetComponent._children) {
              targetComponent._children = []
            }
            targetComponent._children.push(componentToPaste)
          } else {
            // Otherwise paste in the correct order in the parent's children
            const parent = findComponentParent(
              screen.props,
              targetComponent._id
            )
            if (!parent?._children) {
              return false
            }
            const targetIndex = parent._children.findIndex(component => {
              return component._id === targetComponent._id
            })
            const index = mode === "above" ? targetIndex : targetIndex + 1
            parent._children.splice(index, 0, componentToPaste)
          }
        }
        const targetScreenId = targetScreen?._id || state.selectedScreenId
        await store.actions.screens.patch(patch, targetScreenId)

        store.update(state => {
          // Remove copied component if cutting
          if (state.componentToPaste.isCut) {
            delete state.componentToPaste
          }
          state.selectedScreenId = targetScreenId
          state.selectedComponentId = newComponentId
          return state
        })
      },
      getPrevious: () => {
        const state = get(store)
        const componentId = state.selectedComponentId
        const screen = get(selectedScreen)
        const parent = findComponentParent(screen.props, componentId)

        // Check we aren't right at the top of the tree
        const index = parent?._children.findIndex(x => x._id === componentId)
        if (!parent || componentId === screen.props._id) {
          return null
        }

        // If we have siblings above us, choose the sibling or a descendant
        if (index > 0) {
          // If sibling before us accepts children, select a descendant
          const previousSibling = parent._children[index - 1]
          if (previousSibling._children?.length) {
            let target = previousSibling
            while (target._children?.length) {
              target = target._children[target._children.length - 1]
            }
            return target._id
          }

          // Otherwise just select sibling
          return previousSibling._id
        }

        // If no siblings above us, select the parent
        return parent._id
      },
      getNext: () => {
        const component = get(selectedComponent)
        const componentId = component?._id
        const screen = get(selectedScreen)
        const parent = findComponentParent(screen.props, componentId)
        const index = parent?._children.findIndex(x => x._id === componentId)

        // If we have children, select first child
        if (component._children?.length) {
          return component._children[0]._id
        } else if (!parent) {
          return null
        }

        // Otherwise select the next sibling if we have one
        if (index < parent._children.length - 1) {
          const nextSibling = parent._children[index + 1]
          return nextSibling._id
        }

        // Last child, select our parents next sibling
        let target = parent
        let targetParent = findComponentParent(screen.props, target._id)
        let targetIndex = targetParent?._children.findIndex(
          child => child._id === target._id
        )
        while (
          targetParent != null &&
          targetIndex === targetParent._children?.length - 1
        ) {
          target = targetParent
          targetParent = findComponentParent(screen.props, target._id)
          targetIndex = targetParent?._children.findIndex(
            child => child._id === target._id
          )
        }
        if (targetParent) {
          return targetParent._children[targetIndex + 1]._id
        } else {
          return null
        }
      },
      selectPrevious: () => {
        const previousId = store.actions.components.getPrevious()
        if (previousId) {
          store.update(state => {
            state.selectedComponentId = previousId
            return state
          })
        }
      },
      selectNext: () => {
        const nextId = store.actions.components.getNext()
        if (nextId) {
          store.update(state => {
            state.selectedComponentId = nextId
            return state
          })
        }
      },
      moveUp: async component => {
        await store.actions.screens.patch(screen => {
          const componentId = component?._id
          const parent = findComponentParent(screen.props, componentId)

          // Check we aren't right at the top of the tree
          const index = parent?._children.findIndex(x => x._id === componentId)
          if (!parent || (index === 0 && parent._id === screen.props._id)) {
            return
          }

          // Copy original component and remove it from the parent
          const originalComponent = cloneDeep(parent._children[index])
          parent._children = parent._children.filter(
            component => component._id !== componentId
          )

          // If we have siblings above us, move up
          if (index > 0) {
            // If sibling before us accepts children, move to last child of
            // sibling
            const previousSibling = parent._children[index - 1]
            const definition = store.actions.components.getDefinition(
              previousSibling._component
            )
            if (definition.hasChildren) {
              previousSibling._children.push(originalComponent)
            }

            // Otherwise just move component above sibling
            else {
              parent._children.splice(index - 1, 0, originalComponent)
            }
          }

          // If no siblings above us, go above the parent as long as it isn't
          // the screen
          else if (parent._id !== screen.props._id) {
            const grandParent = findComponentParent(screen.props, parent._id)
            const parentIndex = grandParent._children.findIndex(
              child => child._id === parent._id
            )
            grandParent._children.splice(parentIndex, 0, originalComponent)
          }
        })
      },
      moveDown: async component => {
        await store.actions.screens.patch(screen => {
          const componentId = component?._id
          const parent = findComponentParent(screen.props, componentId)

          // Sanity check parent is found
          if (!parent?._children?.length) {
            return false
          }

          // Check we aren't right at the bottom of the tree
          const index = parent._children.findIndex(x => x._id === componentId)
          if (
            index === parent._children.length - 1 &&
            parent._id === screen.props._id
          ) {
            return
          }

          // Copy the original component and remove from parent
          const originalComponent = cloneDeep(parent._children[index])
          parent._children = parent._children.filter(
            component => component._id !== componentId
          )

          // Move below the next sibling if we are not the last sibling
          if (index < parent._children.length) {
            // If the next sibling has children, become the first child
            const nextSibling = parent._children[index]
            const definition = store.actions.components.getDefinition(
              nextSibling._component
            )
            if (definition.hasChildren) {
              nextSibling._children.splice(0, 0, originalComponent)
            }

            // Otherwise move below next sibling
            else {
              parent._children.splice(index + 1, 0, originalComponent)
            }
          }

          // Last child, so move below our parent
          else {
            const grandParent = findComponentParent(screen.props, parent._id)
            const parentIndex = grandParent._children.findIndex(
              child => child._id === parent._id
            )
            grandParent._children.splice(parentIndex + 1, 0, originalComponent)
          }
        })
      },
      updateStyle: async (name, value) => {
        await store.actions.components.patch(component => {
          if (value == null || value === "") {
            delete component._styles.normal[name]
          } else {
            component._styles.normal[name] = value
          }
        })
      },
      updateCustomStyle: async style => {
        await store.actions.components.patch(component => {
          component._styles.custom = style
        })
      },
      updateConditions: async conditions => {
        await store.actions.components.patch(component => {
          component._conditions = conditions
        })
      },
      updateSetting: async (name, value) => {
        await store.actions.components.patch(component => {
          if (!name || !component) {
            return false
          }
          // Skip update if the value is the same
          if (component[name] === value) {
            return false
          }
          component[name] = value
        })
      },
    },
    links: {
      save: async (url, title) => {
        const navigation = get(store).navigation
        let links = [...navigation?.links]

        // Skip if we have an identical link
        if (links.find(link => link.url === url && link.text === title)) {
          return
        }

        links.push({
          text: title,
          url,
        })
        await store.actions.navigation.save({
          ...navigation,
          links: [...links],
        })
      },
      delete: async urls => {
        const navigation = get(store).navigation
        let links = navigation?.links
        if (!links?.length) {
          return
        }

        // Filter out the URLs to delete
        urls = Array.isArray(urls) ? urls : [urls]
        links = links.filter(link => !urls.includes(link.url))

        await store.actions.navigation.save({
          ...navigation,
          links,
        })
      },
    },
    settings: {
      highlight: key => {
        store.update(state => ({
          ...state,
          highlightedSettingKey: key,
        }))
      },
    },
  }

  return store
}
