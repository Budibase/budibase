import { derived } from "svelte/store"
import { appStore } from "./app"
import { builderStore } from "./builder"

// This is the good old acorn bug where having the word "g l o b a l" makes it
// think that this is not ES6 compatible and starts throwing errors when using
// optional chaining. Piss off acorn.
const defaultTheme = "spectrum--light"
const defaultCustomTheme = {
  primaryColor: "var(--spectrum-glo" + "bal-color-blue-600)",
  primaryColorHover: "var(--spectrum-glo" + "bal-color-blue-500)",
}

const createThemeStore = () => {
  const store = derived(
    [builderStore, appStore],
    ([$builderStore, $appStore]) => {
      const theme =
        $builderStore.theme || $appStore.application?.theme || defaultTheme
      const customTheme = {
        ...defaultCustomTheme,
        ...($builderStore.customTheme || $appStore.application?.customTheme),
      }
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
