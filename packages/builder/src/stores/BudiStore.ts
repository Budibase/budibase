import { writable, Writable, Readable } from "svelte/store"
import {
  createLocalStorageStore,
  createSessionStorageStore,
} from "@budibase/frontend-core"

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
    if (opts?.persistence) {
      switch (opts.persistence.type) {
        case PersistenceType.LOCAL:
          this.store = createLocalStorageStore(opts.persistence.key, init)
          break
        case PersistenceType.SESSION:
          this.store = createSessionStorageStore(opts.persistence.key, init)
          break
        default:
          this.store = writable<T>(init)
      }
    } else {
      this.store = writable<T>(init)
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
