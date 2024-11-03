import { getThemeClassNames, ensureValidTheme } from "../themes"
import { Theme } from "@budibase/types"

describe("theme class names", () => {
  it("generates class names for a theme without base theme", () => {
    expect(getThemeClassNames(Theme.LIGHT)).toStrictEqual("spectrum--light")
  })
  it("generates class names for a theme with base theme", () => {
    expect(getThemeClassNames(Theme.NORD)).toStrictEqual(
      "spectrum--darkest spectrum--nord"
    )
  })
})

describe("theme validity checking", () => {
  it("handles no theme", () => {
    expect(ensureValidTheme(undefined)).toStrictEqual(Theme.DARKEST)
  })
  it("allows specifiying a fallback", () => {
    expect(ensureValidTheme(undefined, Theme.NORD)).toStrictEqual(Theme.NORD)
  })
  it("migrates lightest to light", () => {
    expect(ensureValidTheme(Theme.LIGHTEST)).toStrictEqual(Theme.LIGHT)
  })
  it("migrates dark to darkest", () => {
    expect(ensureValidTheme(Theme.DARK)).toStrictEqual(Theme.DARKEST)
  })
})
