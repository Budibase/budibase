import { derived } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import { appStore } from "./app"
import { orgStore } from "./org"
import { dndIndex, dndParent, dndIsNewComponent, dndBounds } from "./dnd.js"
import { RoleUtils } from "@budibase/frontend-core"
import { findComponentById, findComponentParent } from "../utils/components.js"
import { Helpers } from "@budibase/bbui"
import { DNDPlaceholderID } from "constants"

const createScreenStore = () => {
  const store = derived(
    [
      appStore,
      routeStore,
      builderStore,
      orgStore,
      dndParent,
      dndIndex,
      dndIsNewComponent,
      dndBounds,
    ],
    ([
      $appStore,
      $routeStore,
      $builderStore,
      $orgStore,
      $dndParent,
      $dndIndex,
      $dndIsNewComponent,
      $dndBounds,
    ]) => {
      let activeLayout, activeScreen
      let screens
      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        activeScreen = Helpers.cloneDeep($builderStore.screen)
        screens = [activeScreen]

        // Legacy - allow the builder to specify a layout
        if ($builderStore.layout) {
          activeLayout = $builderStore.layout
        }
      } else {
        // Find the correct screen by matching the current route
        screens = $appStore.screens || []
        if ($routeStore.activeRoute) {
          activeScreen = Helpers.cloneDeep(
            screens.find(
              screen => screen._id === $routeStore.activeRoute.screenId
            )
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

      // Insert DND placeholder if required
      if (activeScreen && $dndParent && $dndIndex != null) {
        const { selectedComponentId } = $builderStore

        // Extract and save the selected component as we need a reference to it
        // later, and we may be removing it
        let selectedParent = findComponentParent(
          activeScreen.props,
          selectedComponentId
        )

        // Remove selected component from tree if we are moving an existing
        // component
        if (!$dndIsNewComponent && selectedParent) {
          selectedParent._children = selectedParent._children?.filter(
            x => x._id !== selectedComponentId
          )
        }

        // Insert placeholder component
        const componentToInsert = {
          _component: "@budibase/standard-components/container",
          _id: DNDPlaceholderID,
          _styles: {
            normal: {
              width: `${$dndBounds?.width || 400}px`,
              height: `${$dndBounds?.height || 200}px`,
              opacity: 0,
              "--default-width": $dndBounds?.width || 400,
              "--default-height": $dndBounds?.height || 200,
            },
          },
          static: true,
        }
        let parent = findComponentById(activeScreen.props, $dndParent)
        if (parent) {
          if (!parent._children?.length) {
            parent._children = [componentToInsert]
          } else {
            parent._children.splice($dndIndex, 0, componentToInsert)
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

      // If we don't have a legacy custom layout, build a layout structure
      // from the screen navigation settings
      if (!activeLayout) {
        let layoutSettings = {
          navigation: "None",
          pageWidth: activeScreen?.width || "Large",
          embedded: $appStore.embedded,
        }
        if (activeScreen?.showNavigation) {
          layoutSettings = {
            ...layoutSettings,
            ...($builderStore.navigation || $appStore.application?.navigation),
          }

          // Default navigation to top
          if (!layoutSettings.navigation) {
            layoutSettings.navigation = "Top"
          }

          // Default title to app name
          if (!layoutSettings.title && !layoutSettings.hideTitle) {
            layoutSettings.title = $appStore.application?.name
          }

          // Default to the org logo
          if (!layoutSettings.logoUrl) {
            layoutSettings.logoUrl = $orgStore?.logoUrl
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
            ...layoutSettings,
          },
        }
      }
      return { screens, activeLayout, activeScreen }
    }
  )

  return {
    subscribe: store.subscribe,
  }
}

export const screenStore = createScreenStore()
