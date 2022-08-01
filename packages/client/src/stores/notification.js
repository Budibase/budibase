import { writable, get } from "svelte/store"
import { routeStore } from "./routes"

const NOTIFICATION_TIMEOUT = 3000

const createNotificationStore = () => {
  let block = false

  const store = writable([])

  const blockNotifications = (timeout = 1000) => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  const send = (message, type = "info", icon, autoDismiss = true) => {
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
          autoDismiss,
        },
      })
      return
    }
    const _id = id()
    store.update(state => {
      return [
        ...state,
        {
          id: _id,
          type,
          message,
          icon,
          dismissable: !autoDismiss,
          delay: get(store) != null,
        },
      ]
    })
    if (autoDismiss) {
      setTimeout(() => {
        dismiss(_id)
      }, NOTIFICATION_TIMEOUT)
    }
  }

  const dismiss = id => {
    store.update(state => {
      return state.filter(n => n.id !== id)
    })
  }

  return {
    subscribe: store.subscribe,
    actions: {
      send,
      info: msg => send(msg, "info", "Info"),
      success: msg => send(msg, "success", "CheckmarkCircle"),
      warning: msg => send(msg, "warning", "Alert"),
      error: msg => send(msg, "error", "Alert", false),
      blockNotifications,
      dismiss,
    },
  }

  function id() {
    return "_" + Math.random().toString(36).slice(2, 9)
  }
}

export const notificationStore = createNotificationStore()
