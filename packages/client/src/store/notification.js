import { writable, derived } from "svelte/store"
import { generate } from "shortid"

const NOTIFICATION_TIMEOUT = 3000

const createNotificationStore = () => {
  const _notifications = writable([])
  let block = false

  const send = (message, type = "default") => {
    if (block) {
      return
    }
    _notifications.update(state => {
      return [...state, { id: generate(), type, message }]
    })
  }

  const blockNotifications = (timeout = 1000) => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  const notifications = derived(_notifications, ($_notifications, set) => {
    set($_notifications)
    if ($_notifications.length > 0) {
      const timeout = setTimeout(() => {
        _notifications.update(state => {
          state.shift()
          return state
        })
        set($_notifications)
      }, NOTIFICATION_TIMEOUT)
      return () => {
        clearTimeout(timeout)
      }
    }
  })
  const { subscribe } = notifications

  return {
    subscribe,
    send,
    danger: msg => send(msg, "danger"),
    warning: msg => send(msg, "warning"),
    info: msg => send(msg, "info"),
    success: msg => send(msg, "success"),
    blockNotifications,
  }
}

export const notificationStore = createNotificationStore()
