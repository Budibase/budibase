import { getNewFieldValue, safeParseField } from "../src/types"
import { getNewField } from "../src/templateApi/fields"
import { isDefined } from "../src/common"

const getField = type => {
  const field = getNewField(type)
  return field
}

const nothingReference = { key: "" }
const nothingFile = { relativePath: "", size: 0 }

describe("types > getNew", () => {
  const defaultAlwaysNull = type => () => {
    const field = getField(type)
    field.getInitialValue = "default"
    const value = getNewFieldValue(field)
    expect(value).toBe(null)
  }

  it(
    "bool should return null when fields getInitialValue is 'default'",
    defaultAlwaysNull("bool")
  )

  it(
    "string should return null when fields getInitialValue is 'default'",
    defaultAlwaysNull("string")
  )

  it(
    "number should return null when fields getInitialValue is 'default'",
    defaultAlwaysNull("number")
  )

  it(
    "datetime should return null when fields getInitialValue is 'default'",
    defaultAlwaysNull("datetime")
  )

  it("reference should return {key:''} when fields getInitialValue is 'default'", () => {
    const field = getField("reference")
    field.getInitialValue = "default"
    const value = getNewFieldValue(field)
    expect(value).toEqual(nothingReference)
  })

  it("file should return {relativePath:'', size:0} when fields getInitialValue is 'default'", () => {
    const field = getField("file")
    field.getInitialValue = "default"
    const value = getNewFieldValue(field)
    expect(value).toEqual(nothingFile)
  })

  it("array should return empty array when field getInitialValue is 'default'", () => {
    const field = getField("array<string>")
    field.getInitialValue = "default"
    const value = getNewFieldValue(field)
    expect(value).toEqual([])
  })

  it("datetime should return Now when getInitialValue is 'now'", () => {
    const field = getField("datetime")
    field.getInitialValue = "now"
    const before = new Date()
    const value = getNewFieldValue(field)
    const after = new Date()
    expect(value >= before && value <= after).toBeTruthy()
  })

  const test_getNewFieldValue = (type, val, expected) => () => {
    const field = getField(type)
    field.getInitialValue = val
    const value = getNewFieldValue(field)
    expect(value).toEqual(expected)
  }

  it("bool should parse value in getInitialValue if function not recognised", () => {
    test_getNewFieldValue("bool", "true", true)()
    test_getNewFieldValue("bool", "on", true)()
    test_getNewFieldValue("bool", "1", true)()
    test_getNewFieldValue("bool", "yes", true)()
    test_getNewFieldValue("bool", "false", false)()
    test_getNewFieldValue("bool", "off", false)()
    test_getNewFieldValue("bool", "0", false)()
    test_getNewFieldValue("bool", "no", false)()
  })

  it("bool should return null if function not recognised and value cannot be parsed", () => {
    test_getNewFieldValue("bool", "blah", null)()
    test_getNewFieldValue("bool", 111, null)()
  })

  it("number should parse value in getInitialValue if function not recognised", () => {
    test_getNewFieldValue("number", "1", 1)()
    test_getNewFieldValue("number", "45", 45)()
    test_getNewFieldValue("number", "4.11", 4.11)()
  })

  it("number should return null if function not recognised and value cannot be parsed", () => {
    test_getNewFieldValue("number", "blah", null)()
    test_getNewFieldValue("number", true, null)()
  })

  it("string should parse value in getInitialValue if function not recognised", () => {
    test_getNewFieldValue("string", "hello there", "hello there")()
    test_getNewFieldValue("string", 45, "45")()
    test_getNewFieldValue("string", true, "true")()
  })

  it("array should return empty array when function not recognised", () => {
    test_getNewFieldValue("array<string>", "blah", [])()
    test_getNewFieldValue("array<bool>", true, [])()
    test_getNewFieldValue("array<number>", 1, [])()
    test_getNewFieldValue("array<datetime>", "", [])()
    test_getNewFieldValue("array<reference>", "", [])()
    test_getNewFieldValue("array<file>", "", [])()
  })

  it("reference should {key:''} when function not recognised", () => {
    test_getNewFieldValue("reference", "blah", nothingReference)()
  })

  it("file should return {relativePath:'',size:0} when function not recognised", () => {
    test_getNewFieldValue("file", "blah", nothingFile)()
  })
})

describe("types > getSafeFieldValue", () => {
  const test_getSafeFieldValue = (type, member, value, expectedParse) => () => {
    const field = getField(type)
    field.getDefaultValue = "default"
    field.name = member
    const record = {}
    if (isDefined(value)) record[member] = value
    const parsedvalue = safeParseField(field, record)
    expect(parsedvalue).toEqual(expectedParse)
  }

  it(
    "should get default field value when member is undefined on record",
    test_getSafeFieldValue("string", "forename", undefined, null)
  )

  it("should return null as null (except array and reference)", () => {
    test_getSafeFieldValue("string", "forename", null, null)()
    test_getSafeFieldValue("bool", "isalive", null, null)()
    test_getSafeFieldValue("datetime", "created", null, null)()
    test_getSafeFieldValue("number", "age", null, null)()
    test_getSafeFieldValue("array<string>", "tags", null, [])()
    test_getSafeFieldValue("reference", "moretags", null, nothingReference)()
    test_getSafeFieldValue("file", "moretags", null, nothingFile)()
  })

  it("bool should parse a defined set of true/false aliases", () => {
    test_getSafeFieldValue("bool", "isalive", true, true)()
    test_getSafeFieldValue("bool", "isalive", "true", true)()
    test_getSafeFieldValue("bool", "isalive", "on", true)()
    test_getSafeFieldValue("bool", "isalive", "1", true)()
    test_getSafeFieldValue("bool", "isalive", "yes", true)()
    test_getSafeFieldValue("bool", "isalive", false, false)()
    test_getSafeFieldValue("bool", "isalive", "false", false)()
    test_getSafeFieldValue("bool", "isalive", "off", false)()
    test_getSafeFieldValue("bool", "isalive", "0", false)()
    test_getSafeFieldValue("bool", "isalive", "no", false)()
  })

  it(
    "bool should parse invalid values as null",
    test_getSafeFieldValue("bool", "isalive", "blah", null)
  )

  it("number should parse numbers and strings that are numbers", () => {
    test_getSafeFieldValue("number", "age", 204, 204)()
    test_getSafeFieldValue("number", "age", "1", 1)()
    test_getSafeFieldValue("number", "age", "45", 45)()
    test_getSafeFieldValue("number", "age", "4.11", 4.11)()
  })

  it(
    "number should parse invalid values as null",
    test_getSafeFieldValue("number", "age", "blah", null)
  )

  it(
    "string should parse strings",
    test_getSafeFieldValue("string", "forename", "bob", "bob")
  )

  it("string should parse any other basic type", () => {
    test_getSafeFieldValue("string", "forename", true, "true")()
    test_getSafeFieldValue("string", "forename", 1, "1")()
  })

  it("date should parse dates in various precisions", () => {
    // dont forget that JS Date's month is zero based
    test_getSafeFieldValue(
      "datetime",
      "createddate",
      "2018-02-14",
      new Date(2018, 1, 14)
    )()
    test_getSafeFieldValue(
      "datetime",
      "createddate",
      "2018-2-14",
      new Date(2018, 1, 14)
    )()
    test_getSafeFieldValue(
      "datetime",
      "createddate",
      "2018-02-14 11:00:00.000",
      new Date(2018, 1, 14, 11)
    )()
    test_getSafeFieldValue(
      "datetime",
      "createddate",
      "2018-02-14 11:30",
      new Date(2018, 1, 14, 11, 30)
    )()
  })

  it("date should parse invalid dates as null", () => {
    // dont forget that JS Date's month is zero based
    test_getSafeFieldValue("datetime", "createddate", "2018-13-14", null)()
    test_getSafeFieldValue("datetime", "createddate", "2018-2-33", null)()
    test_getSafeFieldValue("datetime", "createddate", "bla", null)()
  })

  it("array should parse array", () => {
    test_getSafeFieldValue(
      "array<string>",
      "tags",
      ["bob", "the", "dog"],
      ["bob", "the", "dog"]
    )()
    test_getSafeFieldValue(
      "array<bool>",
      "tags",
      [true, false],
      [true, false]
    )()
    test_getSafeFieldValue(
      "array<number>",
      "tags",
      [1, 2, 3, 4],
      [1, 2, 3, 4]
    )()
    test_getSafeFieldValue(
      "array<reference>",
      "tags",
      [{ key: "/customer/1234", value: "bob" }],
      [{ key: "/customer/1234", value: "bob" }]
    )()
  })

  it("array should convert the generic's child type", () => {
    test_getSafeFieldValue("array<string>", "tags", [1, true], ["1", "true"])()
    test_getSafeFieldValue(
      "array<bool>",
      "tags",
      ["yes", "true", "no", "false", true, false],
      [true, true, false, false, true, false]
    )()
    test_getSafeFieldValue("array<number>", "tags", ["1", 23], [1, 23])()
  })

  it("reference should parse reference", () => {
    test_getSafeFieldValue(
      "reference",
      "customer",
      { key: "/customer/1234", value: "bob" },
      { key: "/customer/1234", value: "bob" }
    )()
  })

  it("reference should parse reference", () => {
    test_getSafeFieldValue(
      "file",
      "profilepic",
      { relativePath: "path/to/pic.jpg", size: 120 },
      { relativePath: "path/to/pic.jpg", size: 120 }
    )()
  })
})
