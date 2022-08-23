import { writable } from "svelte/store"

const NOTIFICATION_TIMEOUT = 3000

export const createNotificationStore = () => {
  const timeoutIds = new Set()
  const _notifications = writable([], () => {
    return () => {
      // clear all the timers
      timeoutIds.forEach(timeoutId => {
        clearTimeout(timeoutId)
      })
      _notifications.set([])
    }
  })
  let block = false

  const blockNotifications = (timeout = 1000) => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  const send = (
    message,
    {
      type = "default",
      icon = "",
      autoDismiss = true,
      action = null,
      wide = false,
    }
  ) => {
    if (block) {
      return
    }
    let _id = id()
    _notifications.update(state => {
      return [
        ...state,
        {
          id: _id,
          type,
          message,
          icon,
          dismissable: !autoDismiss,
          action,
          wide,
        },
      ]
    })
    if (autoDismiss) {
      const timeoutId = setTimeout(() => {
        dismissNotification(_id)
      }, NOTIFICATION_TIMEOUT)
      timeoutIds.add(timeoutId)
    }
  }

  const dismissNotification = id => {
    _notifications.update(state => {
      return state.filter(n => n.id !== id)
    })
  }

  const { subscribe } = _notifications

  return {
    subscribe,
    send,
    info: msg => send(msg, { type: "info", icon: "Info" }),
    error: msg =>
      send(msg, { type: "error", icon: "Alert", autoDismiss: false }),
    warning: msg => send(msg, { type: "warning", icon: "Alert" }),
    success: msg => send(msg, { type: "success", icon: "CheckmarkCircle" }),
    blockNotifications,
    dismiss: dismissNotification,
  }
}

function id() {
  return "_" + Math.random().toString(36).slice(2, 9)
}

export const notifications = createNotificationStore()
