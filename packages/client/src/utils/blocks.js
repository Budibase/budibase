import { makePropSafe as safe } from "@budibase/string-templates"

// Map of data types to component types for search fields inside blocks
const schemaComponentMap = {
  string: "stringfield",
  options: "optionsfield",
  number: "numberfield",
  datetime: "datetimefield",
  boolean: "booleanfield",
  formula: "stringfield",
}

/**
 * Determine data types for search fields and only use those that are valid
 * @param searchColumns the search columns to use
 * @param schema the datasource schema
 */
export const enrichSearchColumns = (searchColumns, schema) => {
  let enrichedColumns = []
  searchColumns?.forEach(column => {
    const schemaType = schema?.[column]?.type
    const componentType = schemaComponentMap[schemaType]
    if (componentType) {
      enrichedColumns.push({
        name: column,
        componentType,
        type: schemaType,
      })
    }
  })
  return enrichedColumns.slice(0, 5)
}

/**
 * Enriches a normal datasource filter with bindings representing the additional
 * search fields configured as part of a searchable block. These bindings are
 * fields inside a form used as part of the block.
 * @param filter the normal data provider filter
 * @param columns the enriched search column structure
 * @param formId the ID of the form containing the search fields
 */
export const enrichFilter = (filter, columns, formId) => {
  let enrichedFilter = [...(filter || [])]
  columns?.forEach(column => {
    const safePath = column.name.split(".").map(safe).join(".")
    const stringType = column.type === "string" || column.type === "formula"
    const dateType = column.type === "datetime"
    const binding = `${safe(formId)}.${safePath}`

    // For dates, use a range of the entire day selected
    if (dateType) {
      enrichedFilter.push({
        field: column.name,
        type: column.type,
        operator: "rangeLow",
        valueType: "Binding",
        value: `{{ ${binding} }}`,
      })
      const format = "YYYY-MM-DDTHH:mm:ss.SSSZ"
      enrichedFilter.push({
        field: column.name,
        type: column.type,
        operator: "rangeHigh",
        valueType: "Binding",
        value: `{{ date (add (date ${binding} "x") 86399999) "${format}" }}`,
      })
    }

    // For other fields, do an exact match
    else {
      enrichedFilter.push({
        field: column.name,
        type: column.type,
        operator: stringType ? "string" : "equal",
        valueType: "Binding",
        value: `{{ ${binding} }}`,
      })
    }
  })
  return enrichedFilter
}
