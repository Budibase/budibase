/* eslint-disable no-useless-concat */
import { derived } from "svelte/store"
import { appStore } from "./app"
import { builderStore } from "./builder"
import {
  DefaultAppTheme,
  DefaultExistingAppFontFamily,
  ensureValidAppFontFamily,
  ensureValidTheme,
  getAppFontFamilyStack,
} from "@budibase/shared-core"

// This is the good old acorn bug where having the word "g l o b a l" makes it
// think that this is not ES6 compatible and starts throwing errors when using
// optional chaining. Piss off acorn.
const defaultCustomTheme = {
  primaryColor: "var(--spectrum-glo" + "bal-color-blue-600)",
  primaryColorHover: "var(--spectrum-glo" + "bal-color-blue-500)",
  buttonBorderRadius: "16px",
  fontFamily: DefaultExistingAppFontFamily,
  navBackground: "var(--spectrum-glo" + "bal-color-gray-100)",
  navTextColor: "var(--spectrum-glo" + "bal-color-gray-800)",
}

const createThemeStore = () => {
  const store = derived(
    [builderStore, appStore],
    ([$builderStore, $appStore]) => {
      let theme = $appStore.application?.theme
      let customTheme = $appStore.application?.customTheme
      if ($builderStore.inBuilder) {
        theme = $builderStore.theme
        customTheme = $builderStore.customTheme
      }

      // Ensure theme is set
      theme = ensureValidTheme(theme, DefaultAppTheme)

      // Delete and nullish keys from the custom theme
      if (customTheme) {
        Object.entries(customTheme).forEach(([key, value]) => {
          if (value == null || value === "") {
            delete customTheme[key]
          }
        })
      }

      // Merge custom theme with defaults
      customTheme = {
        ...defaultCustomTheme,
        ...customTheme,
      }
      customTheme.fontFamily = ensureValidAppFontFamily(customTheme.fontFamily)

      // Build CSS string setting all custom variables
      const fontFamilyStack = getAppFontFamilyStack(customTheme.fontFamily)
      const fontProperties = [
        "font-family",
        "--font-sans",
        "--font-accent",
        "--spectrum-alias-body-text-font-family",
        "--spectrum-global-font-family-base",
      ]
      let customThemeCss = fontProperties
        .map(property => `${property}:${fontFamilyStack} !important;`)
        .join("")
      Object.entries(customTheme).forEach(([key, value]) => {
        if (key === "fontFamily") {
          return
        }
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
