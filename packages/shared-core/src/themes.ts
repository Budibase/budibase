import { ThemeOptions, ThemeClassPrefix } from "./constants/themes"
import { Theme } from "@budibase/types"

// Gets the CSS class names for the specified theme
export const getThemeClassNames = (theme: Theme): string => {
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
export const ensureValidTheme = (
  theme?: Theme,
  fallback: Theme = Theme.DARKEST
): Theme => {
  if (!theme) {
    return fallback
  }

  // Ensure we aren't using the spectrum prefix
  if (theme.startsWith(ThemeClassPrefix)) {
    theme = theme.split(ThemeClassPrefix)[1] as Theme
  }

  // Check we aren't using a deprecated theme, and migrate
  // to the nearest valid theme if we are
  if (!ThemeOptions.some(x => x.id === theme)) {
    if (theme === Theme.LIGHTEST) {
      return Theme.LIGHT
    } else if (theme === Theme.DARK) {
      return Theme.DARKEST
    } else {
      return fallback
    }
  }
  return theme
}
