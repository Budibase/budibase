import { testSchema } from "./testSchema.mjs"
import { isNonEmptyString } from "../src/common"
import { getNewRecord } from "../src/records/getNewRecord.mjs"

describe("getNewRecord", () => {
  it("should get object with generated id and key (full path)", async () => {
    const schema = testSchema()
    const record = getNewRecord(schema, "Contact")

    expect(record._id).toBeDefined()
    expect(isNonEmptyString(record._id)).toBeTruthy()
    expect(record._rev).not.toBeDefined()
    expect(record._modelId).toBe(schema.findModel("Contact").id)
  })

  it("should create object with all declared fields, using default values", async () => {
    const schema = testSchema()
    const contact = getNewRecord(schema, "Contact")

    expect(contact.Name).toBe(null)
    expect(contact.Created).toBe(null)
    expect(contact["Is Active"]).toBe(null)
  })

  it("should create object with all declared fields, and use inital values", async () => {
    const schema = testSchema()
    schema.findField("Contact", "Name").getInitialValue = "Default Name"
    const contact = getNewRecord(schema, "Contact")

    expect(contact.Name).toBe("Default Name")
  })
})
