import { writable } from "svelte/store"
import { generate } from "shortid"

export const notificationStore = writable({
  notifications: [],
})

export function send(message, type = "default") {
  notificationStore.update(state => {
    state.notifications = [...state.notifications, { id: generate(), type, message }]
    return state
  })
}

export const notifier = {
  danger: msg => send(msg, "danger"),
  warning: msg => send(msg, "warning"),
  info: msg => send(msg, "info"),
  success: msg => send(msg, "success"),
}
