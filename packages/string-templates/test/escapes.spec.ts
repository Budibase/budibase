import { processString } from "../src/index"

describe("Handling context properties with spaces in their name", () => {
  it("should allow through literal specifiers", async () => {
    const output = await processString("test {{ [one thing] }}", {
      "one thing": 1,
    })
    expect(output).toBe("test 1")
  })

  it("should convert to dot notation where required", async () => {
    const output = await processString("test {{ one[0] }}", {
      one: [2],
    })
    expect(output).toBe("test 2")
  })

  it("should be able to handle a property with a space in its name", async () => {
    const output = await processString("hello my name is {{ [person name] }}", {
      "person name": "Mike",
    })
    expect(output).toBe("hello my name is Mike")
  })

  it("should be able to handle an object with layers that requires escaping", async () => {
    const output = await processString("testcase {{ thing.[one case] }}", {
      thing: {
        "one case": 1,
      },
    })
    expect(output).toBe("testcase 1")
  })

  it("should allow the use of a", async () => {
    const output = await processString("{{ a }}", { a: 1 })
    expect(output).toEqual("1")
  })
})

describe("attempt some complex problems", () => {
  it("should be able to handle a very complex handlebars statement", async () => {
    const context = {
      "New Repeater": {
        "Get Actors": {
          first_name: "Bob",
          last_name: "Bobert",
        },
      },
    }
    const hbs =
      "{{ [New Repeater].[Get Actors].[first_name] }} {{ [New Repeater].[Get Actors].[last_name] }}"
    const output = await processString(hbs, context)
    expect(output).toBe("Bob Bobert")
  })

  it("should be able to process an odd string produced by builder", async () => {
    const context = {
      c306d140d7e854f388bae056db380a0eb: {
        "one prop": "test",
      },
    }
    const hbs = "null{{ [c306d140d7e854f388bae056db380a0eb].[one prop] }}"
    const output = await processString(hbs, context)
    expect(output).toBe("nulltest")
  })
})

describe("check behaviour with newlines", () => {
  const context = {
    binding: `Hello
      there`,
  }
  it("should escape new line to \\n with double brace", async () => {
    const hbs = JSON.stringify({
      body: "{{ binding }}",
    })
    const output = await processString(hbs, context, { escapeNewlines: true })
    expect(JSON.parse(output).body).toBe(context.binding)
  })

  it("should work the same with triple brace", async () => {
    const hbs = JSON.stringify({
      body: "{{{ binding }}}",
    })
    const output = await processString(hbs, context, { escapeNewlines: true })
    expect(JSON.parse(output).body).toBe(context.binding)
  })

  it("should still work with helpers disabled", async () => {
    const hbs = JSON.stringify({
      body: "{{ binding }}",
    })
    const output = await processString(hbs, context, {
      escapeNewlines: true,
      noHelpers: true,
    })
    expect(JSON.parse(output).body).toBe(context.binding)
  })
})
