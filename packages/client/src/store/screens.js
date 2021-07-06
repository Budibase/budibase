import { derived } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import { appStore } from "./app"

const createScreenStore = () => {
  const store = derived(
    [appStore, routeStore, builderStore],
    ([$appStore, $routeStore, $builderStore]) => {
      let activeLayout
      let activeScreen
      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        activeLayout = $builderStore.layout
        activeScreen = $builderStore.screen
      } else {
        activeLayout = { props: { _component: "screenslot" } }

        // Find the correct screen by matching the current route
        const { screens, layouts } = $appStore
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

  return {
    subscribe: store.subscribe,
  }
}

export const screenStore = createScreenStore()
