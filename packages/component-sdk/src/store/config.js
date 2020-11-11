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
   *
   * @param config
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
    store.update(() => initialState)
  }

  /**
   * Store handler for errors which triggers the user defined error handler.
   *
   * @param error
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
