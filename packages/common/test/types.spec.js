import { newField, fieldsToSchema, schemaToFields } from "../src/schema/types"

describe("fields to JSON schema", () => {

   it("should convert text field to string", () => {

    const field = newField("surname", "text")
    const schema = fieldsToSchema([field])

    expect(schema.properties.surname.type).toBe("string")
    expect(schema.properties.surname.format).toBeUndefined()
    expect(schema.properties.surname.default).toBe("")
  })

  it("should add required field", () => {

    const field = newField("surname", "text")
    let schema = fieldsToSchema([field])
    expect(schema.required).toEqual([])

    field.required = true
    schema = fieldsToSchema([field])

    expect(schema.required).toEqual(["surname"])
  })

  it("should convert boolean field to boolean", () => {

    const field = newField("active", "boolean")
    const schema = fieldsToSchema([field])

    expect(schema.properties.active.type).toBe("boolean")
    expect(schema.properties.active.default).toBe(false)
  })

  it("should convert datetime field to formatted string", () => {

    const field = newField("surname", "datetime")
    const schema = fieldsToSchema([field])

    const datetimeCondition = schema.properties.surname.anyOf.find(s => s.type === "string" && s.format === "date-time")
    expect(datetimeCondition).toBeDefined()

    const blankCondition = schema.properties.surname.anyOf.find(s => s.const === "")
    expect(blankCondition).toBeDefined()

    expect(schema.properties.surname.default).toBe("")

  })

  it("should convert link field to object", () => {

    const field = newField("contact", "link")
    field.modelId = "1234"
    field.viewId = "5678"
    const schema = fieldsToSchema([field])

    expect(schema.properties.contact.type).toBe("object")
    expect(schema.properties.contact.required).toEqual(["_id"])
    expect(schema.properties.contact.default).toEqual({ _id: "" })
    expect(schema.properties.contact.properties).toEqual({
      _id: { type: "string" },
      modelId: { const: "1234" },
      viewId: { const: "5678" },
    })
  })

  it("should convert number field to number", () => {

    const field = newField("age", "number")
    field.maximum = 1234
    field.minimum = -5678
    const schema = fieldsToSchema([field])

    expect(schema.properties).toEqual({
      age: { type: "number", maximum: 1234, minimum: -5678}
    })
  })

  it("should convert select to text with enum", () => {

    const field = newField("status", "select")
    field.enum = ["new", "complete"]
    const schema = fieldsToSchema([field])

    expect(schema.properties).toEqual({
      status: { 
        type: "string", 
        enum: ["new", "complete"],
        default: "",
      }
    })
  })
})

describe("JSON Schema to fields", () => {

  it("should convert unformatted string to text", () => {
    const schema = schemaWithProperty("name", 
    { 
      type: "string",
      maxLength: 100,
      minLength: 4,
    })
    const fields = schemaToFields(schema)

    expect(fields).toEqual([
      {
        name: "name",
        type: "text",
        maxLength: 100,
        minLength: 4,
        required: false,
      }
    ])
  })

  it("should convert date-time formatted string to datetime", () => {
    const schema = schemaWithProperty("createdDate", 
    {
      anyOf: [
        { 
          type: "string",
          format: "date-time",
        },
        { const: "" },
      ]
    })
    const fields = schemaToFields(schema)

    expect(fields).toEqual([
      {
        name: "createdDate",
        type: "datetime",
        required: false,
      }
    ])
  })

  it("should convert number to number", () => {
    const schema = schemaWithProperty("age", 
    { 
      type: "number",
      maximum: 100,
      minimum: 3,
    })
    const fields = schemaToFields(schema)

    expect(fields).toEqual([
      {
        name: "age",
        type: "number",
        required: false,
        maximum: 100,
        minimum: 3,
      }
    ])
  })

  it("should convert string with enum to select", () => {
    const schema = schemaWithProperty("status", 
    { 
      type: "string",
      enum: ["new", "complete"]
    })
    const fields = schemaToFields(schema)

    expect(fields).toEqual([
      {
        name: "status",
        type: "select",
        required: false,
        enum: ["new", "complete"],
      }
    ])
  })

  it("should convert boolean to boolean", () => {
    const schema = schemaWithProperty("active", 
    { 
      type: "boolean",
    })
    const fields = schemaToFields(schema)

    expect(fields).toEqual([
      {
        name: "active",
        type: "boolean",
        required: false,
      }
    ])
  })

  it("should convert object with modelId & viewId to link", () => {
    const schema = schemaWithProperty("contact", 
    { 
      type: "object",
      properties: {
        _id: { type: "string" },
        modelId: { const: "1234" },
        viewId: { const: null },
      }
    })
    const fields = schemaToFields(schema)

    expect(fields).toEqual([
      {
        name: "contact",
        type: "link",
        required: false,
        modelId: "1234",
        viewId: null,
      }
    ])
  })

  it("should flag required field", () => {
    const schema = schemaWithProperty("name", 
    { 
      type: "string",
      maxLength: 100,
      minLength: 4,
    })
    schema.required = ["name"]
    const fields = schemaToFields(schema)

    expect(fields[0].required).toBe(true)
  })

  function schemaWithProperty(name, prop) {
    const schema = {
      type: "object",
      properties: {},
      required: [],
    }
    schema.properties[name] = prop
    return schema
  }

})