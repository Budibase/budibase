const {
  processString,
} = require("../src/index")

describe("test the custom helpers we have applied", () => {
  it("should be able to use the object helper", async () => {
    const output = await processString("object is {{ object obj }}", {
      obj: { a: 1 },
    })
    expect(output).toBe("object is {\"a\":1}")
  })
})

describe("test the math helpers", () => {
  it("should be able to produce an absolute", async () => {
    const output = await processString("{{abs a}}", {
      a: -10,
    })
    expect(parseInt(output)).toBe(10)
  })

  it("should be able to add", async () => {
    const output = await processString("{{add a b}}", {
      a: 10,
      b: 10,
    })
    expect(parseInt(output)).toBe(20)
  })

  it("should be able to average", async () => {
    const output = await processString("{{avg a b c}}", {
      a: 1,
      b: 2,
      c: 3,
    })
    expect(parseInt(output)).toBe(2)
  })
})

describe("test the array helpers", () => {
  const array = ["hi", "person", "how", "are", "you"]
  it("should allow use of the after helper", async () => {
    const output = await processString("{{after array 1}}", {
      array,
    })
    expect(output).toBe("person,how,are,you")
  })

  it("should allow use of the before helper", async () => {
    const output = await processString("{{before array 2}}", {
      array,
    })
    expect(output).toBe("hi,person,how")
  })

  it("should allow use of the filter helper", async () => {
    const output = await processString("{{#filter array \"person\"}}THING{{else}}OTHER{{/filter}}", {
      array,
    })
    expect(output).toBe("THING")
  })

  it("should allow use of the itemAt helper", async () => {
    const output = await processString("{{itemAt array 1}}", {
      array,
    })
    expect(output).toBe("person")
  })

  it("should allow use of the join helper", async () => {
    const output = await processString("{{join array \"-\"}}", {
      array,
    })
    expect(output).toBe("hi-person-how-are-you")
  })

  it("should allow use of the sort helper", async () => {
    const output = await processString("{{sort array}}", {
      array: ["d", "a", "c", "e"]
    })
    expect(output).toBe("a,c,d,e")
  })

  it("should allow use of the unique helper", async () => {
    const output = await processString("{{unique array}}", {
      array: ["a", "a", "b"]
    })
    expect(output).toBe("a,b")
  })

  it("should allow a complex case", async () => {
    const output = await processString("{{ last ( sort ( unique array ) ) }}", {
      array: ["a", "a", "d", "c", "e"]
    })
    expect(output).toBe("e")
  })
})

describe("test the number helpers", () => {
  it("should allow use of the addCommas helper", async () => {
    const output = await processString("{{ addCommas number }}", {
      number: 10000000
    })
    expect(output).toBe("10,000,000")
  })

  it("should allow use of the phoneNumber helper", async () => {
    const output = await processString("{{ phoneNumber number }}", {
      number: 4490102030,
    })
    expect(output).toBe("(449) 010-2030")
  })

  it("should allow use of the toPrecision helper", async () => {
    const output = await processString("{{ toPrecision number 2 }}", {
      number: 1.222222222,
    })
    expect(output).toBe("1.2")
  })

  it("should allow use of the bytes helper", async () => {
    const output = await processString("{{ bytes number }}", {
      number: 1000000,
    })
    expect(output).toBe("1 MB")
  })
})

describe("test the url helpers", () => {
  const url = "http://example.com?query=1"
  it("should allow use of the stripQueryString helper", async () => {
    const output = await processString('{{stripQuerystring url }}', {
      url,
    })
    expect(output).toBe("http://example.com")
  })

  it("should allow use of the stripProtocol helper", async () => {
    const output = await processString("{{ stripProtocol url }}", {
      url,
    })
    expect(output).toBe("//example.com/?query=1")
  })

  it("should allow use of the urlParse helper", async () => {
    const output = await processString("{{ object ( urlParse url ) }}", {
      url,
    })
    expect(output).toBe("{\"protocol\":\"http:\",\"slashes\":true,\"auth\":null,\"host\":\"example.com\"," +
      "\"port\":null,\"hostname\":\"example.com\",\"hash\":null,\"search\":\"?query=1\"," +
      "\"query\":\"query=1\",\"pathname\":\"/\",\"path\":\"/?query=1\"," +
      "\"href\":\"http://example.com/?query=1\"}")
  })
})

describe("test the date helpers", () => {
  it("should allow use of the date helper", async () => {
    const date = new Date(1611577535000)
    const output = await processString("{{ date time 'YYYY-MM-DD' }}", {
      time: date.toISOString(),
    })
    expect(output).toBe("2021-01-25")
  })

  it("should allow use of the date helper with now time", async () => {
    const date = new Date()
    const output = await processString("{{ date now 'DD' }}", {})
    expect(output).toBe(date.getDate().toString())
  })
})

describe("test the string helpers", () => {
  it("should allow use of the append helper", async () => {
    const output = await processString("{{ append filename '.txt' }}", {
      filename: "yummy",
    })
    expect(output).toBe("yummy.txt")
  })

  it("should allow use of the camelcase helper", async () => {
    const output = await processString("{{ camelcase camel }}", {
      camel: "testing this thing",
    })
    expect(output).toBe("testingThisThing")
  })

  it("should allow use of the capitalize helper", async () => {
    const output = await processString("{{ capitalize string }}", {
      string: "this is a string",
    })
    expect(output).toBe("This is a string")
  })

  it("should allow use of the capitalizeAll helper", async () => {
    const output = await processString("{{ capitalizeAll string }}", {
      string: "this is a string",
    })
    expect(output).toBe("This Is A String")
  })

  it("should allow use of the replace helper", async () => {
    const output = await processString("{{ replace string 'Mike' name }}", {
      string: "Hello my name is Mike",
      name: "David",
    })
    expect(output).toBe("Hello my name is David")
  })

  it("should allow use of the split helper", async () => {
    const output = await processString("{{ first ( split string ' ' ) }}", {
      string: "this is a string",
    })
    expect(output).toBe("this")
  })

  it("should allow use of the remove helper", async () => {
    const output = await processString("{{ remove string 'string' }}", {
      string: "this is a string",
    })
    expect(output).toBe("this is a ")
  })

  it("should allow use of the startsWith helper", async () => {
    const output = await processString("{{ #startsWith 'Hello' string }}Hi!{{ else }}Goodbye!{{ /startsWith }}", {
      string: "Hello my name is Mike",
    })
    expect(output).toBe("Hi!")
  })
})

describe("test the comparison helpers", () => {
  async function compare(func, a, b) {
    const output = await processString(`{{ #${func} a b }}Success{{ else }}Fail{{ /${func} }}`, {
      a,
      b,
    })
    expect(output).toBe("Success")
  }
  it("should allow use of the lt helper", async () => {
    await compare("lt", 10, 15)
  })

  it("should allow use of the gt helper", async () => {
    await compare("gt", 15, 10)
  })

  it("should allow use of the and helper", async () => {
    await compare("and", true, true)
  })

  it("should allow use of the or helper", async () => {
    await compare("or", false, true)
  })

  it("should allow use of gte with a literal value", async () => {
    const output = await processString(`{{ #gte a "50" }}s{{ else }}f{{ /gte }}`, {
      a: 51,
    })
    expect(output).toBe("s")
  })
})

describe("Test the literal helper", () => {
  it("should allow use of the literal specifier for a number", async () => {
    const output = await processString(`{{literal a}}`, {
      a: 51,
    })
    expect(output).toBe(51)
  })

  it("should allow use of the literal specifier for an object", async () => {
    const output = await processString(`{{literal a}}`, {
      a: {b: 1},
    })
    expect(output.b).toBe(1)
  })
})