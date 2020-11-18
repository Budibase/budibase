import { writable, derived } from "svelte/store"
import { routeStore } from "./routes"

const createScreenStore = () => {
  const screens = writable([])
  const store = derived([screens, routeStore], ([$screens, $routeStore]) => {
    const activeScreen = $screens.find(
      screen => screen.route === $routeStore.activeRoute
    )
    return {
      screens: $screens,
      activeScreen,
    }
  })

  const fetchScreens = () => {
    const frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
    screens.set(frontendDefinition.screens)
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchScreens },
  }
}

export const screenStore = createScreenStore()
