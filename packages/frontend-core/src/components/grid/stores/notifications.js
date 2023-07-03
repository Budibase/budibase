import { notifications as BBUINotifications } from "@budibase/bbui"
import { derived } from "svelte/store"

export const createStores = context => {
  const { notifySuccess, notifyError } = context

  // Normally we would not derive a store in "createStores" as it should be
  // dependency free, but in this case it's safe as we only depend on grid props
  // which are guaranteed to be first in the dependency chain
  const notifications = derived(
    [notifySuccess, notifyError],
    ([$notifySuccess, $notifyError]) => {
      return {
        success: $notifySuccess || BBUINotifications.success,
        error: $notifyError || BBUINotifications.error,
      }
    }
  )

  return {
    notifications,
  }
}
