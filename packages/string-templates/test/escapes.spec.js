const {
  processString,
} = require("../src/index")

describe("Handling context properties with spaces in their name", () => {
  it("should allow through literal specifiers", async () => {
    const output = await processString("test {{ [test thing] }}", {
      "test thing": 1
    })
    expect(output).toBe("test 1")
  })

  it("should convert to dot notation where required", async () => {
    const output = await processString("test {{ test[0] }}", {
      test: [2]
    })
    expect(output).toBe("test 2")
  })

  it("should be able to handle a property with a space in its name", async () => {
    const output = await processString("hello my name is {{ person name }}", {
      "person name": "Mike",
    })
    expect(output).toBe("hello my name is Mike")
  })

  it("should be able to handle an object with layers that requires escaping", async () => {
    const output = await processString("testcase {{ testing.test case }}", {
      testing: {
        "test case": 1
      }
    })
    expect(output).toBe("testcase 1")
  })
})

describe("attempt some complex problems", () => {
  it("should be able to handle a very complex handlebars statement", async () => {
    const context = {
      "New Repeater": {
        "Get Actors": {
          "first_name": "Bob",
          "last_name": "Bobert"
        },
      },
    }
    const hbs = "{{ New Repeater.Get Actors.first_name }} {{ New Repeater.Get Actors.last_name }}"
    const output = await processString(hbs, context)
    expect(output).toBe("Bob Bobert")
  })
})