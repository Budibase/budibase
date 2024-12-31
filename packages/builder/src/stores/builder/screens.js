import { derived, get } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { Helpers } from "@budibase/bbui"
import { RoleUtils, Utils } from "@budibase/frontend-core"
import { findAllMatchingComponents } from "@/helpers/components"
import {
  layoutStore,
  appStore,
  componentStore,
  navigationStore,
  selectedComponent,
} from "@/stores/builder"
import { createHistoryStore } from "@/stores/builder/history"
import { API } from "@/api"
import { BudiStore } from "../BudiStore"

export const INITIAL_SCREENS_STATE = {
  screens: [],
  selectedScreenId: null,
}

export class ScreenStore extends BudiStore {
  constructor() {
    super(INITIAL_SCREENS_STATE)

    // Bind scope
    this.select = this.select.bind(this)
    this.reset = this.reset.bind(this)
    this.syncAppScreens = this.syncAppScreens.bind(this)
    this.validate = this.validate.bind(this)
    this.patch = this.patch.bind(this)
    this.replace = this.replace.bind(this)
    this.saveScreen = this.saveScreen.bind(this)
    this.deleteScreen = this.deleteScreen.bind(this)
    this.syncScreenData = this.syncScreenData.bind(this)
    this.updateSetting = this.updateSetting.bind(this)
    this.sequentialScreenPatch = this.sequentialScreenPatch.bind(this)
    this.removeCustomLayout = this.removeCustomLayout.bind(this)

    this.history = createHistoryStore({
      getDoc: id => get(this.store).screens?.find(screen => screen._id === id),
      selectDoc: this.select,
      afterAction: () => {
        // Ensure a valid component is selected
        if (!get(selectedComponent)) {
          this.update(state => ({
            ...state,
            selectedComponentId: get(this.store).selected?.props._id,
          }))
        }
      },
    })

    this.delete = this.history.wrapDeleteDoc(this.deleteScreen)
    this.save = this.history.wrapSaveDoc(this.saveScreen)
  }

  /**
   * Reset entire store back to base config
   */
  reset() {
    this.store.set({ ...INITIAL_SCREENS_STATE })
  }

  /**
   * Replace ALL store screens with application package screens
   * @param {object} pkg
   */
  syncAppScreens(pkg) {
    this.update(state => ({
      ...state,
      screens: [...pkg.screens],
    }))
  }

  /**
   * Uses a screen _id value to find the corresponding screen in the
   * store. If found, the _id is persisted as selectedScreenId
   * @param {string} screenId
   * @returns
   */
  select(screenId) {
    // Check this screen exists
    const state = get(this.store)
    const screen = state.screens.find(screen => screen._id === screenId)
    if (!screen) {
      return
    }

    // Check screen isn't already selected
    if (state.selectedScreenId === screen._id) {
      return
    }

    // Select new screen
    this.update(state => {
      state.selectedScreenId = screen._id
      return state
    })
  }

  /**
   * Recursively parses the entire screen doc and checks for components
   * violating illegal child configurations.
   *
   * @param {object} screen
   * @throws Will throw an error containing the name of the component causing
   * the invalid screen state
   */
  validate(screen) {
    // Recursive function to find any illegal children in component trees
    const findIllegalChild = (
      component,
      illegalChildren = [],
      legalDirectChildren = []
    ) => {
      const type = component._component

      if (illegalChildren.includes(type)) {
        return type
      }
      if (legalDirectChildren.length && !legalDirectChildren.includes(type)) {
        return type
      }
      if (!component?._children?.length) {
        return
      }

      // Sidepanels and modals can be nested anywhere in the component tree, but really they are always rendered at the top level.
      // Because of this, it doesn't make sense to carry over any parent illegal children to them, so the array is reset here.
      if (
        [
          "@budibase/standard-components/sidepanel",
          "@budibase/standard-components/modal",
        ].includes(type)
      ) {
        illegalChildren = []
      }

      const definition = componentStore.getDefinition(component._component)
      // Reset whitelist for direct children
      legalDirectChildren = []
      if (definition?.legalDirectChildren?.length) {
        legalDirectChildren = definition.legalDirectChildren.map(x => {
          return `@budibase/standard-components/${x}`
        })
      }

      // Append blacklisted components and remove duplicates
      if (definition?.illegalChildren?.length) {
        const blacklist = definition.illegalChildren.map(x => {
          return `@budibase/standard-components/${x}`
        })
        illegalChildren = [...new Set([...illegalChildren, ...blacklist])]
      }

      // Recurse on all children
      for (let child of component._children) {
        const illegalChild = findIllegalChild(
          child,
          illegalChildren,
          legalDirectChildren
        )
        if (illegalChild) {
          return illegalChild
        }
      }
    }

    // Validate the entire tree and throw an error if an illegal child is
    // found anywhere
    const illegalChild = findIllegalChild(screen.props)
    if (illegalChild) {
      const def = componentStore.getDefinition(illegalChild)
      throw `You can't place a ${def.name} here`
    }
  }

  /**
   * Core save method. If creating a new screen, the store will sync the target
   * screen id to ensure that it is selected in the builder
   *
   * @param {object} screen
   * @returns {object}
   */
  async saveScreen(screen) {
    const appState = get(appStore)

    // Validate screen structure if the app supports it
    if (appState.features?.componentValidation) {
      this.validate(screen)
    }

    // Check screen definition for any component settings which need updated
    this.enrichEmptySettings(screen)

    // Save screen
    const creatingNewScreen = screen._id === undefined
    const savedScreen = await API.saveScreen(screen)

    // Update state
    this.update(state => {
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

        componentStore.update(state => ({
          ...state,
          selectedComponentId: savedScreen.props._id,
        }))
      }

      return state
    })

    await this.syncScreenData(savedScreen)

    return savedScreen
  }

  /**
   * After saving a screen, sync plugins and routes to the appStore
   * @param {object} savedScreen
   */
  async syncScreenData(savedScreen) {
    const appState = get(appStore)
    // If plugins changed we need to fetch the latest app metadata
    let usedPlugins = appState.usedPlugins
    if (savedScreen.pluginAdded) {
      const { application } = await API.fetchAppPackage(appState.appId)
      usedPlugins = application.usedPlugins || []
    }

    const routesResponse = await API.fetchAppRoutes()

    appStore.update(state => ({
      ...state,
      routes: routesResponse.routes,
      usedPlugins: usedPlugins,
    }))
  }

  /**
   * This is a fake implementation of a "patch" API endpoint to try and prevent
   * 409s. All screen doc mutations (aside from creation) use this function,
   * which queues up invocations sequentially and ensures pending mutations are
   * always applied to the most up-to-date doc revision.
   * This is slightly better than just a traditional "patch" endpoint and this
   * supports deeply mutating the current doc rather than just appending data.
   */
  sequentialScreenPatch = Utils.sequential(async (patchFn, screenId) => {
    const state = get(this.store)
    const screen = state.screens.find(screen => screen._id === screenId)
    if (!screen) {
      return
    }
    let clone = cloneDeep(screen)
    const result = patchFn(clone)

    // An explicit false result means skip this change
    if (result === false) {
      return
    }
    return this.save(clone)
  })

  /**
   * @param {function} patchFn
   * @param {string | null} screenId
   * @returns
   */
  async patch(patchFn, screenId) {
    // Default to the currently selected screen
    if (!screenId) {
      const state = get(this.store)
      screenId = state.selectedScreenId
    }
    if (!screenId || !patchFn) {
      return
    }
    return await this.sequentialScreenPatch(patchFn, screenId)
  }

  /**
   * Search the store by screen _id and replace the target with
   * the screen supplied. If no screen is provided, the target has
   * been removed by another user and will be filtered from the store.
   * Used to marshal updates for the websocket
   * @param {string} screenId
   * @param {object} screen
   * @returns
   */
  async replace(screenId, screen) {
    if (!screenId) {
      return
    }
    if (!screen) {
      // Screen deletion
      this.update(state => ({
        ...state,
        screens: state.screens.filter(x => x._id !== screenId),
      }))
    } else {
      const index = get(this.store).screens.findIndex(x => x._id === screen._id)
      if (index === -1) {
        // Screen addition
        this.update(state => ({
          ...state,
          screens: [...state.screens, screen],
        }))
      } else {
        // Screen update
        this.update(state => {
          state.screens[index] = screen
          return state
        })
      }
    }
  }

  /**
   * Takes one or more screens and builds an async delete for each.
   * Once the deletes are processed, the deleted screens are
   * filtered from the store by doc _id.
   *
   * Any deleted screens will then have their routes/links purged
   *
   * Wrapped by {@link delete}
   * @param {object | array} screens
   * @returns
   */
  async deleteScreen(screens) {
    const screensToDelete = Array.isArray(screens) ? screens : [screens]
    // Build array of promises to speed up bulk deletions
    let promises = []
    let deleteUrls = []
    screensToDelete.forEach(screen => {
      // Delete the screen
      promises.push(API.deleteScreen(screen._id, screen._rev))
      // Remove links to this screen
      deleteUrls.push(screen.routing.route)
    })
    await Promise.all(promises)
    await navigationStore.deleteLink(deleteUrls)
    const deletedIds = screensToDelete.map(screen => screen._id)
    const routesResponse = await API.fetchAppRoutes()
    this.update(state => {
      // Remove deleted screens from state
      state.screens = state.screens.filter(screen => {
        return !deletedIds.includes(screen._id)
      })

      // Deselect the current screen if it was deleted
      if (deletedIds.includes(state.selectedScreenId)) {
        state.selectedScreenId = null
        componentStore.update(state => ({
          ...state,
          selectedComponentId: null,
        }))
      }

      // Update routing
      appStore.update(state => ({
        ...state,
        routes: routesResponse.routes,
      }))

      return state
    })
    return null
  }

  /**
   * Update a screen by deep setting a property value by name
   *
   * After a successful update, this method ensures that there is only
   * ONE home screen per user Role.
   *
   * @param {object} screen
   * @param {string} name e.g "routing.homeScreen" or "showNavigation"
   * @param {any} value
   * @returns
   */
  async updateSetting(screen, name, value) {
    if (!screen || !name) {
      return
    }

    // Apply setting update
    const patchFn = screen => {
      if (!screen) {
        return false
      }
      // Skip update if the value is the same
      if (Helpers.deepGet(screen, name) === value) {
        return false
      }
      Helpers.deepSet(screen, name, value)
    }
    await this.patch(patchFn, screen._id)

    // Ensure we don't have more than one home screen for this new role.
    // This could happen after updating multiple different settings.
    const state = get(this.store)
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
    if (otherHomeScreens.length && updatedScreen.routing.homeScreen) {
      const patchFn = screen => {
        screen.routing.homeScreen = false
      }
      for (let otherHomeScreen of otherHomeScreens) {
        await this.patch(patchFn, otherHomeScreen._id)
      }
    }
  }

  // Move to layouts store
  async removeCustomLayout(screen) {
    // Pull relevant settings from old layout, if required
    const layout = get(layoutStore).layouts.find(x => x._id === screen.layoutId)
    const patchFn = screen => {
      screen.layoutId = null
      screen.showNavigation = layout?.props.navigation !== "None"
      screen.width = layout?.props.width || "Large"
    }
    await this.patch(patchFn, screen._id)
  }

  /**
   * Parse the entire screen component tree and ensure settings are valid
   * and up-to-date. Ensures stability after a product update.
   * @param {object} screen
   */
  async enrichEmptySettings(screen) {
    // Flatten the recursive component tree
    const components = findAllMatchingComponents(screen.props, x => x)

    // Iterate over all components and run checks
    components.forEach(component => {
      componentStore.enrichEmptySettings(component, {
        screen,
      })
    })
  }
}

export const screenStore = new ScreenStore()

export const selectedScreen = derived(screenStore, $store => {
  return $store.screens.find(screen => screen._id === $store.selectedScreenId)
})

export const sortedScreens = derived(screenStore, $screenStore => {
  return $screenStore.screens.slice().sort((a, b) => {
    // Sort by role first
    const roleA = RoleUtils.getRolePriority(a.routing.roleId)
    const roleB = RoleUtils.getRolePriority(b.routing.roleId)
    if (roleA !== roleB) {
      return roleA > roleB ? -1 : 1
    }
    // Then put home screens first
    const homeA = !!a.routing.homeScreen
    const homeB = !!b.routing.homeScreen
    if (homeA !== homeB) {
      return homeA ? -1 : 1
    }
    // Then sort alphabetically by each URL param
    const aParams = a.routing.route.split("/")
    const bParams = b.routing.route.split("/")
    let minParams = Math.min(aParams.length, bParams.length)
    for (let i = 0; i < minParams; i++) {
      if (aParams[i] === bParams[i]) {
        continue
      }
      return aParams[i] < bParams[i] ? -1 : 1
    }
    // Then sort by the fewest amount of URL params
    return aParams.length < bParams.length ? -1 : 1
  })
})
