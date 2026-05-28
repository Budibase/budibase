import { describe, expect, it } from "vitest"
import { defaultErrorForConstraint, getConstraintsForType } from "./constraints"

describe("validation constraints", () => {
  it.each([
    [
      "string",
      [
        "required",
        "minLength",
        "maxLength",
        "equal",
        "notEqual",
        "regex",
        "notRegex",
        "url",
        "email",
      ],
    ],
    ["number", ["required", "maxValue", "minValue", "equal", "notEqual"]],
    ["boolean", ["required", "equal", "notEqual"]],
    ["datetime", ["required", "maxValue", "minValue", "equal", "notEqual"]],
    ["attachment", ["required", "maxFileSize", "maxUploadSize"]],
    ["attachment_single", ["required", "maxUploadSize"]],
    ["signature_single", ["required"]],
    ["link", ["required", "contains", "notContains", "minLength", "maxLength"]],
    [
      "array",
      ["required", "minLength", "maxLength", "contains", "notContains"],
    ],
  ])("returns constraints for %s fields", (fieldType, expected) => {
    const constraints = getConstraintsForType(fieldType)
    const values = constraints.map(constraint => constraint.value)

    expect(values).toStrictEqual(expected)
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

  it("includes an email rule for text and email fields", () => {
    const stringConstraints = getConstraintsForType("string")
    const emailConstraints = getConstraintsForType("email")

    expect(stringConstraints.map(constraint => constraint.value)).toContain(
      "email"
    )
    expect(emailConstraints.map(constraint => constraint.value)).toContain(
      "email"
    )
  })
})

describe("defaultErrorForConstraint", () => {
  const jsBinding = '{{ js "cmV0dXJuICdoZWxsbyB3b3JsZCc=" }}'

  it("returns a fixed message for required", () => {
    expect(defaultErrorForConstraint("required", null)).toBe("Required")
  })

  it.each([
    ["url", null, "Must be a valid URL"],
    ["email", null, "Must be a valid email address"],
    ["minLength", 5, "Must be at least 5 characters"],
    ["maxLength", 10, "Must be at most 10 characters"],
    ["minValue", 5, "Must be at least 5"],
    ["maxValue", 10, "Must be at most 10"],
    ["equal", "active", "Must equal active"],
    ["notEqual", "inactive", "Must not equal inactive"],
    ["regex", "^[a-z]+$", "Invalid format"],
    ["notRegex", "^[0-9]+$", "Invalid format"],
    ["contains", "admin", 'Must contain "admin"'],
    ["notContains", "guest", 'Must not contain "guest"'],
    ["maxFileSize", 5, "Files must be smaller than 5 MB"],
    ["maxUploadSize", 20, "Total upload size must be at most 20 MB"],
    ["inclusion", ["one", "two"], "Invalid value"],
    ["json", null, "Invalid value"],
  ])("returns the default error for %s", (constraint, value, message) => {
    expect(defaultErrorForConstraint(constraint, value)).toBe(message)
  })

  it.each([
    ["minValue", "2020-10-01", "Must be no earlier than 2020-10-01"],
    ["maxValue", "2020-10-01", "Must be no later than 2020-10-01"],
  ])("returns date-specific errors for %s", (constraint, value, message) => {
    expect(defaultErrorForConstraint(constraint, value, "datetime")).toBe(
      message
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
    ["regex", "Invalid format"],
    ["notRegex", "Invalid format"],
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
