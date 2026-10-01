import {
  BBReferenceFieldSubType,
  FieldSchema,
  FieldType,
  TableSchema,
} from "@budibase/types"
import { tableForDatasource } from "../../tests/utilities/structures"
import { isRows, isSchema, parse, validate } from "../schema"

const createTable = (schema: TableSchema, primary: string[] = []) =>
  tableForDatasource(undefined, { schema, primary })

describe("isSchema", () => {
  it("identifies valid schemas", () => {
    expect(
      isSchema({
        name: {
          name: "name",
          type: FieldType.STRING,
        },
      })
    ).toBe(true)
    expect(isSchema({})).toBe(true)
  })

  it.each([
    "not a schema",
    { name: null },
    { name: "not a field" },
    { name: { name: "name" } },
    { name: { name: "name", type: "not a field type" } },
  ])("rejects invalid schemas: %p", schema => {
    expect(isSchema(schema)).toBe(false)
  })
})

describe("isRows", () => {
  it("identifies arrays of rows", () => {
    expect(isRows([])).toBe(true)
    expect(isRows([{ name: "Alice" }])).toBe(true)
  })

  it("rejects non-arrays and arrays containing non-objects", () => {
    expect(isRows("not rows" as never)).toBe(false)
    expect(isRows(["not a row" as never])).toBe(false)
  })
})

describe("validate", () => {
  it("returns no validation for empty rows", () => {
    expect(validate([], {}, [])).toEqual({
      allValid: false,
      errors: {},
      invalidColumns: [],
      schemaValidation: {},
    })
  })

  it("validates optional empty values and rejects missing columns", () => {
    const schema: TableSchema = {
      optional: {
        name: "optional",
        type: FieldType.STRING,
      },
    }

    expect(
      validate([{ optional: null }, { missing: "value" }], schema, [])
    ).toEqual({
      allValid: true,
      errors: {},
      invalidColumns: ["missing"],
      schemaValidation: {
        optional: true,
      },
    })
  })

  it("does not mark a required empty value as valid", () => {
    const schema: TableSchema = {
      required: {
        name: "required",
        type: FieldType.STRING,
        constraints: { presence: true },
      },
    }

    expect(validate([{ required: null }], schema, [])).toEqual({
      allValid: false,
      errors: {},
      invalidColumns: [],
      schemaValidation: {},
    })
    expect(validate([{ required: "" }], schema, [])).toEqual({
      allValid: false,
      errors: {},
      invalidColumns: [],
      schemaValidation: { required: false },
    })
  })

  it("rejects protected and invalid column names", () => {
    const schema: TableSchema = {
      protected: {
        name: "protected",
        type: FieldType.STRING,
      },
      "invalid-name": {
        name: "invalid-name",
        type: FieldType.STRING,
      },
    }

    expect(
      validate([{ protected: "value", "invalid-name": "value" }], schema, [
        "PROTECTED",
      ])
    ).toEqual({
      allValid: false,
      errors: {
        protected: "protected is a protected column name",
        "invalid-name": "Column names can't contain special characters",
      },
      invalidColumns: [],
      schemaValidation: {
        protected: false,
        "invalid-name": false,
      },
    })
  })

  it("keeps an invalid value invalid when it appears again", () => {
    const schema: TableSchema = {
      number: {
        name: "number",
        type: FieldType.NUMBER,
      },
    }

    expect(
      validate([{ number: "not a number" }, { number: 10 }], schema, [])
    ).toEqual({
      allValid: false,
      errors: {},
      invalidColumns: [],
      schemaValidation: { number: false },
    })
  })

  it.each([
    [FieldType.NUMBER, "10"],
    [FieldType.DATETIME, "2024-01-02T03:04:05.000Z"],
  ] as const)("accepts valid %s values", (type, value) => {
    const schema: TableSchema = {
      value:
        type === FieldType.NUMBER
          ? { name: "value", type: FieldType.NUMBER }
          : { name: "value", type: FieldType.DATETIME },
    }

    expect(validate([{ value }], schema, [])).toEqual({
      allValid: true,
      errors: {},
      invalidColumns: [],
      schemaValidation: { value: true },
    })
  })

  it("rejects invalid numbers and dates", () => {
    const schema: TableSchema = {
      number: { name: "number", type: FieldType.NUMBER },
      date: { name: "date", type: FieldType.DATETIME },
    }

    expect(
      validate([{ number: "NaN", date: "not a date" }], schema, [])
    ).toEqual({
      allValid: false,
      errors: {},
      invalidColumns: [],
      schemaValidation: {
        number: false,
        date: false,
      },
    })
  })

  it("ignores values for autocolumns", () => {
    const schema: TableSchema = {
      auto: {
        name: "auto",
        type: FieldType.STRING,
        autocolumn: true,
      },
    }

    expect(validate([{ auto: "value" }], schema, [])).toEqual({
      allValid: false,
      errors: {},
      invalidColumns: [],
      schemaValidation: {},
    })
  })

  describe("BB references", () => {
    const validUser = JSON.stringify({ _id: "us_valid" })
    const validUsers = JSON.stringify([
      { _id: "us_valid" },
      { _id: "us_also_valid" },
    ])

    it("validates optional and required single-user values", () => {
      const schema: TableSchema = {
        optional: {
          name: "optional",
          type: FieldType.BB_REFERENCE_SINGLE,
          subtype: BBReferenceFieldSubType.USER,
        },
        required: {
          name: "required",
          type: FieldType.BB_REFERENCE_SINGLE,
          subtype: BBReferenceFieldSubType.USER,
          constraints: { presence: true },
        },
      }

      expect(
        validate([{ optional: "", required: validUser }], schema, [])
      ).toEqual({
        allValid: true,
        errors: {},
        invalidColumns: [],
        schemaValidation: {
          optional: true,
          required: true,
        },
      })
      expect(validate([{ required: "us_stored" }], schema, [])).toEqual({
        allValid: true,
        errors: {},
        invalidColumns: [],
        schemaValidation: { required: true },
      })
      expect(
        validate([{ required: { _id: "us_parsed" } }], schema, [])
      ).toEqual({
        allValid: true,
        errors: {},
        invalidColumns: [],
        schemaValidation: { required: true },
      })
      expect(validate([{ required: "" }], schema, [])).toEqual({
        allValid: false,
        errors: {},
        invalidColumns: [],
        schemaValidation: { required: false },
      })
    })

    it("rejects invalid single-user values", () => {
      const schema: TableSchema = {
        user: {
          name: "user",
          type: FieldType.BB_REFERENCE_SINGLE,
          subtype: BBReferenceFieldSubType.USER,
        },
      }

      expect(validate([{ user: "not a user" }], schema, [])).toEqual({
        allValid: false,
        errors: {},
        invalidColumns: [],
        schemaValidation: { user: false },
      })
    })

    it("validates user arrays and rejects malformed references", () => {
      const schema: TableSchema = {
        users: {
          name: "users",
          type: FieldType.BB_REFERENCE,
          subtype: BBReferenceFieldSubType.USER,
        },
        legacyUsers: {
          name: "legacyUsers",
          type: FieldType.BB_REFERENCE,
          subtype: BBReferenceFieldSubType.USERS,
        },
      }

      expect(
        validate([{ users: validUsers, legacyUsers: validUsers }], schema, [])
      ).toEqual({
        allValid: true,
        errors: {},
        invalidColumns: [],
        schemaValidation: {
          users: true,
          legacyUsers: true,
        },
      })
      expect(
        validate(
          [
            {
              users: JSON.stringify({ _id: "us_not_an_array" }),
              legacyUsers: JSON.stringify([{ _id: "row_not_a_user" }]),
            },
          ],
          schema,
          []
        )
      ).toEqual({
        allValid: false,
        errors: {},
        invalidColumns: [],
        schemaValidation: {
          users: false,
          legacyUsers: false,
        },
      })
    })

    it("rejects unsupported reference subtypes", () => {
      const schema: TableSchema = {
        users: {
          name: "users",
          type: FieldType.BB_REFERENCE,
          subtype: "unsupported" as never,
        },
      }

      expect(validate([{ users: validUsers }], schema, [])).toEqual({
        allValid: false,
        errors: {},
        invalidColumns: [],
        schemaValidation: { users: false },
      })
    })
  })
})

describe("parse", () => {
  it("preserves IDs, drops unknown fields, and skips non-primary autocolumns", () => {
    const table = createTable({
      auto: {
        name: "auto",
        type: FieldType.STRING,
        autocolumn: true,
      },
      value: {
        name: "value",
        type: FieldType.STRING,
      },
    })

    expect(
      parse(
        [
          {
            _id: "ro_table_row",
            auto: "skip",
            value: "keep",
            unknown: "drop",
          },
        ],
        table
      )
    ).toEqual([{ _id: "ro_table_row", value: "keep" }])

    expect(
      parse([{ auto: "keep" }], createTable(table.schema, ["auto"]))
    ).toEqual([{ auto: "keep" }])
  })

  it("coerces numbers and preserves falsy values", () => {
    const table = createTable({
      number: { name: "number", type: FieldType.NUMBER },
    })

    expect(
      parse(
        [{ number: "10" }, { number: 0 }, { number: "" }, { number: null }],
        table
      )
    ).toEqual([{ number: 10 }, { number: 0 }, { number: "" }, { number: null }])
  })

  describe("datetime fields", () => {
    it("parses regular, date-only, timezone-ignored, and empty values", () => {
      const table = createTable({
        regular: { name: "regular", type: FieldType.DATETIME },
        dateOnly: {
          name: "dateOnly",
          type: FieldType.DATETIME,
          dateOnly: true,
        },
        ignoredTimezone: {
          name: "ignoredTimezone",
          type: FieldType.DATETIME,
          ignoreTimezones: true,
        },
        empty: { name: "empty", type: FieldType.DATETIME },
      })
      const values = {
        regular: "2024-01-02T03:04:05.000Z",
        dateOnly: "2024-01-02",
        ignoredTimezone: "2024-01-02T03:04:05.000",
        empty: "",
      }

      expect(parse([values], table)).toEqual([values])
    })

    it("parses valid time-only values", () => {
      const table = createTable({
        time: {
          name: "time",
          type: FieldType.DATETIME,
          timeOnly: true,
        },
      })

      expect(parse([{ time: "12:30:00" }], table)).toEqual([
        { time: "12:30:00" },
      ])
    })

    type InvalidDateCase = [string, FieldSchema, string, string]
    const invalidDateCases: InvalidDateCase[] = [
      [
        "dateOnly",
        { name: "dateOnly", type: FieldType.DATETIME, dateOnly: true },
        "01.02.2024",
        'Invalid format for field "dateOnly": "01.02.2024". Date-only fields must be in the format "YYYY-MM-DD".',
      ],
      [
        "datetime",
        { name: "datetime", type: FieldType.DATETIME },
        "01.02.2024",
        'Invalid format for field "datetime": "01.02.2024". Datetime fields must be in ISO format, e.g. "YYYY-MM-DDTHH:MM:SSZ".',
      ],
      [
        "time",
        { name: "time", type: FieldType.DATETIME, timeOnly: true },
        "3pm",
        'Invalid format for field "time": "3pm". Time-only fields must be in the format "HH:MM:SS".',
      ],
      [
        "ignoredTimezone",
        {
          name: "ignoredTimezone",
          type: FieldType.DATETIME,
          ignoreTimezones: true,
        },
        "2024-01-02T03:04:05Z",
        'Invalid format for field "ignoredTimezone": "2024-01-02T03:04:05Z". Datetime fields with ignoreTimezones must be in ISO format, e.g. "YYYY-MM-DDTHH:MM:SS".',
      ],
    ]

    it.each(invalidDateCases)(
      "rejects invalid %s values",
      (name, field, value, message) => {
        expect(() =>
          parse([{ [name]: value }], createTable({ [name]: field }))
        ).toThrow(message)
      }
    )
  })

  it("parses JSON fields and legacy single-quoted JSON", () => {
    const table = createTable({
      json: { name: "json", type: FieldType.JSON },
      object: { name: "object", type: FieldType.JSON },
    })

    expect(
      parse(
        [
          {
            json: '{"name":"Alice"}',
            object: { name: "already parsed" },
          },
          { json: "{'name':'Legacy'}" },
        ],
        table
      )
    ).toEqual([
      { json: { name: "Alice" }, object: { name: "already parsed" } },
      { json: { name: "Legacy" } },
    ])
  })

  it("parses multiple references from objects and JSON", () => {
    const table = createTable({
      users: {
        name: "users",
        type: FieldType.BB_REFERENCE,
        subtype: BBReferenceFieldSubType.USER,
      },
    })

    expect(
      parse(
        [
          { users: [{ _id: "us_one" }, { _id: "us_two" }] },
          { users: JSON.stringify([{ _id: "us_three" }]) },
          { users: null },
        ],
        table
      )
    ).toEqual([
      { users: ["us_one", "us_two"] },
      { users: ["us_three"] },
      { users: [] },
    ])
  })

  it("parses single references from stored IDs, objects, and JSON", () => {
    const table = createTable({
      user: {
        name: "user",
        type: FieldType.BB_REFERENCE_SINGLE,
        subtype: BBReferenceFieldSubType.USER,
      },
    })

    expect(
      parse(
        [
          { user: "us_stored" },
          { user: { _id: "us_object" } },
          { user: JSON.stringify({ _id: "us_exported" }) },
          { user: null },
        ],
        table
      )
    ).toEqual([
      { user: "us_stored" },
      { user: "us_object" },
      { user: "us_exported" },
      { user: undefined },
    ])
  })

  it("parses attachment fields from JSON", () => {
    const attachment = { key: "file-key", name: "file.txt" }
    const value = JSON.stringify(attachment)
    const table = createTable({
      attachments: { name: "attachments", type: FieldType.ATTACHMENTS },
      attachment: { name: "attachment", type: FieldType.ATTACHMENT_SINGLE },
      signature: { name: "signature", type: FieldType.SIGNATURE_SINGLE },
    })

    expect(
      parse(
        [{ attachments: value, attachment: value, signature: value }],
        table
      )
    ).toEqual([{ attachments: attachment, attachment, signature: attachment }])
  })

  it("throws for invalid JSON exports", () => {
    const table = createTable({
      json: { name: "json", type: FieldType.JSON },
    })

    expect(() => parse([{ json: "not JSON" }], table)).toThrow(
      "Unexpected token"
    )
  })
})
