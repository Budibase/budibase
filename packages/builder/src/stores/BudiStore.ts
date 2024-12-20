import { writable, Writable, Readable } from "svelte/store"

interface BudiStoreOpts {
  debug?: boolean
}

export class BudiStore<T> {
  store: Writable<T>
  subscribe: Writable<T>["subscribe"]
  update: Writable<T>["update"]
  set: Writable<T>["set"]

  constructor(init: T, opts?: BudiStoreOpts) {
    this.store = writable<T>(init)
    this.subscribe = this.store.subscribe
    this.update = this.store.update
    this.set = this.store.set

    // Optional debug mode to output the store updates to console
    if (opts?.debug) {
      this.subscribe(state => {
        console.warn(`${this.constructor.name}`, state)
      })
    }
  }
}

export class DerivedBudiStore<T, DerivedT extends T> extends BudiStore<T> {
  derivedStore: Readable<DerivedT>
  subscribe: Readable<DerivedT>["subscribe"]

  constructor(
    init: T,
    makeDerivedStore: (store: Writable<T>) => Readable<DerivedT>,
    opts?: BudiStoreOpts
  ) {
    super(init, opts)
    this.derivedStore = makeDerivedStore(this.store)
    this.subscribe = this.derivedStore.subscribe
  }
}
