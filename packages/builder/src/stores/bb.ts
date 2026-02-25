import type { MatchedRoute } from "@/types/routing"
import { BudiStore } from "./BudiStore"

type SettingsRouteResolver = (path: string) => MatchedRoute | null

let settingsRouteResolver: SettingsRouteResolver | null = null

export const setSettingsRouteResolver = (resolver: SettingsRouteResolver) => {
  settingsRouteResolver = resolver
}

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

  settings(path?: string, params?: Record<string, any>) {
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

    const matchedRoute = settingsRouteResolver?.(path)
    if (matchedRoute) {
      this.update(state => ({
        ...state,
        settings: {
          ...state.settings,
          route: {
            ...matchedRoute,
            params: {
              ...matchedRoute.params,
              ...(params || {}),
            },
          },
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
