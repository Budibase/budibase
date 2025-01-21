import { ThemeMeta, Theme } from "@budibase/types"

export const ThemeClassPrefix = "spectrum--"
export const DefaultBuilderTheme = Theme.DARKEST
export const DefaultAppTheme = Theme.LIGHT

// Currently available theme options for builder and apps
export const ThemeOptions: ThemeMeta[] = [
  {
    id: Theme.LIGHT,
    name: "Light",
  },
  {
    // We call this dark for simplicity, but we want to use the spectrum darkest style
    id: Theme.DARKEST,
    name: "Dark",
  },
  {
    id: Theme.NORD,
    name: "Nord",
    base: Theme.DARKEST,
  },
  {
    id: Theme.MIDNIGHT,
    name: "Midnight",
    base: Theme.DARKEST,
  },
]
