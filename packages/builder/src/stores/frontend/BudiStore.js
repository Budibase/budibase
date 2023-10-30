import { writable } from "svelte/store"

export default class BudiStore {
  constructor(init) {
    const store = writable({
      ...init,
    })

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
  }
}
