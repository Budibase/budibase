import {
  Constants,
  createLocalStorageStore,
  ensureValidTheme,
  getThemeClassNames,
} from "@budibase/frontend-core"
import { derived } from "svelte/store"

export const getThemeStore = () => {
  const defaultBuilderTheme = Constants.Themes.Darkest
  const themeElement = document.documentElement
  const initialValue = {
    theme: defaultBuilderTheme,
  }
  const store = createLocalStorageStore("bb-theme", initialValue)
  const derivedStore = derived(store, $store => ({
    ...$store,
    theme: ensureValidTheme($store.theme, defaultBuilderTheme),
  }))

  // Update theme class when store changes
  derivedStore.subscribe(({ theme }) => {
    const classNames = getThemeClassNames(theme).split(" ")
    Constants.ThemeOptions.forEach(option => {
      const className = `${Constants.ThemeClassPrefix}${option.id}`
      themeElement.classList.toggle(className, classNames.includes(className))
    })
  })

  return {
    ...store,
    subscribe: derivedStore.subscribe,
  }
}

export const themeStore = getThemeStore()
