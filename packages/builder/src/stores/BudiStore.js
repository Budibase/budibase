import { writable } from "svelte/store"

export default class BudiStore {
  constructor(init, opts) {
    this.initialState = init
    const store = writable({ ...init })

    /**
     * Internal Svelte store
     */
    this.store = store

    /**
     * Exposes the svelte subscribe fn to allow $ notation access
     * @example
     * $navigation.selectedScreenId
     */
    this.subscribe = this.store.subscribe

    /**
     * Exposes the svelte update fn.
     * *Store modification should be kept to a minimum
     */
    this.update = this.store.update
    this.set = this.store.set

    /**
     * Optional debug mode to output the store updates to console
     */
    if (opts?.debug) {
      this.subscribe(state => {
        console.warn(`${this.constructor.name}`, state)
      })
    }
  }

  reset = () => {
    this.store.set({ ...this.initialState })
  }
}
