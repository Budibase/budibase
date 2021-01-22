import { writable, derived } from "svelte/store"

let NOTIFICATION_TIMEOUT = 3000

export const createNotificationStore = () => {
  const _notifications = writable([])
  
	const send = (message, type = "default") => {
    _notifications.update(state => {
      state = [
        ...state,
        { id: 1, type, message },
      ]
    })
  }
  
  const notifications = derived(_notifications, ($_notifications, set) => {
		 const timeout = setTimeout({
			set($_notifications)
			}, NOTIFICATION_TIMEOUT)

			return () => {
				clearTimeout(timeout);
			};
	})
  const {subscribe} = notifications

  return {
    subscribe,
		send,
    danger: msg => send(msg, "danger"),
  	warning: msg => send(msg, "warning"),
  	info: msg => send(msg, "info"),
  	success: msg => send(msg, "success"),
  }
}