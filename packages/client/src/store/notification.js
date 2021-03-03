import { writable } from "svelte/store"

const NOTIFICATION_TIMEOUT = 3000

const createNotificationStore = () => {
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

  const send = (message, type = "default") => {
    let _id = id()
    _notifications.update(state => {
      return [...state, { id: _id, type, message }]
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

export const notificationStore = createNotificationStore()
