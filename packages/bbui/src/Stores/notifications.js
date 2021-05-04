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

  const send = (message, type = "default", icon = "") => {
    if (block) {
      return
    }
    let _id = id()
    _notifications.update(state => {
      return [...state, { id: _id, type, message, icon }]
    })
    const timeoutId = setTimeout(() => {
      _notifications.update(state => {
        return state.filter(({ id }) => id !== _id)
      })
    }, NOTIFICATION_TIMEOUT)
    timeoutIds.add(timeoutId)
  }

  const { subscribe } = _notifications

  return {
    subscribe,
    send,
    info: msg => send(msg, "info", "Info"),
    error: msg => send(msg, "error", "Alert"),
    warning: msg => send(msg, "warning", "Alert"),
    success: msg => send(msg, "success", "CheckmarkCircle"),
    blockNotifications,
  }
}

function id() {
  return "_" + Math.random().toString(36).substr(2, 9)
}

export const notifications = createNotificationStore()
