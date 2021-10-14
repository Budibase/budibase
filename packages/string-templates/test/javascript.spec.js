const { processStringSync, encodeJSBinding } = require("../src/index.cjs")

const processJS = (js, context) => {
  return processStringSync(encodeJSBinding(js), context)
}

describe("Test the JavaScript helper", () => {
  it("should execute a simple expression", () => {
    const output = processJS(`return 1 + 2`)
    expect(output).toBe("3")
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
    expect(output).toBe("Error while executing JS")
  })

  it("should prevent access to the process global", () => {
    const output = processJS(`return process`)
    expect(output).toBe("Error while executing JS")
  })

  it("should prevent sandbox escape", () => {
    const output = processJS(
      `return this.constructor.constructor("return process")()`
    )
    expect(output).toBe("Error while executing JS")
  })
})
