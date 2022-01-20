const { FieldTypes, FormulaTypes } = require("../../constants")
const { processStringSync } = require("@budibase/string-templates")

/**
 * Looks through the rows provided and finds formulas - which it then processes.
 */
exports.processFormulas = (table, rows, { dynamic } = { dynamic: true }) => {
  const single = !Array.isArray(rows)
  if (single) {
    rows = [rows]
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
    rows = rows.map(row => ({
      ...row,
      [column]: processStringSync(schema.formula, row),
    }))
  }
  return single ? rows[0] : rows
}
