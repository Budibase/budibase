import { writable, Writable } from "svelte/store"

interface BudiStoreOpts {
  debug?: boolean
}

export default class BudiStore<T> implements Writable<T> {
  store: Writable<T>
  subscribe: Writable<T>["subscribe"]
  update: Writable<T>["update"]
  set: Writable<T>["set"]

  constructor(init: T, opts?: BudiStoreOpts) {
    const store = writable<T>({ ...init })

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
}
