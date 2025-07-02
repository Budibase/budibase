import {
  FieldType,
  RowExportFormat,
  JsonFieldSubType,
  Datasource,
  Table,
  Row,
} from "@budibase/types"
import { datasourceDescribe } from "../../../integrations/tests/utils"
import { tableForDatasource } from "../../../tests/utilities/structures"

const descriptions = datasourceDescribe({ plus: true })

if (descriptions.length) {
  describe.each(descriptions)(
    "$dbName: CSV Export/Import Roundtrip",
    ({ config, dsProvider }) => {
      let datasource: Datasource | undefined

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource
      })

      async function clearTableData(tableId: string) {
        const { rows } = await config.api.row.search(tableId, {})
        await Promise.all(
          rows.map(row => {
            return config.api.row.delete(tableId, { _id: row._id! })
          })
        )
      }

      // Helper function to strip ID fields from import data to avoid primary key conflicts
      function stripIdFields(table: Table, rows: Row[]) {
        return rows.map(row => {
          const cleanRow = { ...row }
          for (const id of table.primary || []) {
            delete cleanRow[id]
          }
          return cleanRow
        })
      }

      describe("Field Type Roundtrip Tests", () => {
        it("should handle string fields", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
              schema: {
                text: { type: FieldType.STRING, name: "text" },
                longform: { type: FieldType.LONGFORM, name: "longform" },
              },
            })
          )

          await config.api.row.save(table._id!, {
            text: "Test string",
            longform:
              "This is a longer text field with\nmultiple lines and special chars: \"quotes\", 'apostrophes', commas,",
          })

          const csvData = await config.api.row.exportRows(
            table._id!,
            {},
            RowExportFormat.CSV
          )

          const importData = await config.api.table.csvToJson({
            csvString: csvData,
          })

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(rows[0].text).toBe("Test string")
          expect(rows[0].longform).toBe(
            "This is a longer text field with\nmultiple lines and special chars: \"quotes\", 'apostrophes', commas,"
          )
        })

        it("should handle number and boolean fields", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
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

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(rows[0].number).toBe(42.5)
          expect(rows[0].boolean).toBe(true)
        })

        it("should handle datetime fields with ignoreTimezones: false", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
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

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.allValid).toBe(true)
          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(testDate).toBe(rows[0].datetime)
        })

        it("should handle datetime fields with ignoreTimezones: true", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
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

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          const expectedDate = new Date(testDate)
          const actualDate = new Date(rows[0].datetime)
          expect(actualDate).toEqual(expectedDate)
        })

        it("should handle date-only fields", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
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

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          // Actually perform the import to verify it works
          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(rows[0].dateOnly).toBe(testDate)
        })

        it("should handle time-only fields", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
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

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          // Actually perform the import to verify it works
          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(rows[0].timeOnly).toBe(testTime)
        })

        it("should handle options and array fields", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
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

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          // Actually perform the import to verify it works
          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(rows[0].options).toBe("Option 2")
          expect(rows[0].array).toEqual(["Item A", "Item C"])
        })

        it("should handle empty and null values", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
              schema: {
                text: { type: FieldType.STRING, name: "text" },
                number: { type: FieldType.NUMBER, name: "number" },
                datetime: { type: FieldType.DATETIME, name: "datetime" },
                boolean: { type: FieldType.BOOLEAN, name: "boolean" },
              },
            })
          )

          await config.api.row.save(table._id!, {
            text: null,
            number: null,
            datetime: null,
            boolean: null,
          })

          const csvData = await config.api.row.exportRows(
            table._id!,
            {},
            RowExportFormat.CSV
          )
          const importData = await config.api.table.csvToJson({
            csvString: csvData,
          })

          const validation = await config.api.table.validateExistingTableImport(
            {
              tableId: table._id!,
              rows: importData,
            }
          )

          expect(validation.errors).toEqual({})

          // Clear existing data to avoid unique constraint violations
          await clearTableData(table._id!)

          // Actually perform the import to verify it works
          const importResult = await config.api.row.bulkImport(table._id!, {
            rows: stripIdFields(table, importData),
            identifierFields: [],
          })

          expect(importResult.message).toContain("Bulk rows created")

          const { rows } = await config.api.row.search(table._id!, {})
          expect(rows[0].text).toBeUndefined()
          expect(rows[0].number).toBeUndefined()
          expect(rows[0].datetime).toBeUndefined()
          expect(rows[0].boolean).toBeUndefined()
        })
      })
    }
  )
}
