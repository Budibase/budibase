import { expect, describe, it } from "vitest"
import { duplicateName, getSequentialName } from "../duplicate"

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

describe("getSequentialName", () => {
  it("handles nullish items", async () => {
    const name = getSequentialName(null, "foo")
    expect(name).toBe("foo")
  })

  it("handles nullish prefix", async () => {
    const name = getSequentialName([], null)
    expect(name).toBe(null)
  })

  it("handles just the prefix", async () => {
    const name = getSequentialName(["foo"], "foo")
    expect(name).toBe("foo2")
  })

  it("handles continuous ranges", async () => {
    const name = getSequentialName(["foo", "foo2", "foo3"], "foo")
    expect(name).toBe("foo4")
  })

  it("handles discontinuous ranges", async () => {
    const name = getSequentialName(["foo", "foo3"], "foo")
    expect(name).toBe("foo4")
  })

  it("handles a space inside the prefix", async () => {
    const name = getSequentialName(["foo", "foo 2", "foo 3"], "foo ")
    expect(name).toBe("foo 4")
  })

  it("handles a space inside the prefix with just the prefix", async () => {
    const name = getSequentialName(["foo"], "foo ")
    expect(name).toBe("foo 2")
  })

  it("handles no matches", async () => {
    const name = getSequentialName(["aaa", "bbb"], "foo")
    expect(name).toBe("foo")
  })

  it("handles similar names", async () => {
    const name = getSequentialName(["fooo1", "2foo", "a3foo4", "5foo5"], "foo")
    expect(name).toBe("foo")
  })

  it("handles non-string names", async () => {
    const name = getSequentialName([null, 4123, [], {}], "foo")
    expect(name).toBe("foo")
  })

  it("handles deep getters", async () => {
    const name = getSequentialName([{ a: "foo 1" }], "foo ", {
      getName: x => x.a,
    })
    expect(name).toBe("foo 2")
  })

  it("handles a mixture of spaces and not", async () => {
    const name = getSequentialName(["foo", "foo 1", "foo 2"], "foo")
    expect(name).toBe("foo3")
  })

  it("handles numbering the first item", async () => {
    const name = getSequentialName(["foo1", "foo2", "foo"], "foo ", {
      numberFirstItem: true,
    })
    expect(name).toBe("foo 3")
  })
})
