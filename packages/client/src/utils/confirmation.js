import { get } from "svelte/store"
import { screenStore, confirmationStore, routeStore } from "stores"

export const showNavigationConfirmation = (
  url,
  peek,
  externalNewTab,
  type,
  callback = null
) => {
  const existingRoute = get(screenStore)

  if (existingRoute.activeScreen.restrictNavigation) {
    confirmationStore.actions.showConfirmation(
      existingRoute.activeScreen.promptTitle &&
        existingRoute.activeScreen.promptTitle.trim() !== ""
        ? existingRoute.activeScreen.promptTitle
        : "Confirm Navigation",
      existingRoute.activeScreen.promptDescription &&
        existingRoute.activeScreen.promptDescription.trim() !== ""
        ? existingRoute.activeScreen.promptDescription
        : "Are you sure you want to navigate away from this page?",
      () => {
        if (type === "screen" && url && !url.startsWith("/")) {
          url = `/${url}`
        }

        routeStore.actions.navigate(url, peek, externalNewTab)
        if (callback) callback()
      }
    )
    return true
  }
  return false
}
