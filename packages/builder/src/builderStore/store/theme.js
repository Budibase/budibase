import { localStorageStore } from "./localStorage"

export const getThemeStore = () => {
  const themeElement = document.documentElement
  const initialValue = {
    darkMode: true,
  }

  const store = localStorageStore("bb-theme", initialValue)

  // Resets the custom theme to the default dark theme.
  // The reset option is only available when dark theme is on, which is why it
  // sets dark mode to true here
  store.reset = () => {
    store.set({
      ...initialValue,
      darkMode: true,
    })
  }

  // Update theme when store changes
  store.subscribe(theme => {
    themeElement.classList.toggle("spectrum--darkest", theme.darkMode)
    themeElement.classList.toggle("spectrum--lightest", !theme.darkMode)
  })

  return store
}
