import { writable, get } from "svelte/store"
import { generate } from "shortid"
import { routeStore } from "./routes"

const NOTIFICATION_TIMEOUT = 3000

const createNotificationStore = () => {
  let timeout
  let block = false

  const store = writable(null, () => {
    return () => {
      clearTimeout(timeout)
    }
  })

  const blockNotifications = (timeout = 1000) => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  const send = (message, type = "info", icon) => {
    if (block) {
      return
    }

    // If peeking, pass notifications back to parent window
    if (get(routeStore).queryParams?.peek) {
      window.parent.postMessage({
        type: "notification",
        detail: {
          message,
          type,
          icon,
        },
      })
      return
    }

    store.set({
      id: generate(),
      type,
      message,
      icon,
      delay: get(store) != null,
    })
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      store.set(null)
    }, NOTIFICATION_TIMEOUT)
  }

  return {
    subscribe: store.subscribe,
    actions: {
      send,
      info: msg => send(msg, "info", "Info"),
      success: msg => send(msg, "success", "CheckmarkCircle"),
      warning: msg => send(msg, "warning", "Alert"),
      error: msg => send(msg, "error", "Alert"),
      blockNotifications,
    },
  }
}

export const notificationStore = createNotificationStore()
