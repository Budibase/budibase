import { derived } from "svelte/store"
import { appStore } from "./app"
import { builderStore } from "./builder"

const createThemeStore = () => {
  const store = derived(
    [builderStore, appStore],
    ([$builderStore, $appStore]) => {
      const theme =
        $builderStore.theme || $appStore.application?.theme || "spectrum--light"
      const customTheme =
        $builderStore.customTheme || $appStore.application?.customTheme || {}
      let customThemeCss = ""
      Object.entries(customTheme).forEach(([key, value]) => {
        customThemeCss += `--${key}:${value};`
      })
      return {
        theme,
        customTheme,
        customThemeCss,
      }
    }
  )

  return {
    subscribe: store.subscribe,
  }
}

export const themeStore = createThemeStore()
