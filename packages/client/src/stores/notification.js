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

  const send = (
    message,
    type = "info",
    icon,
    autoDismiss = true,
    count = 1
  ) => {
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
      const duplicateError = state.find(err => err.message === message)
      if (duplicateError) {
        duplicateError.count += 1
        return [...state]
      }
      return [
        ...state,
        {
          id: _id,
          type,
          message,
          icon,
          dismissable: !autoDismiss,
          delay: get(store) != null,
          count,
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
      info: (msg, autoDismiss) =>
        send(msg, "info", "Info", autoDismiss ?? true),
      success: (msg, autoDismiss) =>
        send(msg, "success", "CheckmarkCircle", autoDismiss ?? true),
      warning: (msg, autoDismiss) =>
        send(msg, "warning", "Alert", autoDismiss ?? true),
      error: (msg, autoDismiss) =>
        send(msg, "error", "Alert", autoDismiss ?? false),
      blockNotifications,
      dismiss,
    },
  }

  function id() {
    return "_" + Math.random().toString(36).slice(2, 9)
  }
}

export const notificationStore = createNotificationStore()
