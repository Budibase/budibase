const {
  processString,
} = require("../src/index")

describe("Handling context properties with spaces in their name", () => {
  it("should be able to handle a property with a space in its name", () => {
    const output = processString("hello my name is {{ person name }}", {
      "person name": "Mike",
    })
    expect(output).toBe("hello my name is Mike")
  })

  it("should be able to handle an object with layers that requires escaping", () => {
    const output = processString("testcase {{ testing.test case }}", {
      testing: {
        "test case": 1
      }
    })
    expect(output).toBe("testcase 1")
  })
})