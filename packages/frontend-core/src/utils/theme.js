import { Themes } from "../constants.js"

export const getBaseTheme = theme => {
  if (!theme) {
    return ""
  }
  let base = Themes.find(x => `spectrum--${x.class}` === theme)?.base || ""
  if (base) {
    base = `spectrum--${base}`
  }
  return base
}
