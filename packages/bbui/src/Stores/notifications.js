import { writable, derived } from "svelte/store"

const NOTIFICATION_TIMEOUT = 3000

const createNotificationStore = () => {
  const _notifications = writable([])

  const send = (message, type = "default") => {
    _notifications.update(state => {
      return [...state, { id: id(), type, message }]
    })
  }

  let timers = []

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
  }
}

function id() {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

export const notifications = createNotificationStore()
