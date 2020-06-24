import { writable } from 'svelte/store'

export const notificationStore = writable()

export function send(message, type = 'default', timeout) {
  notificationStore.set({ type, message, timeout })
}

export const notifier = {
  danger: msg => send(msg, "danger"),
  warning: msg => send(msg, "warning"),
  info: msg => send(msg, "info"),
  success: msg => send(msg, "success")
}