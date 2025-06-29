import { match, MatchedRoute } from "@/types/routing"
import { BudiStore } from "./BudiStore"
import { get } from "svelte/store"
import { flattenedRoutes } from "@/stores/routing"

export interface Settings {
  open: boolean
  route?: MatchedRoute
}

export interface BBState {
  settings: Settings
}

export const INITIAL_GLOBAL_STATE: BBState = {
  settings: {
    open: false,
  },
}

export class BBStore extends BudiStore<BBState> {
  constructor() {
    super(INITIAL_GLOBAL_STATE)

    this.hideSettings = this.hideSettings.bind(this)
  }

  reset() {
    this.store.set({ ...INITIAL_GLOBAL_STATE })
  }

  settings(path?: string) {
    // Just open the settings and allow it to defer to its default path
    if (!path) {
      this.update(state => ({
        ...state,
        settings: {
          ...state.settings,
          open: true,
        },
      }))
      return
    }

    const matchedRoute = match(path, get(flattenedRoutes))

    if (matchedRoute) {
      this.update(state => ({
        ...state,
        settings: {
          ...state.settings,
          route: matchedRoute,
          open: true,
        },
      }))
    }
  }

  hideSettings() {
    this.update(state => ({
      ...state,
      settings: {
        ...state.settings,
        open: false,
      },
    }))
  }
}

export const bb = new BBStore()
