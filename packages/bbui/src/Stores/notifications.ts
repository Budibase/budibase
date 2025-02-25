import { writable } from "svelte/store"

const NOTIFICATION_TIMEOUT = 3000

interface Notification {
  id: string
  type: string
  message: string
  icon: string
  dismissable: boolean
  action: (() => void) | null
  actionMessage: string | null
  wide: boolean
  dismissTimeout: number
}

export const createNotificationStore = () => {
  const timeoutIds = new Set<NodeJS.Timeout>()
  const _notifications = writable<Notification[]>([], () => {
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
    message: string,
    {
      type = "default",
      icon = "",
      autoDismiss = true,
      action = null,
      actionMessage = null,
      wide = false,
      dismissTimeout = NOTIFICATION_TIMEOUT,
    }: {
      type?: string
      icon?: string
      autoDismiss?: boolean
      action?: (() => void) | null
      actionMessage?: string | null
      wide?: boolean
      dismissTimeout?: number
    } = {}
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
          actionMessage,
          wide,
          dismissTimeout,
        },
      ]
    })
    if (autoDismiss) {
      const timeoutId = setTimeout(() => {
        dismissNotification(_id)
      }, dismissTimeout)
      timeoutIds.add(timeoutId)
    }
  }

  const dismissNotification = (id: string) => {
    _notifications.update(state => {
      return state.filter(n => n.id !== id)
    })
  }

  const { subscribe } = _notifications

  return {
    subscribe,
    send,
    info: (msg: string) => send(msg, { type: "info", icon: "Info" }),
    error: (msg: string) =>
      send(msg, { type: "error", icon: "Alert", autoDismiss: false }),
    warning: (msg: string) => send(msg, { type: "warning", icon: "Alert" }),
    success: (msg: string) =>
      send(msg, { type: "success", icon: "CheckmarkCircle" }),
    blockNotifications,
    dismiss: dismissNotification,
  }
}

function id(): string {
  return "_" + Math.random().toString(36).slice(2, 9)
}

export const notifications = createNotificationStore()
