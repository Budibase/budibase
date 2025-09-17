import { API } from "@/api"
import { DefaultAppTheme, ensureValidTheme } from "@budibase/shared-core"
import {
  AppCustomTheme,
  Theme,
  UpdateWorkspaceResponse,
  Workspace,
} from "@budibase/types"
import { get } from "svelte/store"
import { BudiStore } from "../BudiStore"

interface ThemeState {
  theme: Theme
  customTheme: AppCustomTheme
}

export class ThemeStore extends BudiStore<ThemeState> {
  constructor() {
    super({
      theme: DefaultAppTheme,
      customTheme: {},
    })
  }

  syncAppTheme = (app: Workspace) => {
    this.update(state => {
      const theme = ensureValidTheme(app.theme, DefaultAppTheme)
      return {
        ...state,
        theme,
        customTheme: app.customTheme || {},
      }
    })
  }

  save = async (theme: Theme, appId: string) => {
    const app = await API.saveAppMetadata(appId, { theme })
    this.update(state => ({
      ...state,
      theme: ensureValidTheme(app.theme, DefaultAppTheme),
    }))
  }

  saveCustom = async (theme: Partial<AppCustomTheme>, appId: string) => {
    const updated = { ...get(this).customTheme, ...theme }
    const app = await API.saveAppMetadata(appId, { customTheme: updated })
    this.update(state => ({
      ...state,
      customTheme: app.customTheme || {},
    }))
  }

  syncMetadata = (metadata: UpdateWorkspaceResponse) => {
    const { theme, customTheme } = metadata
    this.update(state => ({
      ...state,
      theme: ensureValidTheme(theme, DefaultAppTheme),
      customTheme: customTheme || {},
    }))
  }
}

export const themeStore = new ThemeStore()
