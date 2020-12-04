import { writable, derived } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import * as API from "../api"
import { getAppId } from "../utils/getAppId"

const createScreenStore = () => {
  const config = writable({
    screens: [],
    layouts: [],
  })
  const store = derived(
    [config, routeStore, builderStore],
    ([$config, $routeStore, $builderStore]) => {
      let activeLayout
      let activeScreen
      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        activeLayout = $builderStore.layout
        activeScreen = $builderStore.screen
      } else {
        // Otherwise find the correct screen by matching the current route
        const { screens, layouts } = $config
        activeLayout = layouts[0]
        if (screens.length === 1) {
          activeScreen = screens[0]
        } else {
          activeScreen = screens.find(
            screen => screen.routing.route === $routeStore.activeRoute
          )
        }
        if (activeScreen) {
          activeLayout = layouts.find(
            layout => layout._id === activeScreen.layoutId
          )
        }
      }
      return { activeLayout, activeScreen }
    }
  )

  const fetchScreens = async () => {
    const appDefinition = await API.fetchAppDefinition(getAppId())
    config.set({
      screens: appDefinition.screens,
      layouts: appDefinition.layouts,
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchScreens },
  }
}

export const screenStore = createScreenStore()
