import { FieldType, RowExportFormat, JsonFieldSubType } from "@budibase/types"
import * as setup from "../api/routes/tests/utilities"

const { basicTable } = setup.structures

describe("CSV Export/Import Roundtrip", () => {
  const config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    setup.afterAll()
  })

  describe("Field Type Roundtrip Tests", () => {
    it("should handle string fields", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            text: { type: FieldType.STRING, name: "text" },
            longform: { type: FieldType.LONGFORM, name: "longform" },
          },
        })
      )

      // Insert test data
      await config.api.row.save(table._id!, {
        text: "Test string",
        longform:
          "This is a longer text field with\nmultiple lines and special chars: \"quotes\", 'apostrophes', commas,",
      })

      // Export as CSV
      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )

      // Parse CSV back to JSON for import
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      // Validate that import data can be imported back
      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle number and boolean fields", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            number: { type: FieldType.NUMBER, name: "number" },
            boolean: { type: FieldType.BOOLEAN, name: "boolean" },
          },
        })
      )

      await config.api.row.save(table._id!, {
        number: 42.5,
        boolean: true,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle datetime fields with ignoreTimezones: false", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            datetime: {
              type: FieldType.DATETIME,
              name: "datetime",
              ignoreTimezones: false,
            },
          },
        })
      )

      const testDate = "2023-06-15T10:30:00.000Z"
      await config.api.row.save(table._id!, {
        datetime: testDate,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle datetime fields with ignoreTimezones: true", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            datetime: {
              type: FieldType.DATETIME,
              name: "datetime",
              ignoreTimezones: true,
            },
          },
        })
      )

      const testDate = "2023-06-15T10:30:00.000"
      await config.api.row.save(table._id!, {
        datetime: testDate,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle date-only fields", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            dateOnly: {
              type: FieldType.DATETIME,
              name: "dateOnly",
              dateOnly: true,
            },
          },
        })
      )

      const testDate = "2023-06-15"
      await config.api.row.save(table._id!, {
        dateOnly: testDate,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle time-only fields", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            timeOnly: {
              type: FieldType.DATETIME,
              name: "timeOnly",
              timeOnly: true,
            },
          },
        })
      )

      const testTime = "14:30:00"
      await config.api.row.save(table._id!, {
        timeOnly: testTime,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle options and array fields", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            options: {
              type: FieldType.OPTIONS,
              name: "options",
              constraints: {
                inclusion: ["Option 1", "Option 2", "Option 3"],
              },
            },
            array: {
              type: FieldType.ARRAY,
              name: "array",
              constraints: {
                type: JsonFieldSubType.ARRAY,
                inclusion: ["Item A", "Item B", "Item C"],
              },
            },
          },
        })
      )

      await config.api.row.save(table._id!, {
        options: "Option 2",
        array: ["Item A", "Item C"],
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle JSON fields", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            json: { type: FieldType.JSON, name: "json" },
          },
        })
      )

      const jsonData = {
        nested: {
          value: "test",
          number: 123,
          array: [1, 2, 3],
          special: "chars: \"quotes\", 'apostrophes', commas,",
        },
      }
      await config.api.row.save(table._id!, {
        json: jsonData,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })

    it("should handle empty and null values", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            text: { type: FieldType.STRING, name: "text" },
            number: { type: FieldType.NUMBER, name: "number" },
            datetime: { type: FieldType.DATETIME, name: "datetime" },
            boolean: { type: FieldType.BOOLEAN, name: "boolean" },
          },
        })
      )

      // Insert rows with empty/null values
      await config.api.row.save(table._id!, {
        text: "",
        number: null,
        datetime: null,
        boolean: null,
      })

      await config.api.row.save(table._id!, {
        text: null,
        number: 0,
        datetime: "",
        boolean: false,
      })

      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})
    })
  })

  describe("Employee Table Bug Reproduction", () => {
    it("should reproduce the exact employees table issue from BUDI-9478", async () => {
      // Create a table that matches the employees table structure
      const table = await config.api.table.save(
        basicTable(undefined, {
          name: "Employees",
          schema: {
            "First Name": { type: FieldType.STRING, name: "First Name" },
            "Last Name": { type: FieldType.STRING, name: "Last Name" },
            Email: { type: FieldType.STRING, name: "Email" },
            "Start Date": {
              type: FieldType.DATETIME,
              name: "Start Date",
              ignoreTimezones: false, // This should be the problematic case
            },
            "Created At": {
              type: FieldType.DATETIME,
              name: "Created At",
              ignoreTimezones: false, // This should be the problematic case
            },
            "Employee Level": {
              type: FieldType.ARRAY,
              name: "Employee Level",
              constraints: {
                type: JsonFieldSubType.ARRAY,
                inclusion: [
                  "Junior",
                  "Senior",
                  "Manager",
                  "Contractor",
                  "Apprentice",
                ],
              },
            },
          },
        })
      )

      // Insert data that matches the sample employee data format (dates without Z)
      const employees = [
        {
          "First Name": "Julie",
          "Last Name": "Jimenez",
          Email: "julie.jimenez@example.com",
          "Start Date": "2015-02-12T12:00:00.000", // Note: no Z suffix
          "Created At": "2022-11-10T17:56:18.353", // Note: no Z suffix
          "Employee Level": ["Senior"],
        },
        {
          "First Name": "Mandy",
          "Last Name": "Clark",
          Email: "mandy.clark@example.com",
          "Start Date": "2017-09-10T12:00:00.000",
          "Created At": "2022-11-10T17:56:18.353",
          "Employee Level": ["Senior"],
        },
      ]

      for (const employee of employees) {
        await config.api.row.save(table._id!, employee)
      }

      // Export the data as CSV - this is what a user would do
      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )

      // Parse the CSV back to JSON - this simulates the import process
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      // This validation should pass - the bug was that it fails when ignoreTimezones: false
      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      // This assertion should pass once we fix the bug
      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})

      // Additionally, verify that the actual import works
      const importResult = await config.api.row.bulkImport(table._id!, {
        rows: importData,
        identifierFields: [],
      })

      expect(importResult.message).toContain("Bulk rows created")
    })
  })

  describe("Mixed Field Types Comprehensive Test", () => {
    it("should handle a table with all supported field types in one roundtrip", async () => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          name: "ComprehensiveTable",
          schema: {
            // String types
            text: { type: FieldType.STRING, name: "text" },
            longform: { type: FieldType.LONGFORM, name: "longform" },

            // Number types
            number: { type: FieldType.NUMBER, name: "number" },

            // Date types
            datetimeWithTZ: {
              type: FieldType.DATETIME,
              name: "datetimeWithTZ",
              ignoreTimezones: false,
            },
            datetimeIgnoreTZ: {
              type: FieldType.DATETIME,
              name: "datetimeIgnoreTZ",
              ignoreTimezones: true,
            },
            dateOnly: {
              type: FieldType.DATETIME,
              name: "dateOnly",
              dateOnly: true,
            },
            timeOnly: {
              type: FieldType.DATETIME,
              name: "timeOnly",
              timeOnly: true,
            },

            // Boolean
            boolean: { type: FieldType.BOOLEAN, name: "boolean" },

            // Options and arrays
            options: {
              type: FieldType.OPTIONS,
              name: "options",
              constraints: { inclusion: ["A", "B", "C"] },
            },
            array: {
              type: FieldType.ARRAY,
              name: "array",
              constraints: {
                type: JsonFieldSubType.ARRAY,
                inclusion: ["X", "Y", "Z"],
              },
            },

            // JSON
            json: { type: FieldType.JSON, name: "json" },
          },
        })
      )

      // Insert comprehensive test data
      const testRow = {
        text: "Test string with \"quotes\" and 'apostrophes'",
        longform: "Multi-line\ntext with\nspecial chars: , ; | \t",
        number: 123.456,
        datetimeWithTZ: "2023-06-15T10:30:00.000Z",
        datetimeIgnoreTZ: "2023-06-15T10:30:00.000",
        dateOnly: "2023-06-15",
        timeOnly: "14:30:00",
        boolean: true,
        options: "B",
        array: ["X", "Z"],
        json: {
          nested: {
            string: "value",
            number: 789,
            boolean: false,
            array: [1, "two", true],
          },
        },
      }

      await config.api.row.save(table._id!, testRow)

      // Perform the roundtrip
      const csvData = await config.api.row.exportRows(
        table._id!,
        {},
        RowExportFormat.CSV
      )
      const importData = await config.api.table.csvToJson({
        csvString: csvData,
      })

      const validation = await config.api.table.validateExistingTableImport({
        tableId: table._id!,
        rows: importData,
      })

      expect(validation.allValid).toBe(true)
      expect(validation.errors).toEqual({})

      // Verify the import actually works
      const importResult = await config.api.row.bulkImport(table._id!, {
        rows: importData,
        identifierFields: [],
      })

      expect(importResult.message).toContain("Bulk rows created")
    })
  })
})
