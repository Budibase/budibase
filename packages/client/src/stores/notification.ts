import { writable, get } from "svelte/store"
import { routeStore } from "./routes"

const DEFAULT_NOTIFICATION_TIMEOUT = 3000

const createNotificationStore = () => {
  let block = false

  const store = writable<{ id: string; message: string; count: number }[]>([])

  const blockNotifications = (timeout = 1000) => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  const send = (
    message: string,
    type = "info",
    icon: string,
    autoDismiss = true,
    duration?: number,
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

  const dismiss = (id: string) => {
    store.update(state => {
      return state.filter(n => n.id !== id)
    })
  }

  return {
    subscribe: store.subscribe,
    actions: {
      send,
      info: (msg: string, autoDismiss?: boolean, duration?: number) =>
        send(msg, "info", "Info", autoDismiss ?? true, duration),
      success: (msg: string, autoDismiss?: boolean, duration?: number) =>
        send(msg, "success", "CheckmarkCircle", autoDismiss ?? true, duration),
      warning: (msg: string, autoDismiss?: boolean, duration?: number) =>
        send(msg, "warning", "Alert", autoDismiss ?? true, duration),
      error: (msg: string, autoDismiss?: boolean, duration?: number) =>
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
