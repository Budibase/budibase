import { randomUUID } from "crypto"
import environment, { SECRETS } from "../../environment"
import { stringContainsSecret } from "../secrets"

describe("secrets", () => {
  describe("stringContainsSecret", () => {
    it.each(SECRETS)("detects that a string contains a secret in: %s", key => {
      const needle = randomUUID()
      const haystack = `this is a secret: ${needle}`
      const old = environment[key]
      environment._set(key, needle)

      try {
        expect(stringContainsSecret(haystack)).toBe(true)
      } finally {
        environment._set(key, old)
      }
    })

    it.each(SECRETS)(
      "detects that a string does not contain a secret in: %s",
      key => {
        const needle = randomUUID()
        const haystack = `this does not contain a secret`
        const old = environment[key]
        environment._set(key, needle)
        try {
          expect(stringContainsSecret(haystack)).toBe(false)
        } finally {
          environment._set(key, old)
        }
      }
    )
  })
})
