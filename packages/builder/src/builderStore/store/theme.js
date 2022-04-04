import { createLocalStorageStore } from "@budibase/frontend-core"

export const getThemeStore = () => {
  const themeElement = document.documentElement

  const initialValue = {
    theme: "darkest",
    options: ["lightest", "light", "dark", "darkest", "nord"],
  }
  const store = createLocalStorageStore("bb-theme", initialValue)

  // Update theme class when store changes
  store.subscribe(state => {
    // Handle any old local storage values - this can be removed after the update
    if (state.darkMode !== undefined) {
      store.set(initialValue)
      return
    }

    state.options.forEach(option => {
      themeElement.classList.toggle(
        `spectrum--${option}`,
        option === state.theme
      )

      // Ensure darkest is always added as this is the base class for custom
      // themes
      themeElement.classList.add("spectrum--darkest")
    })
  })

  return store
}
