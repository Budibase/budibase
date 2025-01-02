import { createEventDispatcher } from "svelte"

export const createEventManagers = () => {
  const svelteDispatch = createEventDispatcher()
  let subscribers: Record<string, ((...params: any) => void)[]> = {}

  // Dispatches an event, notifying subscribers and also emitting a normal
  // svelte event
  const dispatch = (event: string, payload: any) => {
    svelteDispatch(event, payload)
    const subs = subscribers[event] || []
    for (let i = 0; i < subs.length; i++) {
      subs[i](payload)
    }
  }

  // Subscribes to events
  const subscribe = (event: string, callback: () => void) => {
    const subs = subscribers[event] || []
    subscribers[event] = [...subs, callback]

    // Return unsubscribe function
    return () => {
      subscribers[event] = subscribers[event].filter(cb => cb !== callback)
    }
  }

  return { dispatch, subscribe }
}
