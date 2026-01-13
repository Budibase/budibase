import { normalizeSchemaForStructuredOutput } from "../structuredOutput"

describe("structuredOutput", () => {
  describe("normalizeSchemaForStructuredOutput", () => {
    describe("basic object handling", () => {
      it("adds additionalProperties: false to object schemas", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.additionalProperties).toBe(false)
      })

      it("makes all properties required when no required array exists", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.required).toEqual(["name", "age"])
      })
    })

    describe("required field handling", () => {
      it("converts required: true boolean on properties to required array format", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string", required: true },
            age: { type: "number", required: true },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.required).toContain("name")
        expect(result.required).toContain("age")
      })

      it("removes required: true from individual property definitions", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string", required: true },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const properties = result.properties as Record<string, unknown>
        const nameProperty = properties.name as Record<string, unknown>

        expect(nameProperty.required).toBeUndefined()
        expect(nameProperty.type).toBe("string")
      })

      it("preserves existing required array and merges with boolean-marked fields", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string", required: true },
            age: { type: "number" },
            email: { type: "string" },
          },
          required: ["email"],
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.required).toContain("name")
        expect(result.required).toContain("email")
        expect(result.required).not.toContain("age")
      })

      it("deduplicates required fields when same field is in array and has boolean", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string", required: true },
          },
          required: ["name"],
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const requiredArray = result.required as string[]

        const nameCount = requiredArray.filter(r => r === "name").length
        expect(nameCount).toBe(1)
      })
    })

    describe("nested structures", () => {
      it("recursively processes nested object schemas", () => {
        const schema = {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                name: { type: "string" },
              },
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const properties = result.properties as Record<string, unknown>
        const userProperty = properties.user as Record<string, unknown>

        expect(userProperty.additionalProperties).toBe(false)
        expect(userProperty.required).toEqual(["name"])
      })

      it("handles deeply nested objects (3+ levels)", () => {
        const schema = {
          type: "object",
          properties: {
            level1: {
              type: "object",
              properties: {
                level2: {
                  type: "object",
                  properties: {
                    level3: {
                      type: "object",
                      properties: {
                        value: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.level1.additionalProperties).toBe(false)
        expect(props.level1.properties.level2.additionalProperties).toBe(false)
        expect(
          props.level1.properties.level2.properties.level3.additionalProperties
        ).toBe(false)
        expect(
          props.level1.properties.level2.properties.level3.required
        ).toEqual(["value"])
      })

      it("processes nested objects with required: true boolean", () => {
        const schema = {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                name: { type: "string", required: true },
                optional: { type: "string" },
              },
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.user.required).toContain("name")
        expect(props.user.required).not.toContain("optional")
        expect(props.user.properties.name.required).toBeUndefined()
      })
    })

    describe("array handling", () => {
      it("processes items schema within array types", () => {
        const schema = {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
              },
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.users.items.additionalProperties).toBe(false)
        expect(props.users.items.required).toEqual(["name"])
      })

      it("wraps top-level array schema in an object with items property", () => {
        const schema = {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.type).toBe("object")
        expect(result.additionalProperties).toBe(false)
        expect(result.required).toEqual(["items"])

        const props = result.properties as Record<string, any>
        expect(props.items.type).toBe("array")
        expect(props.items.items.additionalProperties).toBe(false)
      })
    })

    describe("non-object top-level types", () => {
      it("wraps primitive string type in an object with value property", () => {
        const schema = {
          type: "string",
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.type).toBe("object")
        expect(result.additionalProperties).toBe(false)
        expect(result.required).toEqual(["value"])

        const props = result.properties as Record<string, any>
        expect(props.value.type).toBe("string")
      })

      it("wraps primitive number type in an object with value property", () => {
        const schema = {
          type: "number",
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.type).toBe("object")
        expect(result.required).toEqual(["value"])

        const props = result.properties as Record<string, any>
        expect(props.value.type).toBe("number")
      })

      it("wraps boolean type in an object with value property", () => {
        const schema = {
          type: "boolean",
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.type).toBe("object")
        const props = result.properties as Record<string, any>
        expect(props.value.type).toBe("boolean")
      })
    })

    describe("union types", () => {
      it("processes anyOf schemas recursively", () => {
        const schema = {
          type: "object",
          properties: {
            data: {
              anyOf: [
                {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                  },
                },
                {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                  },
                },
              ],
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.data.anyOf[0].additionalProperties).toBe(false)
        expect(props.data.anyOf[0].required).toEqual(["name"])
        expect(props.data.anyOf[1].additionalProperties).toBe(false)
        expect(props.data.anyOf[1].required).toEqual(["id"])
      })

      it("processes oneOf schemas recursively", () => {
        const schema = {
          type: "object",
          properties: {
            result: {
              oneOf: [
                {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                  },
                },
                {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              ],
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.result.oneOf[0].additionalProperties).toBe(false)
        expect(props.result.oneOf[1].additionalProperties).toBe(false)
      })

      it("processes allOf schemas recursively", () => {
        const schema = {
          type: "object",
          properties: {
            combined: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    base: { type: "string" },
                  },
                },
                {
                  type: "object",
                  properties: {
                    extended: { type: "number" },
                  },
                },
              ],
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.combined.allOf[0].additionalProperties).toBe(false)
        expect(props.combined.allOf[0].required).toEqual(["base"])
        expect(props.combined.allOf[1].additionalProperties).toBe(false)
        expect(props.combined.allOf[1].required).toEqual(["extended"])
      })
    })

    describe("edge cases", () => {
      it("handles object schema with no properties defined", () => {
        const schema = {
          type: "object",
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.type).toBe("object")
        expect(result.additionalProperties).toBe(false)
      })

      it("handles empty object schema", () => {
        const schema = {
          type: "object",
          properties: {},
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.type).toBe("object")
        expect(result.additionalProperties).toBe(false)
        expect(result.properties).toEqual({})
        expect(result.required).toEqual([])
      })

      it("preserves non-schema properties", () => {
        const schema = {
          type: "object",
          properties: {
            name: { type: "string", description: "The user's name" },
          },
          title: "UserSchema",
          description: "A schema for user data",
        }

        const result = normalizeSchemaForStructuredOutput(schema)

        expect(result.title).toBe("UserSchema")
        expect(result.description).toBe("A schema for user data")

        const props = result.properties as Record<string, any>
        expect(props.name.description).toBe("The user's name")
      })

      it("handles mixed nested arrays and objects", () => {
        const schema = {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  addresses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        street: { type: "string" },
                        city: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        }

        const result = normalizeSchemaForStructuredOutput(schema)
        const props = result.properties as Record<string, any>

        expect(props.users.items.additionalProperties).toBe(false)
        expect(
          props.users.items.properties.addresses.items.additionalProperties
        ).toBe(false)
        expect(props.users.items.properties.addresses.items.required).toEqual([
          "street",
          "city",
        ])
      })
    })
  })
})
