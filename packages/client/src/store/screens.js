import { writable, derived, get } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import * as API from "../api"

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
        activeLayout = { props: { _component: "screenslot" } }

        // Find the correct screen by matching the current route
        const { screens, layouts } = $config
        if ($routeStore.activeRoute) {
          activeScreen = screens.find(
            screen => screen._id === $routeStore.activeRoute.screenId
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
    const appDefinition = await API.fetchAppDefinition(get(builderStore).appId)
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
