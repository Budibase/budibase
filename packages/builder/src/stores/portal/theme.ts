import { derived, Writable } from "svelte/store"
import {
  DefaultBuilderTheme,
  ensureValidTheme,
  getThemeClassNames,
  ThemeOptions,
  ThemeClassPrefix,
} from "@budibase/shared-core"
import { Theme } from "@budibase/types"
import { DerivedBudiStore, PersistenceType } from "../BudiStore"

interface ThemeState {
  theme: Theme
}

const updateDocumentBackground = (theme: Theme) => {
  const root =
    document.getElementById("spectrum-root") || document.documentElement
  const rootStyles = getComputedStyle(root)
  const bodyStyles = document.body
    ? getComputedStyle(document.body)
    : rootStyles

  const backgroundColor =
    bodyStyles.getPropertyValue("--background-alt")?.trim() ||
    rootStyles.getPropertyValue("--background-alt")?.trim() ||
    bodyStyles
      .getPropertyValue("--spectrum-alias-background-color-secondary")
      ?.trim() ||
    rootStyles
      .getPropertyValue("--spectrum-alias-background-color-secondary")
      ?.trim() ||
    bodyStyles.getPropertyValue("background-color")?.trim() ||
    rootStyles.getPropertyValue("background-color")?.trim()

  if (backgroundColor) {
    document.documentElement.style.backgroundColor = backgroundColor
    document.body.style.backgroundColor = backgroundColor
  }

  const option = ThemeOptions.find(item => item.id === theme)
  const base = option?.base || option?.id || DefaultBuilderTheme
  const colorScheme = base === "light" ? "light" : "dark"
  document.documentElement.style.colorScheme = colorScheme
  document.body.style.colorScheme = colorScheme
}

class ThemeStore extends DerivedBudiStore<ThemeState, ThemeState> {
  constructor() {
    const makeDerivedStore = (store: Writable<ThemeState>) => {
      return derived(store, $store => ({
        ...$store,
        theme: ensureValidTheme($store.theme, DefaultBuilderTheme),
      }))
    }
    super({ theme: DefaultBuilderTheme }, makeDerivedStore, {
      persistence: {
        key: "bb-theme",
        type: PersistenceType.LOCAL,
      },
    })

    // Update theme class when store changes
    this.subscribe(({ theme }) => {
      const classNames = getThemeClassNames(theme).split(" ")
      ThemeOptions.forEach(option => {
        const className = `${ThemeClassPrefix}${option.id}`
        document.documentElement.classList.toggle(
          className,
          classNames.includes(className)
        )
      })

      updateDocumentBackground(theme)
    })
  }
}

export const themeStore = new ThemeStore()
