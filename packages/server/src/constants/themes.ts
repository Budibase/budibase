export const getThemeVariables = (theme: string) => {
  if (theme === "spectrum--lightest") {
    return `
      --spectrum-global-color-gray-50: rgb(255, 255, 255);
      --spectrum-global-color-gray-200: rgb(244, 244, 244);
      --spectrum-global-color-gray-300: rgb(234, 234, 234);
      --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-50);
    `
  }
  if (theme === "spectrum--light") {
    return `
    --spectrum-global-color-gray-50: rgb(255, 255, 255);
    --spectrum-global-color-gray-200: rgb(234, 234, 234);
    --spectrum-global-color-gray-300: rgb(225, 225, 225);
    --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-50);

    `
  }
  if (theme === "spectrum--dark") {
    return `
    --spectrum-global-color-gray-100: rgb(50, 50, 50);
    --spectrum-global-color-gray-200: rgb(62, 62, 62);
    --spectrum-global-color-gray-300: rgb(74, 74, 74);
    --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
  if (theme === "spectrum--darkest") {
    return `
  --spectrum-global-color-gray-100: rgb(30, 30, 30);
  --spectrum-global-color-gray-200: rgb(44, 44, 44);
  --spectrum-global-color-gray-300: rgb(57, 57, 57);
  --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
  if (theme === "spectrum--nord") {
    return `
    --spectrum-global-color-gray-100: #3b4252;

  --spectrum-global-color-gray-200: #424a5c;
  --spectrum-global-color-gray-300: #4c566a;
  --spectrum-alias-background-color-primary: var(--spectrum-global-color-gray-100);
    `
  }
  if (theme === "spectrum--midnight") {
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
