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
})

describe("defaultErrorForConstraint", () => {
  it("returns a fixed message for required", () => {
    expect(defaultErrorForConstraint("required", null)).toBe("Required")
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

  it("returns a generic message for unknown constraints", () => {
    expect(defaultErrorForConstraint("not-a-real-constraint", null)).toBe(
      "Invalid value"
    )
    expect(defaultErrorForConstraint(undefined, null)).toBe("Invalid value")
  })
})
