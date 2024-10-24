import { Themes, ThemeOptions, ThemeClassPrefix } from "../constants.js"

// Gets the CSS class names for the specified theme
export const getThemeClassNames = theme => {
  theme = ensureValidTheme(theme)
  let classNames = `${ThemeClassPrefix}${theme}`

  // Prefix with base class if required
  const base = ThemeOptions.find(x => x.id === theme)?.base
  if (base) {
    classNames = `${ThemeClassPrefix}${base} ${classNames}`
  }

  return classNames
}

// Ensures a theme value is a valid option
export const ensureValidTheme = (theme, fallback = Themes.Darkest) => {
  // Default to darkest
  if (!theme) {
    return fallback
  }

  // Ensure we aren't using the spectrum prefix
  if (theme.startsWith(ThemeClassPrefix)) {
    theme = theme.split(ThemeClassPrefix)[1]
  }

  // Check we aren't using a deprecated theme, and migrate
  // to the nearest valid theme if we are
  if (!ThemeOptions.some(x => x.id === theme)) {
    if (theme === Themes.Lightest) {
      return Themes.Light
    } else if (theme === Themes.Dark) {
      return Themes.Darkest
    } else {
      return fallback
    }
  }
  return theme
}
