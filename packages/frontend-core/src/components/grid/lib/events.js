import { createEventDispatcher } from "svelte"

export const createEventManagers = () => {
  const svelteDispatch = createEventDispatcher()
  let subscribers = {}

  // Dispatches an event, notifying subscribers and also emitting a normal
  // svelte event
  const dispatch = (event, payload) => {
    svelteDispatch(event, payload)
    const subs = subscribers[event] || []
    for (let i = 0; i < subs.length; i++) {
      subs[i](payload)
    }
  }

  // Subscribes to events
  const subscribe = (event, callback) => {
    const subs = subscribers[event] || []
    subscribers[event] = [...subs, callback]

    // Return unsubscribe function
    return () => {
      subscribers[event] = subscribers[event].filter(cb => cb !== callback)
    }
  }

  return { dispatch, subscribe }
}
