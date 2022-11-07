import { derived, get } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import { appStore } from "./app"
import { RoleUtils } from "@budibase/frontend-core"
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

        // Legacy - allow the builder to specify a layout
        /*if ($builderStore.layout) {
          activeLayout = $builderStore.layout
        }*/
      } else {
        // Find the correct screen by matching the current route
        screens = $appStore.screens || []
        layouts = $appStore.layouts || []
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

      // Assign ranks to screens, preferring higher roles and home screens
      screens.forEach(screen => {
        const roleId = screen.routing.roleId
        let rank = RoleUtils.getRolePriority(roleId)
        if (screen.routing.homeScreen) {
          rank += 100
        }
        screen.rank = rank
      })

      // Sort screens so the best route is first
      screens = screens.sort((a, b) => {
        // First sort by rank
        if (a.rank !== b.rank) {
          return a.rank > b.rank ? -1 : 1
        }
        // Then sort alphabetically
        return a.routing.route < b.routing.route ? -1 : 1
      })

      //build structure of active custom layout to match with new client screen (after BB v1.0.219)
      if (activeLayout) {
        /* activeLayout.props._children.forEach(child => {
          if (child._id == "7fcf11e4-6f5b-4085-8e0d-9f3d44c98967") { //catch screen slot component
            child._id = "screenslot"
            child._component = "screenslot"
          }
        }) */
        if (activeLayout.props._children?.length) {
          let serialized_children = JSON.stringify(activeLayout.props._children)
          // Replace all instances of ID 7fcf11e4-6f5b-4085-8e0d-9f3d44c98967 in child to screenslot
          serialized_children = serialized_children.replace(new RegExp("7fcf11e4-6f5b-4085-8e0d-9f3d44c98967", "g"), "screenslot")
          serialized_children = serialized_children.replace(new RegExp("@budibase/standard-components/screenslot", "g"), "screenslot")
          // Recurse on all children
          activeLayout.props._children = JSON.parse(serialized_children)
        }
      }

      // If we don't have a legacy custom layout, build a layout structure
      // from the screen navigation settings
      if (!activeLayout) {
        let navigationSettings = {
          navigation: "None",
          pageWidth: activeScreen?.width || "Large",
        }
        if (activeScreen?.showNavigation) {
          navigationSettings = {
            ...navigationSettings,
            ...($builderStore.navigation || $appStore.application?.navigation),
          }

          // Default navigation to top
          if (!navigationSettings.navigation) {
            navigationSettings.navigation = "Top"
          }

          // Default title to app name
          if (!navigationSettings.title && !navigationSettings.hideTitle) {
            navigationSettings.title = $appStore.application?.name
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
            ...navigationSettings,
          },
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
      return children
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const screenStore = createScreenStore()