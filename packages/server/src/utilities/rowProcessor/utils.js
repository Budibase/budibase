const {
  FieldTypes,
  FormulaTypes,
  AutoFieldDefaultNames,
  AutoFieldSubTypes,
} = require("../../constants")
const { processStringSync } = require("@budibase/string-templates")

/**
 * If the subtype has been lost for any reason this works out what
 * subtype the auto column should be.
 */
exports.fixAutoColumnSubType = column => {
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
exports.processFormulas = (
  table,
  rows,
  { dynamic, contextRows } = { dynamic: true }
) => {
  const single = !Array.isArray(rows)
  if (single) {
    rows = [rows]
    contextRows = contextRows ? [contextRows] : contextRows
  }
  for (let [column, schema] of Object.entries(table.schema)) {
    const isStatic = schema.formulaType === FormulaTypes.STATIC
    if (
      schema.type !== FieldTypes.FORMULA ||
      (dynamic && isStatic) ||
      (!dynamic && !isStatic)
    ) {
      continue
    }
    // iterate through rows and process formula
    for (let i = 0; i < rows.length; i++) {
      if (schema.formula) {
        let row = rows[i]
        let context = contextRows ? contextRows[i] : row
        rows[i] = {
          ...row,
          [column]: processStringSync(schema.formula, context),
        }
      }
    }
  }
  return single ? rows[0] : rows
}

/**
 * Processes any date columns and ensures that those without the ignoreTimezones
 * flag set are parsed as UTC rather than local time.
 */
exports.processDates = (table, rows) => {
  let datesWithTZ = []
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
  return rows
}
