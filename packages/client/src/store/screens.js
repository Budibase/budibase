import { writable, derived } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import * as API from "../api"
import { getAppId } from "../utils/getAppId"

const createScreenStore = () => {
  const config = writable({
    screens: [],
    page: {},
  })
  const store = derived(
    [config, routeStore, builderStore],
    ([$config, $routeStore, $builderStore]) => {
      let page
      let activeScreen
      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        page = $builderStore.page
        activeScreen = $builderStore.screen
      } else {
        // Otherwise find the correct screen by matching the current route
        page = $config.page
        const { screens } = $config
        if (screens.length === 1) {
          activeScreen = screens[0]
        } else {
          activeScreen = screens.find(
            screen => screen.routing.route === $routeStore.activeRoute
          )
        }
      }
      return { page, activeScreen }
    }
  )

  const fetchScreens = async () => {
    const appDefinition = await API.fetchAppDefinition(getAppId())
    config.set({
      screens: appDefinition.screens,
      page: appDefinition.page,
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchScreens },
  }
}

export const screenStore = createScreenStore()
