const {
  processObject,
  processString,
} = require("../src/index")

describe("Test that the string processing works correctly", () => {
  it("should process a basic template string", async () => {
    const output = await processString("templating is {{ adjective }}", {
      adjective: "easy"
    })
    expect(output).toBe("templating is easy")
  })

  it("should process a literal template", async () => {
    const output = await processString("derp is {{{ adjective }}}", {
      adjective: "derp"
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
})

describe("Test that the object processing works correctly", () => {
  it("should be able to process an object with some template strings", async () => {
    const output = await processObject({
      first: "thing is {{ adjective }}",
      second: "thing is bad",
      third: "we are {{ adjective }} {{ noun }}",
    }, {
      adjective: "easy",
      noun: "people",
    })
    expect(output.first).toBe("thing is easy")
    expect(output.second).toBe("thing is bad")
    expect(output.third).toBe("we are easy people")
  })

  it("should be able to handle arrays of string templates", async () => {
    const output = await processObject(["first {{ noun }}", "second {{ noun }}"], {
      noun: "person"
    })
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

  it("should fail gracefully when wrong type is passed in", async () => {
    let error = null
    try {
      await processObject(null, null)
    } catch (err) {
      error = err
    }
    expect(error).not.toBeNull()
  })
})