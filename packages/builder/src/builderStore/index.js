import { getFrontendStore } from "./store/frontend"
import { getAutomationStore } from "./store/automation"
import { getThemeStore } from "./store/theme"
import { derived, writable } from "svelte/store"
import { LAYOUT_NAMES } from "../constants"
import { findComponent, findComponentPath } from "./componentUtils"
import { RoleUtils } from "@budibase/frontend-core"

export const store = getFrontendStore()
export const automationStore = getAutomationStore()
export const themeStore = getThemeStore()

export const selectedScreen = derived(store, $store => {
  return $store.screens.find(screen => screen._id === $store.selectedScreenId)
})

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
    // Finally sort alphabetically by route
    return a.routing.route < b.routing.route ? -1 : 1
  })
})

export const selectedComponent = derived(
  [store, selectedScreen],
  ([$store, $selectedScreen]) => {
    if (!$selectedScreen || !$store.selectedComponentId) {
      return null
    }
    return findComponent($selectedScreen?.props, $store.selectedComponentId)
  }
)

export const selectedComponentPath = derived(
  [store, selectedScreen],
  ([$store, $selectedScreen]) => {
    return findComponentPath(
      $selectedScreen?.props,
      $store.selectedComponentId
    ).map(component => component._id)
  }
)

export const mainLayout = derived(store, $store => {
  return $store.layouts?.find(
    layout => layout._id === LAYOUT_NAMES.MASTER.PRIVATE
  )
})

// For compatibility
export const currentAsset = selectedScreen
