import { writable, get } from "svelte/store"

const initialState = {
  proto: "http",
  domain: null,
  port: 80,
  onError: null,
}

export const createConfigStore = () => {
  const store = writable(initialState)

  /**
   * Sets the SDK configuration.
   */
  const initialise = config => {
    store.update(state => {
      return {
        ...state,
        ...config,
      }
    })
  }

  /**
   * Rests the SDK configuration
   */
  const reset = () => {
    store.set(initialState)
  }

  /**
   * Store handler for errors which triggers the user defined error handler.
   */
  const handleError = error => {
    const handler = get(store).onError
    handler && handler(error)
  }

  store.actions = {
    initialise,
    reset,
    handleError,
  }

  return store
}
