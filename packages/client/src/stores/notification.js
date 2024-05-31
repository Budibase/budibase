import { writable, get } from "svelte/store"
import { routeStore } from "./routes"

const DEFAULT_NOTIFICATION_TIMEOUT = 3000

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
    duration,
    count = 1
  ) => {
    if (block) {
      return
    }

    if (get(routeStore).queryParams?.peek) {
      window.parent.postMessage({
        type: "notification",
        detail: {
          message,
          type,
          icon,
          duration,
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
      }, duration || DEFAULT_NOTIFICATION_TIMEOUT)
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
      info: (msg, autoDismiss, duration) =>
        send(msg, "info", "Info", autoDismiss ?? true, duration),
      success: (msg, autoDismiss, duration) =>
        send(msg, "success", "CheckmarkCircle", autoDismiss ?? true, duration),
      warning: (msg, autoDismiss, duration) =>
        send(msg, "warning", "Alert", autoDismiss ?? true, duration),
      error: (msg, autoDismiss, duration) =>
        send(msg, "error", "Alert", autoDismiss ?? false, duration),
      blockNotifications,
      dismiss,
    },
  }

  function id() {
    return "_" + Math.random().toString(36).slice(2, 9)
  }
}

export const notificationStore = createNotificationStore()
