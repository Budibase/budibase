import { localStorageStore } from "./localStorage"

export const getThemeStore = () => {
  const themeElement = document.documentElement
  const initialValue = {
    darkMode: true,
  }
  const store = localStorageStore("bb-theme", initialValue)

  // Update theme when store changes
  store.subscribe(theme => {
    themeElement.classList.toggle("spectrum--darkest", theme.darkMode)
    themeElement.classList.toggle("spectrum--lightest", !theme.darkMode)
  })

  return store
}
