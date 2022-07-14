import { get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { currentAsset, mainLayout, selectedComponent } from "builderStore"
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
  findComponentType,
  findComponentParent,
  findClosestMatchingComponent,
  findAllMatchingComponents,
  findComponent,
  getComponentSettings,
  makeComponentUnique,
} from "../componentUtils"
import { Helpers } from "@budibase/bbui"
import { DefaultAppTheme, LAYOUT_NAMES } from "../../constants"
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

  store.subscribe(state => {
    console.log("new state")
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

      // Add navigation settings to old apps
      if (!application.navigation) {
        const layout = layouts.find(x => x._id === LAYOUT_NAMES.MASTER.PRIVATE)
        const customTheme = application.customTheme
        let navigationSettings = {
          navigation: "Top",
          title: application.name,
          navWidth: "Large",
          navBackground:
            customTheme?.navBackground || DefaultAppTheme.navBackground,
          navTextColor:
            customTheme?.navTextColor || DefaultAppTheme.navTextColor,
        }
        if (layout) {
          navigationSettings.hideLogo = layout.props.hideLogo
          navigationSettings.hideTitle = layout.props.hideTitle
          navigationSettings.title = layout.props.title || application.name
          navigationSettings.logoUrl = layout.props.logoUrl
          navigationSettings.links = layout.props.links
          navigationSettings.navigation = layout.props.navigation || "Top"
          navigationSettings.sticky = layout.props.sticky
          navigationSettings.navWidth = layout.props.width || "Large"
          if (navigationSettings.navigation === "None") {
            navigationSettings.navigation = "Top"
          }
        }
        await store.actions.navigation.save(navigationSettings)
      }
    },
    theme: {
      save: async theme => {
        const appId = get(store).appId
        await API.saveAppMetadata({
          appId,
          metadata: { theme },
        })
        store.update(state => {
          state.theme = theme
          return state
        })
      },
    },
    customTheme: {
      save: async customTheme => {
        const appId = get(store).appId
        await API.saveAppMetadata({
          appId,
          metadata: { customTheme },
        })
        store.update(state => {
          state.customTheme = customTheme
          return state
        })
      },
    },
    navigation: {
      save: async navigation => {
        const appId = get(store).appId
        await API.saveAppMetadata({
          appId,
          metadata: { navigation },
        })
        store.update(state => {
          state.navigation = navigation
          return state
        })
      },
    },
    screens: {
      select: screenId => {
        // Check this screen exists
        const state = get(store)
        const screen = state.screens.find(screen => screen._id === screenId)
        console.log(screen)
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
      patch: Utils.sequential(async (screenId, patchFn) => {
        const state = get(store)
        const screen = state.screens.find(screen => screen._id === screenId)
        if (!screen) {
          return
        }
        let clone = cloneDeep(screen)
        patchFn(clone)
        return await store.actions.screens.save(clone)
      }),
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
      updateHomeScreen: async (screen, makeHomeScreen = true) => {
        let promises = []

        // Find any existing home screen for this role so we can remove it,
        // if we are setting this to be the new home screen
        if (makeHomeScreen) {
          const roleId = screen.routing.roleId
          let existingHomeScreen = get(store).screens.find(s => {
            return (
              s.routing.roleId === roleId &&
              s.routing.homeScreen &&
              s._id !== screen._id
            )
          })
          if (existingHomeScreen) {
            const patch = screen => (screen.routing.homeScreen = false)
            promises.push(
              store.actions.screens.patch(existingHomeScreen._id, patch)
            )
          }
        }

        // Update the passed in screen
        const patch = screen => (screen.routing.homeScreen = makeHomeScreen)
        promises.push(store.actions.screens.patch(screen._id, patch))
        return await Promise.all(promises)
      },
      removeCustomLayout: async screen => {
        // Pull relevant settings from old layout, if required
        const layout = get(store).layouts.find(x => x._id === screen.layoutId)
        const patch = screen => {
          screen.layoutId = null
          screen.showNavigation = layout?.props.navigation !== "None"
          screen.width = layout?.props.width || "Large"
        }
        await store.actions.screens.patch(screen._id, patch)
      },
    },
    preview: {
      saveSelected: async () => {
        const selectedAsset = get(currentAsset)
        return await store.actions.screens.save(selectedAsset)
      },
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
          _id: Helpers.uuid(),
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
        if (!componentInstance || !asset) {
          return
        }

        // Find parent node to attach this component to
        let parentComponent
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
            parentComponent = findComponentParent(asset?.props, selected._id)
          }
        } else {
          // Use screen or layout if no component is selected
          parentComponent = asset?.props
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
          state.selectedComponentId = componentInstance._id
          return state
        })

        // Log event
        analytics.captureEvent(Events.COMPONENT_CREATED, {
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

        // Fetch full definition
        component = findComponent(asset.props, component._id)

        // Ensure we aren't deleting the screen slot
        if (component._component?.endsWith("/screenslot")) {
          throw "You can't delete the screen slot"
        }

        // Ensure we aren't deleting something that contains the screen slot
        const screenslot = findComponentType(
          component,
          "@budibase/standard-components/screenslot"
        )
        if (screenslot != null) {
          throw "You can't delete a component that contains the screen slot"
        }

        const parent = findComponentParent(asset.props, component._id)
        if (parent) {
          parent._children = parent._children.filter(
            child => child._id !== component._id
          )
          store.update(state => {
            state.selectedComponentId = parent._id
            return state
          })
        }
        await store.actions.preview.saveSelected()
      },
      copy: (component, cut = false, selectParent = true) => {
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
            if (selectParent) {
              store.update(state => {
                state.selectedComponentId = parent._id
                return state
              })
            }
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
          const cut = state.componentToPaste.isCut

          // Clone the component to paste and make unique if copying
          delete state.componentToPaste.isCut
          let componentToPaste = cloneDeep(state.componentToPaste)
          if (cut) {
            state.componentToPaste = null
          } else {
            makeComponentUnique(componentToPaste)
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
          state.selectedComponentId = componentToPaste._id
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
        if (component[name] === value) {
          return
        }
        component[name] = value
        store.update(state => {
          state.selectedComponentId = component._id
          return state
        })
        await store.actions.preview.saveSelected()
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
