import { getFrontendStore } from "./store/frontend"
import { getAutomationStore } from "./store/automation"
import { getTemporalStore } from "./store/temporal"
import { getThemeStore } from "./store/theme"
import { getUserStore } from "./store/users"
import { getDeploymentStore } from "./store/deployments"
import { derived, writable } from "svelte/store"
import { findComponent, findComponentPath } from "./componentUtils"
import { RoleUtils } from "@budibase/frontend-core"
import { createHistoryStore } from "builderStore/store/history"
import { get } from "svelte/store"

export const store = getFrontendStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()
export const temporalStore = getTemporalStore()
export const userStore = getUserStore()
export const deploymentStore = getDeploymentStore()

// Setup history for screens
export const screenHistoryStore = createHistoryStore({
  getDoc: id => get(store).screens?.find(screen => screen._id === id),
  selectDoc: store.actions.screens.select,
  afterAction: () => {
    // Ensure a valid component is selected
    if (!get(selectedComponent)) {
      store.update(state => ({
        ...state,
        selectedComponentId: get(selectedScreen)?.props._id,
      }))
    }
  },
})
store.actions.screens.save = screenHistoryStore.wrapSaveDoc(
  store.actions.screens.save
)
store.actions.screens.delete = screenHistoryStore.wrapDeleteDoc(
  store.actions.screens.delete
)

// Setup history for automations
export const automationHistoryStore = createHistoryStore({
  getDoc: automationStore.actions.getDefinition,
  selectDoc: automationStore.actions.select,
})
automationStore.actions.save = automationHistoryStore.wrapSaveDoc(
  automationStore.actions.save
)
automationStore.actions.delete = automationHistoryStore.wrapDeleteDoc(
  automationStore.actions.delete
)

export const selectedScreen = derived(store, $store => {
  return $store.screens.find(screen => screen._id === $store.selectedScreenId)
})

export const selectedLayout = derived(store, $store => {
  return $store.layouts?.find(layout => layout._id === $store.selectedLayoutId)
})

export const selectedComponent = derived(
  [store, selectedScreen],
  ([$store, $selectedScreen]) => {
    if (
      $selectedScreen &&
      $store.selectedComponentId?.startsWith(`${$selectedScreen._id}-`)
    ) {
      return $selectedScreen?.props
    }
    if (!$selectedScreen || !$store.selectedComponentId) {
      return null
    }
    return findComponent($selectedScreen?.props, $store.selectedComponentId)
  }
)

// For legacy compatibility only, but with the new design UI this is just
// the selected screen
export const currentAsset = selectedScreen

export const sortedScreens = derived(store, $store => {
  return $store.screens.slice().sort((a, b) => {
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

export const selectedComponentPath = derived(
  [store, selectedScreen],
  ([$store, $selectedScreen]) => {
    return findComponentPath(
      $selectedScreen?.props,
      $store.selectedComponentId
    ).map(component => component._id)
  }
)

// Derived automation state
export const selectedAutomation = derived(automationStore, $automationStore => {
  if (!$automationStore.selectedAutomationId) {
    return null
  }
  return $automationStore.automations?.find(
    x => x._id === $automationStore.selectedAutomationId
  )
})

// Derive map of resource IDs to other users.
// We only ever care about a single user in each resource, so if multiple users
// share the same datasource we can just overwrite them.
export const userSelectedResourceMap = derived(userStore, $userStore => {
  let map = {}
  $userStore.forEach(user => {
    const resource = user.builderMetadata?.selectedResourceId
    if (resource) {
      if (!map[resource]) {
        map[resource] = []
      }
      map[resource].push(user)
    }
  })
  return map
})

export const isOnlyUser = derived(userStore, $userStore => {
  return $userStore.length < 2
})

export const screensHeight = writable("210px")
