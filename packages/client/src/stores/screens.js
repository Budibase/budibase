import { derived } from "svelte/store"
import { routeStore } from "./routes"
import { builderStore } from "./builder"
import { appStore } from "./app"
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
      dndParent,
      dndIndex,
      dndIsNewComponent,
      dndBounds,
    ],
    ([
      $appStore,
      $routeStore,
      $builderStore,
      $dndParent,
      $dndIndex,
      $dndIsNewComponent,
      $dndBounds,
    ]) => {
      let activeScreen
      let screens
      if ($builderStore.inBuilder) {
        // Use builder defined definitions if inside the builder preview
        activeScreen = Helpers.cloneDeep($builderStore.screen)
        screens = [activeScreen]
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

      return { screens, activeScreen }
    }
  )

  return {
    subscribe: store.subscribe,
  }
}

export const screenStore = createScreenStore()
