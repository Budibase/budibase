import {
  AutoFieldDefaultNames,
  AutoFieldSubTypes,
  FieldTypes,
  FormulaTypes,
} from "../../constants"
import { processStringSync } from "@budibase/string-templates"
import {
  AutoColumnFieldMetadata,
  FieldSchema,
  Row,
  Table,
} from "@budibase/types"
import tracer from "dd-trace"

interface FormulaOpts {
  dynamic?: boolean
  contextRows?: Row[]
}

/**
 * If the subtype has been lost for any reason this works out what
 * subtype the auto column should be.
 */
export function fixAutoColumnSubType(
  column: FieldSchema
): AutoColumnFieldMetadata | FieldSchema {
  if (!column.autocolumn || !column.name || column.subtype) {
    return column
  }
  // the columns which get auto generated
  if (column.name.endsWith(AutoFieldDefaultNames.CREATED_BY)) {
    column.subtype = AutoFieldSubTypes.CREATED_BY
  } else if (column.name.endsWith(AutoFieldDefaultNames.UPDATED_BY)) {
    column.subtype = AutoFieldSubTypes.UPDATED_BY
  } else if (column.name.endsWith(AutoFieldDefaultNames.CREATED_AT)) {
    column.subtype = AutoFieldSubTypes.CREATED_AT
  } else if (column.name.endsWith(AutoFieldDefaultNames.UPDATED_AT)) {
    column.subtype = AutoFieldSubTypes.UPDATED_AT
  } else if (column.name.endsWith(AutoFieldDefaultNames.AUTO_ID)) {
    column.subtype = AutoFieldSubTypes.AUTO_ID
  }
  return column
}

/**
 * Looks through the rows provided and finds formulas - which it then processes.
 */
export function processFormulas<T extends Row | Row[]>(
  table: Table,
  inputRows: T,
  { dynamic, contextRows }: FormulaOpts = { dynamic: true }
): T {
  return tracer.trace("processFormulas", {}, span => {
    span?.addTags({ tableId: table._id })
    const rows = Array.isArray(inputRows) ? inputRows : [inputRows]
    if (rows) {
      for (let [column, schema] of Object.entries(table.schema)) {
        if (schema.type !== FieldTypes.FORMULA) {
          continue
        }

        const isStatic = schema.formulaType === FormulaTypes.STATIC

        if (
          schema.formula == null ||
          (dynamic && isStatic) ||
          (!dynamic && !isStatic)
        ) {
          continue
        }
        // iterate through rows and process formula
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          let context = contextRows ? contextRows[i] : row
          let formula = schema.formula
          rows[i] = {
            ...row,
            [column]: tracer.trace("processStringSync", {}, span => {
              span?.addTags({ column })
              return processStringSync(formula, context)
            }),
          }
        }
      }
    }
    return Array.isArray(inputRows) ? rows : rows[0]
  })
}

/**
 * Processes any date columns and ensures that those without the ignoreTimezones
 * flag set are parsed as UTC rather than local time.
 */
export function processDates<T extends Row | Row[]>(
  table: Table,
  inputRows: T
): T {
  let rows = Array.isArray(inputRows) ? inputRows : [inputRows]
  let datesWithTZ: string[] = []
  for (let [column, schema] of Object.entries(table.schema)) {
    if (schema.type !== FieldTypes.DATETIME) {
      continue
    }
    if (!schema.timeOnly && !schema.ignoreTimezones) {
      datesWithTZ.push(column)
    }
  }

  for (let row of rows) {
    for (let col of datesWithTZ) {
      if (row[col] && typeof row[col] === "string" && !row[col].endsWith("Z")) {
        row[col] = new Date(row[col]).toISOString()
      }
    }
  }

  return Array.isArray(inputRows) ? rows : rows[0]
}
