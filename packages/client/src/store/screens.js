import { derived, get } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import { appStore } from "./app"
import {
  findComponentPathById,
  findChildrenByType,
  findComponentById,
} from "../utils/components"

const createScreenStore = () => {
  const store = derived(
    [appStore, routeStore, builderStore],
    ([$appStore, $routeStore, $builderStore]) => {
      let activeLayout, activeScreen
      let layouts, screens
      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        activeLayout = $builderStore.layout
        activeScreen = $builderStore.screen
        layouts = [activeLayout]
        screens = [activeScreen]
      } else {
        activeLayout = { props: { _component: "screenslot" } }

        // Find the correct screen by matching the current route
        screens = $appStore.screens
        layouts = $appStore.layouts
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
      return { layouts, screens, activeLayout, activeScreen }
    }
  )

  // Utils to parse component definitions
  const actions = {
    findComponentById: componentId => {
      const { activeScreen, activeLayout } = get(store)
      let result = findComponentById(activeScreen?.props, componentId)
      if (result) {
        return result
      }
      return findComponentById(activeLayout?.props)
    },
    findComponentPathById: componentId => {
      const { activeScreen, activeLayout } = get(store)
      let result = findComponentPathById(activeScreen?.props, componentId)
      if (result) {
        return result
      }
      return findComponentPathById(activeLayout?.props)
    },
    findChildrenByType: (componentId, type) => {
      const component = actions.findComponentById(componentId)
      if (!component || !component._children) {
        return null
      }
      let children = []
      findChildrenByType(component, type, children)
      console.log(children)
      return children
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const screenStore = createScreenStore()
