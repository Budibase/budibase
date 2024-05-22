import {
  FieldType,
  BBReferenceFieldSubType,
  TableSchema,
  FieldSchema,
  Row,
} from "@budibase/types"
import { ValidColumnNameRegex, utils } from "@budibase/shared-core"
import { db } from "@budibase/backend-core"
import { parseCsvExport } from "../api/controllers/view/exporters"

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

export function isSchema(schema: any): schema is TableSchema {
  return (
    typeof schema === "object" &&
    Object.values<FieldSchema>(schema).every(column => {
      return (
        column !== null &&
        typeof column === "object" &&
        typeof column.type === "string" &&
        Object.values(FieldType).includes(column.type as FieldType)
      )
    })
  )
}

export function isRows(rows: any): rows is Rows {
  return Array.isArray(rows) && rows.every(row => typeof row === "object")
}

export function validate(rows: Rows, schema: TableSchema): ValidationResults {
  const results: ValidationResults = {
    schemaValidation: {},
    allValid: false,
    invalidColumns: [],
    errors: {},
  }

  rows.forEach(row => {
    Object.entries(row).forEach(([columnName, columnData]) => {
      const {
        type: columnType,
        subtype: columnSubtype,
        autocolumn: isAutoColumn,
        constraints,
      } = schema[columnName] || {}

      // If the column had an invalid value we don't want to override it
      if (results.schemaValidation[columnName] === false) {
        return
      }

      const isRequired =
        !!constraints &&
        ((typeof constraints.presence !== "boolean" &&
          !constraints.presence?.allowEmpty) ||
          constraints.presence === true)

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
      } else if (columnType === FieldType.NUMBER && isNaN(Number(columnData))) {
        // If provided must be a valid number
        results.schemaValidation[columnName] = false
      } else if (
        // If provided must be a valid date
        columnType === FieldType.DATETIME &&
        isNaN(new Date(columnData).getTime())
      ) {
        results.schemaValidation[columnName] = false
      } else if (
        (columnType === FieldType.BB_REFERENCE ||
          columnType === FieldType.BB_REFERENCE_SINGLE) &&
        !isValidBBReference(columnData, columnType, columnSubtype, isRequired)
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

export function parse(rows: Rows, schema: TableSchema): Rows {
  return rows.map(row => {
    const parsedRow: Row = {}

    Object.entries(row).forEach(([columnName, columnData]) => {
      if (!(columnName in schema) || schema[columnName]?.autocolumn) {
        // Objects can be present in the row data but not in the schema, so make sure we don't proceed in such a case
        return
      }

      const columnSchema = schema[columnName]
      const { type: columnType } = columnSchema
      if (columnType === FieldType.NUMBER) {
        // If provided must be a valid number
        parsedRow[columnName] = columnData ? Number(columnData) : columnData
      } else if (
        columnType === FieldType.DATETIME &&
        !columnSchema.timeOnly &&
        !columnSchema.dateOnly
      ) {
        // If provided must be a valid date
        parsedRow[columnName] = columnData
          ? new Date(columnData).toISOString()
          : columnData
      } else if (columnType === FieldType.BB_REFERENCE) {
        let parsedValues: { _id: string }[] = columnData || []
        if (columnData) {
          parsedValues = parseCsvExport<{ _id: string }[]>(columnData)
        }

        parsedRow[columnName] = parsedValues?.map(u => u._id)
      } else if (columnType === FieldType.BB_REFERENCE_SINGLE) {
        const parsedValue =
          columnData && parseCsvExport<{ _id: string }>(columnData)
        parsedRow[columnName] = parsedValue?._id
      } else if (
        (columnType === FieldType.ATTACHMENTS ||
          columnType === FieldType.ATTACHMENT_SINGLE ||
          columnType === FieldType.SIGNATURE_SINGLE) &&
        typeof columnData === "string"
      ) {
        parsedRow[columnName] = parseCsvExport(columnData)
      } else {
        parsedRow[columnName] = columnData
      }
    })

    return parsedRow
  })
}

function isValidBBReference(
  data: any,
  type: FieldType.BB_REFERENCE | FieldType.BB_REFERENCE_SINGLE,
  subtype: BBReferenceFieldSubType,
  isRequired: boolean
): boolean {
  if (typeof data !== "string") {
    return false
  }

  if (type === FieldType.BB_REFERENCE_SINGLE) {
    if (!data) {
      return !isRequired
    }
    const user = parseCsvExport<{ _id: string }>(data)
    return db.isGlobalUserID(user._id)
  }

  switch (subtype) {
    case BBReferenceFieldSubType.USER:
    case BBReferenceFieldSubType.USERS: {
      const userArray = parseCsvExport<{ _id: string }[]>(data)
      if (!Array.isArray(userArray)) {
        return false
      }

      const constainsWrongId = userArray.find(
        user => !db.isGlobalUserID(user._id)
      )
      return !constainsWrongId
    }
    default:
      throw utils.unreachable(subtype)
  }
}
