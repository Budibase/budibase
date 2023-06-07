const {
  processObject,
  processString,
  isValid,
  makePropSafe,
  getManifest,
  encodeJSBinding,
  doesContainString,
  disableEscaping,
  findHBSBlocks,
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

describe("check returning objects", () => {
  it("should handle an array of objects", async () => {
    const json = [{a: 1},{a: 2}]
    const output = await processString("{{ testing }}", {
      testing: json
    })
    expect(output).toEqual(JSON.stringify(json))
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

describe("check falsy values", () => {
  it("should get a zero out when context contains it", async () => {
    const output = await processString("{{ number }}", { number: 0 })
    expect(output).toEqual("0")
  })

  it("should get false out when context contains it", async () => {
    const output = await processString("{{ bool }}", { bool: false })
    expect(output).toEqual("false")
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

describe("check full stops that are safe", () => {
  it("should allow using an escaped full stop", async () => {
    const data = {
      "c53a4a604fa754d33baaafd5bca4d3658-YXuUBqt5vI": { "persons.firstname": "1" }
    }
    const template = "{{ [c53a4a604fa754d33baaafd5bca4d3658-YXuUBqt5vI].[persons.firstname] }}"
    const output = await processString(template, data)
    expect(output).toEqual("1")
  })
})

describe("check does contain string function", () => {
  it("should work for a simple case", () => {
    const hbs = "hello {{ name }}"
    expect(doesContainString(hbs, "name")).toEqual(true)
  })

  it("should reject a case where its in the string, but not the handlebars", () => {
    const hbs = "hello {{ name }}"
    expect(doesContainString(hbs, "hello")).toEqual(false)
  })

  it("should handle if its in javascript", () => {
    const js = encodeJSBinding(`return $("foo")`)
    expect(doesContainString(js, "foo")).toEqual(true)
  })
})

describe("check that disabling escaping function works", () => {
  it("should work for a single statement", () => {
    expect(disableEscaping("{{ name }}")).toEqual("{{{ name }}}")
  })

  it("should work for two statements", () => {
    expect(disableEscaping("{{ name }} welcome to {{ platform }}")).toEqual("{{{ name }}} welcome to {{{ platform }}}")
  })

  it("shouldn't convert triple braces", () => {
    expect(disableEscaping("{{{ name }}}")).toEqual("{{{ name }}}")
  })

  it("should work with a combination", () => {
    expect(disableEscaping("{{ name }} welcome to {{{ platform }}}")).toEqual("{{{ name }}} welcome to {{{ platform }}}")
  })

  it("should work with multiple escaped", () => {
    expect(disableEscaping("{{ name }} welcome to {{ name }}")).toEqual("{{{ name }}} welcome to {{{ name }}}")
  })
})

describe("check find hbs blocks function", () => {
  it("should find none", () => {
    expect(findHBSBlocks("hello there")).toEqual([])
  })

  it("should find two", () => {
    expect(findHBSBlocks("{{ hello }} there {{{ name }}}")).toEqual(["{{ hello }}", "{{{ name }}}"])
  })
})

describe("should leave HBS blocks if not found using option", () => {
  it("should replace one, leave one", async () => {
    const output = await processString("{{ a }}, {{ b }}", { b: 1 }, { onlyFound: true })
    expect(output).toBe("{{ a }}, 1")
  })
})
