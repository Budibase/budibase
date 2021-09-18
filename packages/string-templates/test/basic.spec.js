const {
  processObject,
  processString,
  isValid,
  makePropSafe,
  getManifest,
} = require("../src/index.cjs")

describe("Test that the string processing works correctly", () => {
  it("should process a basic template string", async () => {
    const output = await processString("templating is {{ adjective }}", {
      adjective: "easy",
    })
    expect(output).toBe("templating is easy")
  })

  it("should process a literal template", async () => {
    const output = await processString("derp is {{{ adjective }}}", {
      adjective: "derp",
    })
    expect(output).toBe("derp is derp")
  })

  it("should fail gracefully when wrong type passed in", async () => {
    let error = null
    try {
      await processString(null, null)
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
  })

  it("confirm that null properties are handled correctly", async () => {
    const output = await processString("hello {{ name }} I am {{ name2 }}", {
      name: undefined,
      name2: null,
    })
    expect(output).toBe("hello  I am ")
  })
})

describe("Test that the object processing works correctly", () => {
  it("should be able to process an object with some template strings", async () => {
    const output = await processObject(
      {
        first: "thing is {{ adjective }}",
        second: "thing is bad",
        third: "we are {{ adjective }} {{ noun }}",
      },
      {
        adjective: "easy",
        noun: "people",
      }
    )
    expect(output.first).toBe("thing is easy")
    expect(output.second).toBe("thing is bad")
    expect(output.third).toBe("we are easy people")
  })

  it("should be able to handle arrays of string templates", async () => {
    const output = await processObject(
      ["first {{ noun }}", "second {{ noun }}"],
      {
        noun: "person",
      }
    )
    expect(output[0]).toBe("first person")
    expect(output[1]).toBe("second person")
  })

  it("should fail gracefully when object passed in has cycles", async () => {
    let error = null
    try {
      const innerObj = { a: "thing {{ a }}" }
      innerObj.b = innerObj
      await processObject(innerObj, { a: 1 })
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
  })

  it("check objects get converted to string JSON automatically", async () => {
    const row = {a: 1}
    const output = await processString("{{ trigger.row }}", {
      trigger: {
        row,
      }
    })
    expect(JSON.parse(output)).toEqual(row)
  })

  it("should be able to handle null objects", async () => {
    let error = null
    try {
      await processObject(null, null)
    } catch (err) {
      error = err
    }
    expect(error).toBeNull()
  })
})

describe("check the utility functions", () => {
  it("should return false for an invalid template string", () => {
    const valid = isValid("{{ table1.thing prop }}")
    expect(valid).toBe(false)
  })

  it("should state this template is valid", () => {
    const valid = isValid("{{ thing }}")
    expect(valid).toBe(true)
  })

  it("should make a property safe", () => {
    const property = makePropSafe("thing")
    expect(property).toEqual("[thing]")
  })

  it("should be able to handle an input date object", async () => {
    const date = new Date()
    const output = await processString("{{ dateObj }}", { dateObj: date })
    expect(date.toString()).toEqual(output)
  })
})

describe("check manifest", () => {
  it("should be able to retrieve the manifest", () => {
    const manifest = getManifest()
    expect(manifest.math).not.toBeNull()
    expect(manifest.math.abs.description).toBe(
      "<p>Return the magnitude of <code>a</code>.</p>\n"
    )
  })
})
