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
    })
  }
}

export const themeStore = new ThemeStore()
