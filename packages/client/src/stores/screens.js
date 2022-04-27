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
      let screens

      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        activeScreen = $builderStore.screen
        screens = [activeScreen]

        // Legacy - allow the builder to specify a layout
        if ($builderStore.layout) {
          activeLayout = $builderStore.layout
        }
      } else {
        // Find the correct screen by matching the current route
        screens = $appStore.screens
        if ($routeStore.activeRoute) {
          activeScreen = screens.find(
            screen => screen._id === $routeStore.activeRoute.screenId
          )
        }

        // Legacy - find the custom layout for the selected screen
        if (activeScreen) {
          const screenLayout = $appStore.layouts?.find(
            layout => layout._id === activeScreen.layoutId
          )
          if (screenLayout) {
            activeLayout = screenLayout
          }
        }
      }

      // If we don't have a legacy custom layout, build a layout structure
      // from the screen navigation settings
      if (!activeLayout) {
        let navigationProps = {
          navigation: "None",
        }
        if (activeScreen.showNavigation) {
          navigationProps = activeScreen.navigation

          // Legacy - if this is a legacy screen without any navigation
          // settings fall back to just showing the app title
          if (!navigationProps) {
            navigationProps = {
              title: activeScreen.navigation ?? $appStore.application?.name,
            }
          }
        }
        activeLayout = {
          _id: "layout",
          props: {
            _component: "@budibase/standard-components/layout",
            _children: [
              {
                _component: "screenslot",
                _id: "screenslot",
                _styles: {
                  normal: {
                    flex: "1 1 auto",
                    display: "flex",
                    "flex-direction": "column",
                    "justify-content": "flex-start",
                    "align-items": "stretch",
                  },
                },
              },
            ],
            ...navigationProps,
          },
        }
      }

      return { screens, activeLayout, activeScreen }
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
      return children
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const screenStore = createScreenStore()
