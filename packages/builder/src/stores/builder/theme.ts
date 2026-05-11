import { DefaultAppTheme, ensureValidTheme } from "@budibase/shared-core"
import {
  AppCustomTheme,
  Theme,
  UpdateWorkspaceResponse,
  Workspace,
} from "@budibase/types"
import { derived, get, Writable } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"
import { workspaceAppStore } from "./workspaceApps"

interface ThemeState {
  theme: Theme
  customTheme: AppCustomTheme
}

export class ThemeStore extends DerivedBudiStore<ThemeState, ThemeState> {
  constructor() {
    const makeDerivedStore = (store: Writable<ThemeState>) => {
      return derived(
        [store, workspaceAppStore],
        ([$store, $workspaceAppStore]) => {
          const workspaceApp = $workspaceAppStore.selectedWorkspaceApp
          return {
            theme: ensureValidTheme(workspaceApp?.theme, $store.theme),
            customTheme: {
              ...$store.customTheme,
              ...(workspaceApp?.customTheme || {}),
            },
          }
        }
      )
    }

    super(
      {
        theme: DefaultAppTheme,
        customTheme: {},
      },
      makeDerivedStore
    )
  }

  syncAppTheme = (workspace: Workspace) => {
    this.update(state => {
      const theme = ensureValidTheme(workspace.theme, DefaultAppTheme)
      return {
        ...state,
        theme,
        customTheme: workspace.customTheme || {},
      }
    })
  }

  save = async (theme: Theme) => {
    const { selectedWorkspaceApp } = get(workspaceAppStore)
    if (!selectedWorkspaceApp) {
      return
    }

    await workspaceAppStore.edit({
      ...selectedWorkspaceApp,
      theme,
    })
  }

  saveCustom = async (theme: Partial<AppCustomTheme>) => {
    const { selectedWorkspaceApp } = get(workspaceAppStore)
    if (!selectedWorkspaceApp) {
      return
    }

    const updated = { ...selectedWorkspaceApp.customTheme, ...theme }
    await workspaceAppStore.edit({
      ...selectedWorkspaceApp,
      customTheme: updated,
    })
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
