import { ensureValidTheme } from "@budibase/shared-core"
import { Theme } from "@budibase/types"

export const getThemeVariables = (theme: Theme) => {
  theme = ensureValidTheme(theme, Theme.LIGHT)
  if (theme === Theme.LIGHTEST) {
    return `
      --spectrum-global-color-gray-50: rgb(255, 255, 255);
      --spectrum-global-color-gray-200: rgb(244, 244, 244);
      --spectrum-global-color-gray-300: rgb(234, 234, 234);
      --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-50);
    `
  }
  if (theme === Theme.LIGHT) {
    return `
    --spectrum-global-color-gray-50: rgb(255, 255, 255);
    --spectrum-global-color-gray-200: rgb(234, 234, 234);
    --spectrum-global-color-gray-300: rgb(225, 225, 225);
    --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-50);
    `
  }
  if (theme === Theme.DARK) {
    return `
    --spectrum-global-color-gray-100: rgb(50, 50, 50);
    --spectrum-global-color-gray-200: rgb(62, 62, 62);
    --spectrum-global-color-gray-300: rgb(74, 74, 74);
    --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
  if (theme === Theme.DARKEST) {
    return `
  --spectrum-global-color-gray-100: rgb(30, 30, 30);
  --spectrum-global-color-gray-200: rgb(44, 44, 44);
  --spectrum-global-color-gray-300: rgb(57, 57, 57);
  --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
  if (theme === Theme.NORD) {
    return `
    --spectrum-global-color-gray-100: #3b4252;

  --spectrum-global-color-gray-200: #424a5c;
  --spectrum-global-color-gray-300: #4c566a;
  --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
  if (theme === Theme.MIDNIGHT) {
    return `
    --hue: 220;
    --sat: 10%;
    --spectrum-global-color-gray-100: hsl(var(--hue), var(--sat), 17%);
    --spectrum-global-color-gray-200: hsl(var(--hue), var(--sat), 20%);
    --spectrum-global-color-gray-300: hsl(var(--hue), var(--sat), 24%);
    --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
}
