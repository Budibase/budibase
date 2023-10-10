import { FieldSubtype } from "@budibase/types"
import { FieldTypes } from "../constants"
import { ValidColumnNameRegex, utils } from "@budibase/shared-core"
import { db } from "@budibase/backend-core"
import { parseCsvExport } from "../api/controllers/view/exporters"

interface SchemaColumn {
  readonly name: string
  readonly type: FieldTypes
  readonly subtype: FieldSubtype
  readonly autocolumn?: boolean
  readonly constraints?: {
    presence: boolean
  }
}

interface Schema {
  readonly [index: string]: SchemaColumn
}

interface Row {
  [index: string]: any
}

type Rows = Array<Row>

interface SchemaValidation {
  [index: string]: boolean
}

interface ValidationResults {
  schemaValidation: SchemaValidation
  allValid: boolean
  invalidColumns: Array<string>
  errors: Record<string, string>
}

const PARSERS: any = {
  [FieldTypes.NUMBER]: (attribute?: string) => {
    if (!attribute) {
      return attribute
    }
    return Number(attribute)
  },
  [FieldTypes.DATETIME]: (attribute?: string) => {
    if (!attribute) {
      return attribute
    }
    return new Date(attribute).toISOString()
  },
}

export function isSchema(schema: any): schema is Schema {
  return (
    typeof schema === "object" &&
    Object.values(schema).every(rawColumn => {
      const column = rawColumn as SchemaColumn

      return (
        column !== null &&
        typeof column === "object" &&
        typeof column.type === "string" &&
        Object.values(FieldTypes).includes(column.type as FieldTypes)
      )
    })
  )
}

export function isRows(rows: any): rows is Rows {
  return Array.isArray(rows) && rows.every(row => typeof row === "object")
}

export function validate(rows: Rows, schema: Schema): ValidationResults {
  const results: ValidationResults = {
    schemaValidation: {},
    allValid: false,
    invalidColumns: [],
    errors: {},
  }

  rows.forEach(row => {
    Object.entries(row).forEach(([columnName, columnData]) => {
      const columnType = schema[columnName]?.type
      const columnSubtype = schema[columnName]?.subtype
      const isAutoColumn = schema[columnName]?.autocolumn

      // If the column had an invalid value we don't want to override it
      if (results.schemaValidation[columnName] === false) {
        return
      }

      // If the columnType is not a string, then it's not present in the schema, and should be added to the invalid columns array
      if (typeof columnType !== "string") {
        results.invalidColumns.push(columnName)
      } else if (!columnName.match(ValidColumnNameRegex)) {
        // Check for special characters in column names
        results.schemaValidation[columnName] = false
        results.errors[columnName] =
          "Column names can't contain special characters"
      } else if (
        columnData == null &&
        !schema[columnName].constraints?.presence
      ) {
        results.schemaValidation[columnName] = true
      } else if (
        // If there's no data for this field don't bother with further checks
        // If the field is already marked as invalid there's no need for further checks
        results.schemaValidation[columnName] === false ||
        columnData == null ||
        isAutoColumn
      ) {
        return
      } else if (
        columnType === FieldTypes.NUMBER &&
        isNaN(Number(columnData))
      ) {
        // If provided must be a valid number
        results.schemaValidation[columnName] = false
      } else if (
        // If provided must be a valid date
        columnType === FieldTypes.DATETIME &&
        isNaN(new Date(columnData).getTime())
      ) {
        results.schemaValidation[columnName] = false
      } else if (
        columnType === FieldTypes.BB_REFERENCE &&
        !isValidBBReference(columnData, columnSubtype)
      ) {
        results.schemaValidation[columnName] = false
      } else {
        results.schemaValidation[columnName] = true
      }
    })
  })

  results.allValid =
    Object.values(results.schemaValidation).length > 0 &&
    Object.values(results.schemaValidation).every(column => column)

  // Select unique values
  results.invalidColumns = [...new Set(results.invalidColumns)]
  return results
}

export function parse(rows: Rows, schema: Schema): Rows {
  return rows.map(row => {
    const parsedRow: Row = {}

    Object.entries(row).forEach(([columnName, columnData]) => {
      if (!(columnName in schema) || schema[columnName]?.autocolumn) {
        // Objects can be present in the row data but not in the schema, so make sure we don't proceed in such a case
        return
      }

      const columnType = schema[columnName].type
      const columnSubtype = schema[columnName].subtype

      if (columnType === FieldTypes.NUMBER) {
        // If provided must be a valid number
        parsedRow[columnName] = columnData ? Number(columnData) : columnData
      } else if (columnType === FieldTypes.DATETIME) {
        // If provided must be a valid date
        parsedRow[columnName] = columnData
          ? new Date(columnData).toISOString()
          : columnData
      } else if (columnType === FieldTypes.BB_REFERENCE) {
        const parsedValues =
          !!columnData && parseCsvExport<{ _id: string }[]>(columnData)
        if (!parsedValues) {
          parsedRow[columnName] = undefined
        } else {
          switch (columnSubtype) {
            case FieldSubtype.USER:
              parsedRow[columnName] = parsedValues[0]?._id
              break
            case FieldSubtype.USERS:
              parsedRow[columnName] = parsedValues.map(u => u._id)
              break
            default:
              utils.unreachable(columnSubtype)
          }
        }
      } else {
        parsedRow[columnName] = columnData
      }
    })

    return parsedRow
  })
}

function isValidBBReference(
  columnData: any,
  columnSubtype: FieldSubtype
): boolean {
  switch (columnSubtype) {
    case FieldSubtype.USER:
    case FieldSubtype.USERS:
      if (typeof columnData !== "string") {
        return false
      }
      const userArray = parseCsvExport<{ _id: string }[]>(columnData)
      if (!Array.isArray(userArray)) {
        return false
      }

      if (columnSubtype === FieldSubtype.USER && userArray.length > 1) {
        return false
      }

      const constainsWrongId = userArray.find(
        user => !db.isGlobalUserID(user._id)
      )
      return !constainsWrongId

    default:
      throw utils.unreachable(columnSubtype)
  }
}
