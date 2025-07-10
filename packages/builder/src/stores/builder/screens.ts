import { derived, get } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { Helpers } from "@budibase/bbui"
import { RoleUtils, Utils } from "@budibase/frontend-core"
import { findAllMatchingComponents } from "@/helpers/components"
import {
  appStore,
  componentStore,
  layoutStore,
  navigationStore,
  previewStore,
  selectedComponent,
  workspaceAppStore,
} from "@/stores/builder"
import { createHistoryStore, HistoryStore } from "@/stores/builder/history"
import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Component,
  ComponentDefinition,
  DeleteScreenResponse,
  FeatureFlag,
  FetchAppPackageResponse,
  SaveScreenRequest,
  SaveScreenResponse,
  Screen,
  ScreenVariant,
  WithRequired,
} from "@budibase/types"
import { featureFlag } from "@/helpers"

interface ScreenState {
  screens: Screen[]
  selectedScreenId?: string
}

export const initialScreenState: ScreenState = {
  screens: [],
}

// Review the nulls
export class ScreenStore extends BudiStore<ScreenState> {
  history: HistoryStore<Screen>
  delete: (screens: Screen) => Promise<void>
  save: (
    screen: WithRequired<SaveScreenRequest, "workspaceAppId">
  ) => Promise<Screen>

  constructor() {
    super(initialScreenState)

    // Bind scope
    this.select = this.select.bind(this)
    this.reset = this.reset.bind(this)
    this.syncAppScreens = this.syncAppScreens.bind(this)
    this.validate = this.validate.bind(this)
    this.patch = this.patch.bind(this)
    this.replace = this.replace.bind(this)
    this.saveScreen = this.saveScreen.bind(this)
    this.deleteScreen = this.deleteScreen.bind(this)
    this.updateSetting = this.updateSetting.bind(this)
    this.sequentialScreenPatch = this.sequentialScreenPatch.bind(this)
    this.removeCustomLayout = this.removeCustomLayout.bind(this)

    this.history = createHistoryStore({
      getDoc: (id: string) =>
        get(this.store).screens?.find(screen => screen._id === id),
      selectDoc: this.select,
      afterAction: () => {
        // Ensure a valid component is selected
        if (!get(selectedComponent)) {
          componentStore.update(state => ({
            ...state,
            selectedComponentId: get(selectedScreen)?._id,
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
    this.store.set({ ...initialScreenState })
  }

  /**
   * Replace ALL store screens with application package screens
   * @param {FetchAppPackageResponse} pkg
   */
  syncAppScreens(pkg: FetchAppPackageResponse) {
    const screens = [...pkg.screens]
    this.update(state => {
      const { selectedScreenId } = state
      if (selectedScreenId && !screens.some(s => s._id === selectedScreenId)) {
        delete state.selectedScreenId
      }
      return {
        ...state,
        screens,
      }
    })
  }

  /**
   * Uses a screen _id value to find the corresponding screen in the
   * store. If found, the _id is persisted as selectedScreenId
   * @param {string} screenId
   * @returns
   */
  select(screenId: string) {
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

    // If this is a PDF screen, ensure we're on desktop
    if (
      screen.variant === ScreenVariant.PDF &&
      get(previewStore).previewDevice !== "desktop"
    ) {
      previewStore.setDevice("desktop")
    }
  }

  /**
   * Recursively parses the entire screen doc and checks for components
   * violating illegal child configurations.
   *
   * @param {Screen} screen
   * @throws Will throw an error containing the name of the component causing
   * the invalid screen state
   */
  validate(screen: Screen) {
    // Recursive function to find any illegal children in component trees
    const findIllegalChild = (
      component: Component,
      illegalChildren: string[] = [],
      legalDirectChildren: string[] = []
    ): string | undefined => {
      const type: string = component._component

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

      const definition: ComponentDefinition | null =
        componentStore.getDefinition(component._component)

      if (definition == null) {
        throw `Invalid defintion ${component._component}`
      }

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
      throw `You can't place a ${def?.name} here`
    }
  }

  /**
   * Core save method. If creating a new screen, the store will sync the target
   * screen id to ensure that it is selected in the builder
   *
   * @param {Screen} screenRequest The screen being modified/created
   */
  async saveScreen(screenRequest: SaveScreenRequest) {
    const { navigationLinkLabel, ...screen } = screenRequest
    const appState = get(appStore)

    // Validate screen structure if the app supports it
    if (appState.features?.componentValidation) {
      this.validate(screen)
    }

    // Check screen definition for any component settings which need updated
    this.enrichEmptySettings(screen)

    // Save screen
    const creatingNewScreen = screen._id === undefined
    const savedScreen = await API.saveScreen({ ...screen, navigationLinkLabel })

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

    if (
      !featureFlag.isEnabled(FeatureFlag.WORKSPACE_APPS) &&
      navigationLinkLabel
    ) {
      await navigationStore.addLink({
        url: screen.routing.route,
        title: navigationLinkLabel,
        roleId: screen.routing.roleId,
      })
    }

    await appStore.refreshAppNav()

    return savedScreen
  }

  /**
   * This is a fake implementation of a "patch" API endpoint to try and prevent
   * 409s. All screen doc mutations (aside from creation) use this function,
   * which queues up invocations sequentially and ensures pending mutations are
   * always applied to the most up-to-date doc revision.
   * This is slightly better than just a traditional "patch" endpoint and this
   * supports deeply mutating the current doc rather than just appending data.
   */
  sequentialScreenPatch = Utils.sequential(
    async (
      patchFn: (screen: Screen) => boolean,
      screenId: string
    ): Promise<Screen | void> => {
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
      return this.save({
        ...clone,
        workspaceAppId: clone.workspaceAppId!,
      })
    }
  )

  /**
   * @param {Function} patchFn the patch action to be applied
   * @param {string | null} screenId
   */
  async patch(
    patchFn: (screen: Screen) => any,
    screenId?: string | null
  ): Promise<SaveScreenResponse | void> {
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
   *
   * @param {string} screenId the target screen id
   * @param {Screen} screen the replacement screen
   */
  async replace(screenId: string, screen: Screen) {
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
   * @param {Screen } screens
   */
  async deleteScreen(screen: Screen) {
    const screensToDelete = [screen]
    // Build array of promises to speed up bulk deletions
    let promises: Promise<DeleteScreenResponse>[] = []
    let deleteUrls: string[] = []

    // In this instance _id will have been set
    // Underline the expectation that _id and _rev will be set after filtering
    screensToDelete
      .filter(
        (screen): screen is Screen & { _id: string; _rev: string } =>
          !!screen._id || !!screen._rev
      )
      .forEach(screen => {
        // Delete the screen
        promises.push(API.deleteScreen(screen._id, screen._rev))
        // Remove links to this screen
        deleteUrls.push(screen.routing.route)
      })
    await Promise.all(promises)

    await appStore.refreshAppNav()
    await workspaceAppStore.refresh()
    const deletedIds = screensToDelete.map(screen => screen._id)
    const routesResponse = await API.fetchAppRoutes()
    this.update(state => {
      // Remove deleted screens from state
      state.screens = state.screens.filter(screen => {
        return !deletedIds.includes(screen._id)
      })

      // Deselect the current screen if it was deleted
      if (
        state.selectedScreenId &&
        deletedIds.includes(state.selectedScreenId)
      ) {
        delete state.selectedScreenId
        componentStore.update(state => {
          delete state.selectedComponentId
          return state
        })
      }

      // Update routing
      appStore.update(state => ({
        ...state,
        routes: routesResponse.routes,
      }))

      return state
    })
  }

  /**
   * Update a screen by deep setting a property value by name
   *
   * After a successful update, this method ensures that there is only
   * ONE home screen per user Role.
   *
   * @param {Screen} screen
   * @param {string} name e.g "routing.homeScreen" or "showNavigation"
   * @param {any} value
   */
  async updateSetting(screen: Screen, name: string, value: any) {
    if (!screen || !name) {
      return
    }

    // Apply setting update
    const patchFn = (screen: Screen) => {
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
    this.store.update(state => {
      const otherHomeScreens = state.screens.filter(s => {
        return (
          s.workspaceAppId === screen.workspaceAppId &&
          s.routing.roleId === screen.routing.roleId &&
          s.routing.homeScreen &&
          s._id !== screen._id
        )
      })

      for (const screen of otherHomeScreens) {
        screen.routing.homeScreen = false
      }

      return state
    })
  }

  // Move to layouts store
  async removeCustomLayout(screen: Screen) {
    // Pull relevant settings from old layout, if required
    const layout = get(layoutStore).layouts.find(x => x._id === screen.layoutId)
    const patchFn = (screen: Screen) => {
      delete screen.layoutId
      screen.showNavigation = layout?.props.navigation !== "None"
      screen.width = layout?.props.width || "Large"
    }
    await this.patch(patchFn, screen._id)
  }

  /**
   * Parse the entire screen component tree and ensure settings are valid
   * and up-to-date. Ensures stability after a product update.
   * @param {Screen} screen
   */
  async enrichEmptySettings(screen: Screen) {
    // Flatten the recursive component tree
    const components = findAllMatchingComponents(
      screen.props,
      (x: Component) => !!x
    )

    // Iterate over all components and run checks
    components.forEach(component => {
      componentStore.enrichEmptySettings(component, {
        screen,
      })
    })
  }

  /**
   * Provides a list of screens that are used by a given source ID (table, view, datasource, query)
   */
  async usageInScreens(sourceId: string) {
    return API.usageInScreens(sourceId)
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
