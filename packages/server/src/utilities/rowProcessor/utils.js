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
 * Processes any date fields that have timezone awareness disabled by stripping
 * the timezone suffix.
 */
exports.processDates = (table, rows) => {
  for (let [column, schema] of Object.entries(table.schema)) {
    if (schema.type !== FieldTypes.DATETIME || !schema.disableTimezone) {
      continue
    }
    for (let row of rows) {
      // We only need to convert cases where the dates have been parsed into
      // date objects by knex.
      // Strings used in internal tables are stored as-is, so already won't have
      // a timezone suffix.
      if (row[column] && typeof row[column] === "object") {
        // Strip the timezone suffix from the ISO string so that the date string
        // will be parsed as if it is in the users local timezone
        row[column] = row[column].toISOString().slice(0, -1)
      }
    }
  }
  return rows
}
