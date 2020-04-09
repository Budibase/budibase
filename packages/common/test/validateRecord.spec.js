import { testSchema } from "./testSchema.mjs"
import { validateRecord } from "../src/records/validateRecord.mjs"
import { getNewRecord } from "../src/records/getNewRecord.mjs"

describe("validateRecord", () => {
  it("should return errors when any fields do not parse", () => {
    const schema = testSchema()
    const record = getNewRecord(schema, "Contact")

    record.Name = "Ledog"
    record["Is Active"] = "hello"
    record.Created = "not a date"

    const validationResult = validateRecord(schema, record)

    expect(validationResult.isValid).toBe(false)
    expect(validationResult.errors.length).toBe(2)
  })

  it("should return errors when mandatory field is empty", () => {
    const schema = testSchema()
    const record = getNewRecord(schema, "Contact")
    record.Name = ""

    const validationResult = validateRecord(schema, record)

    expect(validationResult.isValid).toBe(false)
    expect(validationResult.errors.length).toBe(1)
  })

  it("should return error when string field is beyond maxLength", () => {
    const schema = testSchema()
    schema.findField("Contact", "Name").typeOptions.maxLength = 5
    const record = getNewRecord(schema, "Contact")
    record.Name = "more than 5 characters"

    const validationResult = validateRecord(schema, record)
    expect(validationResult.isValid).toBe(false)
    expect(validationResult.errors.length).toBe(1)
  })

  it("should return error when number field is > maxValue", () => {
    const schema = testSchema()
    schema.findField("Deal", "Estimated Value").typeOptions.maxValue = 5
    const record = getNewRecord(schema, "Deal")
    record["Estimated Value"] = 10

    const validationResult = validateRecord(schema, record)
    expect(validationResult.isValid).toBe(false)
    expect(validationResult.errors.length).toBe(1)
  })

  it("should return error when number field is < minValue", () => {
    const schema = testSchema()
    schema.findField("Deal", "Estimated Value").typeOptions.minValue = 5
    const record = getNewRecord(schema, "Deal")
    record["Estimated Value"] = 1

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBe(1)
  })

  it("should return error when number has too many decimal places", () => {
    const schema = testSchema()
    schema.findField("Deal", "Estimated Value").typeOptions.decimalPlaces = 2
    const record = getNewRecord(schema, "Deal")
    record["Estimated Value"] = 1.123

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBe(1)
  })

  it("should return error when datetime field is > maxValue", () => {
    const schema = testSchema()
    schema.findField("Contact", "Created").typeOptions.maxValue = new Date(2020, 1, 1)
    const record = getNewRecord(schema, "Contact")
    record.Name = "Bob"
    record.Created = new Date(2020, 1, 2)

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBe(1)
  })

  it("should return error when number field is < minValue", () => {
    const schema = testSchema()
    schema.findField("Contact", "Created").typeOptions.minValue = new Date(2020, 1, 2)
    const record = getNewRecord(schema, "Contact")
    record.Name = "Bob"
    record.Created = new Date(2020, 1, 1)

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBe(1)
  })

  it("should return error when string IS NOT one of declared values, and only declared values are allowed", () => {
    const schema = testSchema()
    schema.findField("Contact", "Status").typeOptions.allowDeclaredValuesOnly = true
    schema.findField("Contact", "Status").typeOptions.values = ["thedog"]
    const record = getNewRecord(schema, "Contact")
    record.Status = "not allowed"
    record.Name = "Bob"

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBe(1)
  })

  it("should not return error when string IS one of declared values, and only declared values are allowed", () => {
    const schema = testSchema()
    schema.findField("Contact", "Status").typeOptions.allowDeclaredValuesOnly = true
    schema.findField("Contact", "Status").typeOptions.values = ["thedog"]
    const record = getNewRecord(schema, "Contact")
    record.Status = "thedog"
    record.Name = "Bob"

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
  })

  it("should not return error when string IS NOT one of declared values, but any values are allowed", () => {
    const schema = testSchema()
    schema.findField("Contact", "Status").typeOptions.allowDeclaredValuesOnly = false
    schema.findField("Contact", "Status").typeOptions.values = ["thedog"]
    const record = getNewRecord(schema, "Contact")
    record.Status = "not one of the values"
    record.Name = "Bob"

    const result = validateRecord(schema, record)
    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
  })
})
