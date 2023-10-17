import { expect, describe, it } from "vitest"
import { duplicateName } from "../duplicate"

describe("duplicate", () => {
  describe("duplicates a name ", () => {
    it("with a single existing", async () => {
      const names = ["foo"]
      const name = "foo"

      const duplicate = duplicateName(name, names)

      expect(duplicate).toBe("foo 1")
    })

    it("with multiple existing", async () => {
      const names = ["foo", "foo 1", "foo 2"]
      const name = "foo"

      const duplicate = duplicateName(name, names)

      expect(duplicate).toBe("foo 3")
    })

    it("with mixed multiple existing", async () => {
      const names = ["foo", "foo 1", "foo 2", "bar", "bar 1", "bar 2"]
      const name = "foo"

      const duplicate = duplicateName(name, names)

      expect(duplicate).toBe("foo 3")
    })

    it("with incomplete sequence", async () => {
      const names = ["foo", "foo 2", "foo 3"]
      const name = "foo"

      const duplicate = duplicateName(name, names)

      expect(duplicate).toBe("foo 1")
    })
  })
})
