import { makePropSafe as safe } from "@budibase/string-templates"
import { API } from "../api/index.js"

// Map of data types to component types for search fields inside blocks
const schemaComponentMap = {
  string: "stringfield",
  options: "optionsfield",
  number: "numberfield",
  bigint: "bigintfield",
  datetime: "datetimefield",
  boolean: "booleanfield",
  formula: "stringfield",
}

/**
 * Determine data types for search fields and only use those that are valid
 * @param searchColumns the search columns to use
 * @param schema the datasource schema
 */
export const enrichSearchColumns = async (searchColumns, schema) => {
  if (!searchColumns?.length || !schema) {
    return []
  }
  let enrichedColumns = []
  for (let column of searchColumns) {
    let schemaType = schema[column]?.type

    // Check if this is a field in another related table. The only way we can
    // check this is checking for a "." inside the column, then checking if we
    // have a link field named the same as that field prefix.
    if (column.includes(".")) {
      const split = column.split(".")
      const sourceField = split[0]
      const linkField = split.slice(1).join(".")
      const linkSchema = schema[sourceField]
      if (linkSchema?.type === "link") {
        const linkedDef = await API.fetchTableDefinition(linkSchema.tableId)
        schemaType = linkedDef?.schema?.[linkField]?.type
      }
    }

    const componentType = schemaComponentMap[schemaType]
    if (componentType) {
      enrichedColumns.push({
        name: column,
        componentType,
        type: schemaType,
      })
    }
  }
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
      let hbs = `{{ date (add (date ${binding} "x") 86399999) "${format}" }}`
      hbs = `{{#if ${binding} }}${hbs}{{/if}}`
      enrichedFilter.push({
        field: column.name,
        type: column.type,
        operator: "rangeHigh",
        valueType: "Binding",
        value: hbs,
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
