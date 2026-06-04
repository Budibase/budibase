// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { FieldType, type UIFieldValidationRule } from "@budibase/types"
import { createValidatorFromConstraints } from "./validation"

const URL_ERROR = "Invalid URL"
const EMAIL_ERROR = "Invalid email address"
const CONTAINS_ERROR = 'Must contain "admin"'
const NOT_CONTAINS_ERROR = 'Must not contain "guest"'

describe("form validation", () => {
  const createUrlValidator = (rule?: Partial<UIFieldValidationRule>) => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "url",
        error: URL_ERROR,
        ...rule,
      },
    ]

    return createValidatorFromConstraints(null, rules, "website", undefined)
  }

  const createEmailValidator = () => {
    const rules: UIFieldValidationRule[] = [
      {
        type: FieldType.STRING,
        constraint: "email",
        error: EMAIL_ERROR,
      },
    ]

    return createValidatorFromConstraints(null, rules, "email", undefined)
  }

  describe("URL validation", () => {
    let validator: ReturnType<typeof createUrlValidator>

    beforeEach(() => {
      validator = createUrlValidator()
    })

    it.each([
      "https://budibase.com",
      "http://budibase.com/pricing",
      "www.google.com",
      "http://localhost:10000",
      "http://192.168.0.1/path",
      "http://[2001:db8::1]/path",
      "https://example.com/path%5Csegment",
    ])("accepts valid URL %s", input => {
      expect(validator(input)).toBeNull()
    })

    it.each([
      "javascript:alert(1)",
      "mailto:test@example.com",
      "ftp://example.com",
      "https://www.g?&^%&^%&^%.com",
      "https://example.com\\path",
      "//////\\\\\\\\\\\\\\\\///////////////\\\\\\\\\\\\\\\\///www.google.com",
      "not a url",
    ])("rejects invalid URL %s", input => {
      expect(validator(input)).toBe(URL_ERROR)
    })

    it.each(["", null] as const)(
      "leaves empty value to other rules: %s",
      input => {
        expect(validator(input)).toBeNull()
      }
    )

    it.each([
      [["https"], "https://budibase.com", null],
      [["https"], "www.google.com", null],
      [["https"], "http://budibase.com", URL_ERROR],
      [["http"], "www.google.com", URL_ERROR],
      [["ftp"], "ftp://example.com", null],
      [["ftp"], "https://example.com", URL_ERROR],
      [["mailto"], "mailto:test@example.com", null],
      [["mailto"], "mailto:test@example.com?subject=Hello&body=World", null],
      [["mailto"], "test@example.com", URL_ERROR],
      [["mailto"], "https://example.com", URL_ERROR],
    ] as const)("protocols %j: %s", (protocols, input, expected) => {
      const restricted = createUrlValidator({ value: [...protocols] })
      expect(restricted(input)).toBe(expected)
    })
  })

  describe("email validation", () => {
    let validator: ReturnType<typeof createEmailValidator>

    beforeEach(() => {
      validator = createEmailValidator()
    })

    it.each([
      "user@example.com",
      "user.name+tag@example.co.uk",
      "user@sub.example.com",
    ])("accepts valid email %s", input => {
      expect(validator(input)).toBeNull()
    })

    it.each([
      "example.com",
      "user@example",
      "user@localhost",
      "user@example.c",
      "user@.example.com",
      "user@example..com",
      "user@-example.com",
      "user@example-.com",
      "user@exa_mple.com",
      "user@example.com.",
      "user@example.com/path",
      "user@example.com?subject=Hello",
      "mailto:user@example.com",
      "user@@example.com",
      "user name@example.com",
      " user@example.com ",
      "@example.com",
      "user@",
    ])("rejects invalid email %s", input => {
      expect(validator(input)).toBe(EMAIL_ERROR)
    })

    it.each(["", null] as const)(
      "leaves empty value to other rules: %s",
      input => {
        expect(validator(input)).toBeNull()
      }
    )
  })

  describe("contains validation", () => {
    const createContainsValidator = (
      type: FieldType,
      constraint: "contains" | "notContains" = "contains"
    ) => {
      const error =
        constraint === "contains" ? CONTAINS_ERROR : NOT_CONTAINS_ERROR
      const rules: UIFieldValidationRule[] = [
        {
          type,
          constraint,
          value: constraint === "contains" ? "admin" : "guest",
          error,
        },
      ]

      return createValidatorFromConstraints(null, rules, "field", undefined)
    }

    describe("string fields", () => {
      let validator: ReturnType<typeof createContainsValidator>

      beforeEach(() => {
        validator = createContainsValidator(FieldType.STRING)
      })

      it.each([
        ["admin user", null],
        ["hello world", CONTAINS_ERROR],
        ["foo", CONTAINS_ERROR],
      ] as const)("value %j", (input, expected) => {
        expect(validator(input)).toBe(expected)
      })

      it.each(["", null] as const)("empty value %s fails contains", input => {
        expect(validator(input)).toBe(CONTAINS_ERROR)
      })
    })

    describe("array fields", () => {
      let validator: ReturnType<typeof createContainsValidator>

      beforeEach(() => {
        validator = createContainsValidator(FieldType.ARRAY)
      })

      it.each([
        [["admin", "user"], null],
        [["user"], CONTAINS_ERROR],
      ] as const)("value %j", (input, expected) => {
        expect(validator(input)).toBe(expected)
      })

      it.each([null, []] as const)("empty value %j fails contains", input => {
        expect(validator(input)).toBe(CONTAINS_ERROR)
      })
    })

    describe("link fields", () => {
      let validator: ReturnType<typeof createContainsValidator>

      beforeEach(() => {
        validator = createContainsValidator(FieldType.LINK)
      })

      it.each([
        [["admin", "user"], null],
        [["user"], CONTAINS_ERROR],
      ] as const)("value %j", (input, expected) => {
        expect(validator(input)).toBe(expected)
      })
    })
  })

  describe("notContains validation", () => {
    const createNotContainsValidator = (type: FieldType) => {
      const rules: UIFieldValidationRule[] = [
        {
          type,
          constraint: "notContains",
          value: "guest",
          error: NOT_CONTAINS_ERROR,
        },
      ]

      return createValidatorFromConstraints(null, rules, "field", undefined)
    }

    it.each([
      [FieldType.STRING, "hello", null],
      [FieldType.STRING, "guest user", NOT_CONTAINS_ERROR],
      [FieldType.ARRAY, ["admin", "user"], null],
      [FieldType.ARRAY, ["guest"], NOT_CONTAINS_ERROR],
      [FieldType.LINK, ["admin"], null],
      [FieldType.LINK, ["guest"], NOT_CONTAINS_ERROR],
    ] as const)("type %s value %j", (type, input, expected) => {
      const validator = createNotContainsValidator(type)
      expect(validator(input)).toBe(expected)
    })
  })
})
