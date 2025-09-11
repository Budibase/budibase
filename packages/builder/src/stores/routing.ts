import { flatten } from "@/types/routing"
import { derived } from "svelte/store"

// Use direct imports to avoid circular dependency in licensing
import { auth } from "@/stores/portal/auth"
import { admin } from "@/stores/portal/admin"
import { appStore } from "@/stores/builder/app"
import {
  appRoutes,
  filterRoutes,
  globalRoutes,
  orgRoutes,
} from "@/settings/routes"

export const permittedRoutes = derived(
  [admin, auth, appStore],
  ([$admin, $auth, $appStore]) => {
    const user = $auth?.user

    if (!user) {
      return []
    }
    const routes = [
      ...globalRoutes(user),
      ...appRoutes($appStore),
      ...orgRoutes(user, $admin),
    ]
    return filterRoutes(routes)
  }
)

export const flattenedRoutes = derived([permittedRoutes], ([$permitted]) => {
  return flatten($permitted)
})
