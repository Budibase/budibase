export enum Theme {
  LIGHTEST = "lightest",
  LIGHT = "light",
  DARK = "dark",
  DARKEST = "darkest",
  NORD = "nord",
  MIDNIGHT = "midnight",
}

export type ThemeMeta = {
  id: string
  name: string
  base?: Theme
}
