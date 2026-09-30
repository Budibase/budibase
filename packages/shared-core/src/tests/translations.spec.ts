import { resolveTranslationGroup } from "../translations"

describe("translations", () => {
  it("supports the configured minimum password length", () => {
    const labels = resolveTranslationGroup("passwordModal")

    expect(labels.minLengthText.replace("{minLength}", "10")).toBe(
      "Please enter at least 10 characters. We recommend using machine generated or random passwords."
    )
  })
})
