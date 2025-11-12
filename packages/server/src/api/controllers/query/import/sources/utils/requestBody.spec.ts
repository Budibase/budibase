import {
  BINDING_TOKEN_PREFIX,
  buildKeyValueRequestBody,
  buildRequestBodyFromFormDataParameters,
  generateRequestBodyFromExample,
  generateRequestBodyFromSchema,
  serialiseRequestBody,
  type FormDataParameter,
} from "./requestBody"

const createPlaceholder = (
  key: string,
  type: "string" | "integer" = "string"
) => ({
  toJSON: () => `${BINDING_TOKEN_PREFIX}${type}__${key}__`,
})

describe("generateRequestBodyFromSchema", () => {
  it("creates sanitized bindings and respects the total limit", () => {
    const schema = {
      type: "object",
      properties: {
        "user-name": { type: "string", default: "Jane" },
        "123value": { type: "integer" },
      },
      required: ["user-name"],
    }

    const result = generateRequestBodyFromSchema(schema, "body", {
      totalLimit: 1,
    })

    expect(result).toBeDefined()
    expect(result?.bindings).toEqual({ user_name: "Jane" })

    const serialised = serialiseRequestBody(result?.body)
    expect(serialised).toMatch(/"user-name":\s*"\{\{ user_name \}\}"/)
    expect(serialised).not.toMatch(/123value/)
  })

  it("builds array and nested object values using schema defaults", () => {
    const schema = {
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: { type: "string", enum: ["news", "tech"] },
        },
        details: {
          type: "object",
          required: ["count"],
          properties: {
            count: { type: "integer", default: 3 },
          },
        },
      },
      required: ["tags", "details"],
    }

    const result = generateRequestBodyFromSchema(schema)
    expect(result).toBeDefined()

    expect(result?.bindings).toMatchObject({
      tags: "news",
      details_count: "3",
    })

    const body = result?.body as Record<string, unknown>
    expect(Array.isArray(body.tags)).toBe(true)
    expect(body.tags).toHaveLength(1)
    expect(body.details).toBeDefined()
  })
})

describe("generateRequestBodyFromExample", () => {
  it("creates bindings from primitive examples and deduplicates arrays", () => {
    const example = {
      name: "Alice",
      active: true,
      nested: {
        count: 2,
      },
      tags: [
        {
          label: "primary",
        },
      ],
    }

    const result = generateRequestBodyFromExample(example)
    expect(result).toBeDefined()
    expect(result?.bindings).toMatchObject({
      name: "Alice",
      active: "true",
      nested_count: "2",
      tags_label: "primary",
    })

    const body = result?.body as Record<string, unknown>
    expect(Array.isArray(body.tags)).toBe(true)
    expect(body.tags).toHaveLength(1)
  })
})

describe("serialiseRequestBody", () => {
  it("converts binding placeholders into moustache expressions", () => {
    const schema = {
      type: "object",
      properties: {
        message: { type: "string", example: "hello" },
        attempts: { type: "integer", default: 1 },
      },
      required: ["message", "attempts"],
    }

    const generated = generateRequestBodyFromSchema(schema)
    const serialised = serialiseRequestBody(generated?.body)

    expect(serialised).toMatch(/"message":\s*"\{\{ message \}\}"/)
    expect(serialised).toMatch(/"attempts":\s*\{\{ attempts \}\}/)
  })
})

describe("buildKeyValueRequestBody", () => {
  it("flattens nested objects, arrays and bindings", () => {
    const body = {
      form: {
        field: createPlaceholder("field"),
        attachments: [createPlaceholder("file")],
        notes: "plain",
      },
    }

    const result = buildKeyValueRequestBody(body)
    expect(result).toEqual({
      "form[field]": "{{ field }}",
      "form[attachments][]": "{{ file }}",
      "form[notes]": "plain",
    })
  })

  it("returns undefined for non-objects", () => {
    expect(buildKeyValueRequestBody(undefined)).toBeUndefined()
    expect(buildKeyValueRequestBody("foo")).toBeUndefined()
  })
})

describe("buildRequestBodyFromFormDataParameters", () => {
  it("builds bindings for each form data parameter", () => {
    const params: FormDataParameter[] = [
      { in: "formData", name: "username", type: "string", default: "buddy" },
      { in: "formData", name: "age", type: "integer" },
      { in: "formData", name: "notes" },
    ]

    const result = buildRequestBodyFromFormDataParameters(params)
    expect(result).toBeDefined()
    expect(result?.bindings).toMatchObject({
      username: "buddy",
      age: "0",
      notes: "",
    })
  })

  it("returns undefined for empty parameter lists", () => {
    expect(buildRequestBodyFromFormDataParameters([])).toBeUndefined()
  })
})
