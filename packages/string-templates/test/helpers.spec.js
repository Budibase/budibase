const {
  processString,
} = require("../src/index")

describe("test the custom helpers we have applied", () => {
  it("should be able to use the object helper", () => {
    const output = processString("object is {{ object obj }}", {
      obj: { a: 1 },
    })
    expect(output).toBe("object is {\"a\":1}")
  })
})