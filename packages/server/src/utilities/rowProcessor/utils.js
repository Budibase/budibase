const { FieldTypes, FormulaTypes } = require("../../constants")
const { processStringSync } = require("@budibase/string-templates")

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
