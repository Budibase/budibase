import { describe, expect, it } from "vitest"
import { defaultErrorForConstraint, getConstraintsForType } from "./constraints"

describe("validation constraints", () => {
  it("includes min and max length for string fields", () => {
    const constraints = getConstraintsForType("string")
    const values = constraints.map(constraint => constraint.value)

    expect(values).toContain("minLength")
    expect(values).toContain("maxLength")
  })

  it("returns empty constraints for unknown field types", () => {
    expect(getConstraintsForType("not-a-real-type")).toStrictEqual([])
  })

  it("includes a URL rule for text and URL fields", () => {
    const stringConstraints = getConstraintsForType("string")
    const urlConstraints = getConstraintsForType("url")

    expect(stringConstraints.map(constraint => constraint.value)).toContain(
      "url"
    )
    expect(urlConstraints.map(constraint => constraint.value)).toContain("url")
  })
})

describe("defaultErrorForConstraint", () => {
  const jsBinding = '{{ js "cmV0dXJuICdoZWxsbyB3b3JsZCc=" }}'

  it("returns a fixed message for required", () => {
    expect(defaultErrorForConstraint("required", null)).toBe("Required")
  })

  it("returns a fixed message for url", () => {
    expect(defaultErrorForConstraint("url", null)).toBe("Must be a valid URL")
  })

  it("includes the value for minLength when set", () => {
    expect(defaultErrorForConstraint("minLength", 5)).toBe(
      "Must be at least 5 characters"
    )
  })

  it("falls back to a generic minLength message when value is missing", () => {
    expect(defaultErrorForConstraint("minLength", null)).toBe("Too short")
    expect(defaultErrorForConstraint("minLength", "")).toBe("Too short")
  })

  it.each([
    ["minLength", "Too short"],
    ["maxLength", "Too long"],
    ["minValue", "Value too low"],
    ["maxValue", "Value too high"],
    ["equal", "Invalid value"],
    ["notEqual", "Invalid value"],
    ["contains", "Missing required content"],
    ["notContains", "Invalid content"],
    ["maxFileSize", "File too large"],
    ["maxUploadSize", "Upload too large"],
  ])(
    "does not include JavaScript binding values for %s",
    (constraint, message) => {
      expect(defaultErrorForConstraint(constraint, jsBinding)).toBe(message)
    }
  )

  it("returns a generic message for unknown constraints", () => {
    expect(defaultErrorForConstraint("not-a-real-constraint", null)).toBe(
      "Invalid value"
    )
    expect(defaultErrorForConstraint(undefined, null)).toBe("Invalid value")
  })
})
