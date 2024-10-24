import { writable, get } from "svelte/store"
import { API } from "api"
import { ensureValidTheme, DefaultAppTheme } from "@budibase/shared-core"

export const createThemeStore = () => {
  const store = writable({
    theme: DefaultAppTheme,
    customTheme: {},
  })

  const syncAppTheme = app => {
    store.update(state => {
      const theme = ensureValidTheme(app.theme, DefaultAppTheme)
      return {
        ...state,
        theme,
        customTheme: app.customTheme,
      }
    })
  }

  const save = async (theme, appId) => {
    const app = await API.saveAppMetadata({
      appId,
      metadata: { theme },
    })
    store.update(state => {
      state.theme = app.theme
      return state
    })
  }

  const saveCustom = async (theme, appId) => {
    const updated = { ...get(store).customTheme, ...theme }
    const app = await API.saveAppMetadata({
      appId,
      metadata: { customTheme: updated },
    })
    store.update(state => {
      state.customTheme = app.customTheme
      return state
    })
  }

  const syncMetadata = metadata => {
    const { theme, customTheme } = metadata
    store.update(state => ({
      ...state,
      theme: ensureValidTheme(theme, DefaultAppTheme),
      customTheme,
    }))
  }

  return {
    subscribe: store.subscribe,
    update: store.update,
    syncMetadata,
    syncAppTheme,
    save,
    saveCustom,
  }
}

export const themeStore = createThemeStore()
