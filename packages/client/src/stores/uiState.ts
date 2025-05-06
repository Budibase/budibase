import { Writable } from "svelte/store"
import { createLocalStorageStore } from "@budibase/frontend-core"

/**
 * Creates a generic app store for persisting component instance settings
 * Keyed by component _id
 */
export class UIStateStore {
  appId: string
  localStorageKey: string
  persistentStore: Writable<Record<string, any>>
  subscribe: Writable<Record<string, any>>["subscribe"]
  set: Writable<Record<string, any>>["set"]
  update: Writable<Record<string, any>>["update"]

  constructor() {
    this.appId = window["##BUDIBASE_APP_ID##"] || "app"
    this.localStorageKey = `${this.appId}.ui`
    this.persistentStore = createLocalStorageStore(this.localStorageKey, {})
    this.subscribe = this.persistentStore.subscribe
    this.set = this.persistentStore.set
    this.update = this.persistentStore.update
  }
}

export const uiStateStore = new UIStateStore()
