import { writable, Writable, Readable } from "svelte/store"
import {
  createLocalStorageStore,
  createSessionStorageStore,
} from "@budibase/frontend-core"
import { Helpers } from "@budibase/bbui"

export enum PersistenceType {
  NONE = "none",
  LOCAL = "local",
  SESSION = "session",
}

interface BudiStoreOpts {
  debug?: boolean
  persistence?: {
    type: PersistenceType
    key: string
  }
}

export class BudiStore<T> {
  store: Writable<T>
  subscribe: Writable<T>["subscribe"]
  update: Writable<T>["update"]
  set: Writable<T>["set"]

  constructor(init: T, opts?: BudiStoreOpts) {
    // Must be cloned to avoid mutation of initial state
    const cloneInit = Helpers.cloneDeep(init)
    if (opts?.persistence) {
      switch (opts.persistence.type) {
        case PersistenceType.LOCAL:
          this.store = createLocalStorageStore(opts.persistence.key, cloneInit)
          break
        case PersistenceType.SESSION:
          this.store = createSessionStorageStore(
            opts.persistence.key,
            cloneInit
          )
          break
        default:
          this.store = writable<T>(cloneInit)
      }
    } else {
      this.store = writable<T>(cloneInit)
    }

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

// This deliberately does not extend a BudiStore as doing so imposes a requirement that
// DerivedT must extend T, which is not desirable, due to the type of the subscribe property.
export class DerivedBudiStore<T, DerivedT> {
  store: BudiStore<T>
  derivedStore: Readable<DerivedT>
  subscribe: Readable<DerivedT>["subscribe"]
  update: Writable<T>["update"]
  set: Writable<T>["set"]

  constructor(
    init: T,
    makeDerivedStore: (store: Writable<T>) => Readable<DerivedT>,
    opts?: BudiStoreOpts
  ) {
    // Must be cloned to avoid mutation of initial state
    const cloneInit = Helpers.cloneDeep(init)
    this.store = new BudiStore(cloneInit, opts)
    this.derivedStore = makeDerivedStore(this.store)
    this.subscribe = this.derivedStore.subscribe
    this.update = this.store.update
    this.set = this.store.set
  }
}
