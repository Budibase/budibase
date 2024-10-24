import { ThemeMeta, Theme } from "@budibase/types"

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

export const ThemeClassPrefix = "spectrum--"
