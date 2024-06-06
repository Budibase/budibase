import vm from "vm"

import { processStringSync, encodeJSBinding, setJSRunner } from "../src/index"
import { UUID_REGEX } from "./constants"

const processJS = (js: string, context?: object): any => {
  return processStringSync(encodeJSBinding(js), context)
}

describe("Javascript", () => {
  beforeAll(() => {
    setJSRunner((js, context) => {
      return vm.runInNewContext(js, context, { timeout: 1000 })
    })
  })

  describe("Test the JavaScript helper", () => {
    it("should execute a simple expression", () => {
      const output = processJS(`return 1 + 2`)
      expect(output).toBe(3)
    })

    it("should be able to use primitive bindings", () => {
      const output = processJS(`return $("foo")`, {
        foo: "bar",
      })
      expect(output).toBe("bar")
    })

    it("should be able to use an object binding", () => {
      const output = processJS(`return $("foo").bar`, {
        foo: {
          bar: "baz",
        },
      })
      expect(output).toBe("baz")
    })

    it("should be able to use a complex object binding", () => {
      const output = processJS(`return $("foo").bar[0].baz`, {
        foo: {
          bar: [
            {
              baz: "shazbat",
            },
          ],
        },
      })
      expect(output).toBe("shazbat")
    })

    it("should be able to use a deep binding", () => {
      const output = processJS(`return $("foo.bar.baz")`, {
        foo: {
          bar: {
            baz: "shazbat",
          },
        },
      })
      expect(output).toBe("shazbat")
    })

    it("should be able to return an object", () => {
      const output = processJS(`return $("foo")`, {
        foo: {
          bar: {
            baz: "shazbat",
          },
        },
      })
      expect(output.bar.baz).toBe("shazbat")
    })

    it("should be able to return an array", () => {
      const output = processJS(`return $("foo")`, {
        foo: ["a", "b", "c"],
      })
      expect(output[2]).toBe("c")
    })

    it("should be able to return null", () => {
      const output = processJS(`return $("foo")`, {
        foo: null,
      })
      expect(output).toBe(null)
    })

    it("should be able to return undefined", () => {
      const output = processJS(`return $("foo")`, {
        foo: undefined,
      })
      expect(output).toBe(undefined)
    })

    it("should be able to return 0", () => {
      const output = processJS(`return $("foo")`, {
        foo: 0,
      })
      expect(output).toBe(0)
    })

    it("should be able to return an empty string", () => {
      const output = processJS(`return $("foo")`, {
        foo: "",
      })
      expect(output).toBe("")
    })

    it("should be able to use a deep array binding", () => {
      const output = processJS(`return $("foo.0.bar")`, {
        foo: [
          {
            bar: "baz",
          },
        ],
      })
      expect(output).toBe("baz")
    })

    it("should handle errors", () => {
      const output = processJS(`throw "Error"`)
      expect(output).toBe("Error while executing JS")
    })

    it("should timeout after one second", () => {
      const output = processJS(`while (true) {}`)
      expect(output).toBe("Timed out while executing JS")
    })

    it("should prevent access to the process global", () => {
      const output = processJS(`return process`)
      expect(output).toBe("Error while executing JS")
    })
  })

  describe("check JS helpers", () => {
    it("should error if using the format helper. not helpers.", () => {
      const output = processJS(`return helper.toInt(4.3)`)
      expect(output).toBe("Error while executing JS")
    })

    it("should be able to use toInt", () => {
      const output = processJS(`return helpers.toInt(4.3)`)
      expect(output).toBe(4)
    })

    it("should be able to use uuid", () => {
      const output = processJS(`return helpers.uuid()`)
      expect(output).toMatch(UUID_REGEX)
    })
  })

  describe("JS literal strings", () => {
    it("should be able to handle a literal string that is quoted (like role IDs)", () => {
      const output = processJS(`return $("'Custom'")`)
      expect(output).toBe("Custom")
    })
  })
})
