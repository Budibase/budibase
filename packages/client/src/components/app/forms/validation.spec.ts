// @vitest-environment jsdom

import { describe, expect, it } from "vitest"
import { FieldType } from "@budibase/types"
import { createValidatorFromConstraints } from "./validation"

describe("createValidatorFromConstraints", () => {
  const jsBinding = '{{ js "cmV0dXJuICdoZWxsbyB3b3JsZCc=" }}'

  it("uses a default error for custom rules without an error", () => {
    const validate = createValidatorFromConstraints(
      null,
      [
        {
          type: FieldType.STRING,
          constraint: "minLength",
          value: 10,
        },
      ],
      "name",
      undefined
    )

    expect(validate("short")).toBe("Must be at least 10 characters")
  })

  it("uses custom errors when set", () => {
    const validate = createValidatorFromConstraints(
      null,
      [
        {
          type: FieldType.STRING,
          constraint: "minLength",
          value: 10,
          error: "Use a longer name",
        },
      ],
      "name",
      undefined
    )

    expect(validate("short")).toBe("Use a longer name")
  })

  it("does not include JavaScript binding values in fallback errors", () => {
    const validate = createValidatorFromConstraints(
      null,
      [
        {
          type: FieldType.STRING,
          constraint: "equal",
          value: jsBinding,
        },
      ],
      "name",
      undefined
    )

    expect(validate("different value")).toBe("Invalid value")
  })
})
