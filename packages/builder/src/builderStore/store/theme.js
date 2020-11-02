import { localStorageStore } from "./localStorage"

export const getThemeStore = () => {
  const themeElement = document.documentElement
  const initialValue = {
    darkMode: false,
    hue: 208,
    saturation: 9,
    lightness: 16,
  }

  const store = localStorageStore("bb-theme", initialValue)

  // Sets a CSS variable on the root document element
  function setCSSVariable(prop, value) {
    themeElement.style.setProperty(prop, value)
  }

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
    themeElement.classList[theme.darkMode ? "add" : "remove"]("dark")
    setCSSVariable("--theme-hue", Math.round(theme.hue))
    setCSSVariable("--theme-saturation", `${Math.round(theme.saturation)}%`)
    setCSSVariable("--theme-brightness", `${Math.round(theme.lightness)}%`)
  })

  return store
}
