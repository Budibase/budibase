import { Constants, createLocalStorageStore } from "@budibase/frontend-core"

export const getThemeStore = () => {
  const themeElement = document.documentElement

  const initialValue = {
    theme: "darkest",
  }
  const store = createLocalStorageStore("bb-theme", initialValue)

  // Update theme class when store changes
  store.subscribe(state => {
    // Handle any old local storage values - this can be removed after the update
    if (state.darkMode !== undefined) {
      store.set(initialValue)
      return
    }

    // Update global class names to use the new theme and remove others
    Constants.Themes.forEach(option => {
      themeElement.classList.toggle(
        `spectrum--${option.class}`,
        option.class === state.theme
      )
    })

    // Add base theme if required
    const selectedTheme = Constants.Themes.find(x => x.class === state.theme)
    if (selectedTheme?.base) {
      themeElement.classList.add(`spectrum--${selectedTheme.base}`)
    }
  })

  return store
}
