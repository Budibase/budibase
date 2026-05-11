import {
  DefaultExistingAppFontFamily,
  DefaultNewAppFontFamily,
  AppFontFamilyOptions,
  ensureValidAppFontFamily,
  getAppFontFamilyStack,
} from "../constants/themes"
import { getThemeClassNames, ensureValidTheme } from "../themes"
import { AppFontFamily, Theme } from "@budibase/types"

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

describe("app font families", () => {
  it("uses Source Sans for existing apps without a font", () => {
    expect(ensureValidAppFontFamily(undefined)).toStrictEqual(
      DefaultExistingAppFontFamily
    )
  })

  it("uses Inter for new apps", () => {
    expect(DefaultNewAppFontFamily).toStrictEqual(AppFontFamily.INTER)
  })

  it("only exposes Source Sans and Inter", () => {
    expect(AppFontFamilyOptions.map(option => option.value)).toStrictEqual([
      AppFontFamily.INTER,
      AppFontFamily.SOURCE_SANS,
    ])
  })

  it("falls back to Source Sans for unknown values", () => {
    expect(ensureValidAppFontFamily("unknown")).toStrictEqual(
      AppFontFamily.SOURCE_SANS
    )
  })

  it("rejects prototype property names", () => {
    expect(ensureValidAppFontFamily("constructor")).toStrictEqual(
      AppFontFamily.SOURCE_SANS
    )
  })

  it("resolves font stacks", () => {
    expect(getAppFontFamilyStack(AppFontFamily.SOURCE_SANS)).toBe(
      '"Source Sans 3", -apple-system, BlinkMacSystemFont, Segoe UI, "Inter", "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    )
    expect(getAppFontFamilyStack(AppFontFamily.INTER)).toBe(
      '"Inter", -apple-system, BlinkMacSystemFont, Segoe UI, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    )
  })
})
