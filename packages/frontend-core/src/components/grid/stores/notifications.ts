import { notifications as BBUINotifications } from "@budibase/bbui"
import { derived, Readable } from "svelte/store"
import { Store as StoreContext } from "."

interface NotificationStore {
  notifications: Readable<{
    success: (message: string) => void
    error: (message: string) => void
  }>
}

export type Store = NotificationStore

export const createStores = (context: StoreContext): NotificationStore => {
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
