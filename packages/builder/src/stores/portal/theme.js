import { createLocalStorageStore } from "@budibase/frontend-core"
import { derived } from "svelte/store"
import {
  DefaultBuilderTheme,
  ensureValidTheme,
  getThemeClassNames,
  ThemeOptions,
  ThemeClassPrefix,
} from "@budibase/shared-core"

export const getThemeStore = () => {
  const themeElement = document.documentElement
  const initialValue = {
    theme: DefaultBuilderTheme,
  }
  const store = createLocalStorageStore("bb-theme", initialValue)
  const derivedStore = derived(store, $store => ({
    ...$store,
    theme: ensureValidTheme($store.theme, DefaultBuilderTheme),
  }))

  // Update theme class when store changes
  derivedStore.subscribe(({ theme }) => {
    const classNames = getThemeClassNames(theme).split(" ")
    ThemeOptions.forEach(option => {
      const className = `${ThemeClassPrefix}${option.id}`
      themeElement.classList.toggle(className, classNames.includes(className))
    })
  })

  return {
    ...store,
    subscribe: derivedStore.subscribe,
  }
}

export const themeStore = getThemeStore()
