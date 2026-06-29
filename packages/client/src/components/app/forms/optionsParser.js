/**
 * Retrieves and optionally sorts the options for an Options Picker or
 * Multi-select Picker component.
 *
 * @param {string|null} optionsSource - "schema", "provider", "custom", or null
 * @param {object}      fieldSchema   - Schema for the bound field
 * @param {object}      dataProvider  - Data provider context (rows + schema)
 * @param {string}      labelColumn   - Column name to use as option label
 * @param {string}      valueColumn   - Column name to use as option value
 * @param {Array}       customOptions - Manually defined options
 * @param {string|null} sortOrder     - "ascending", "descending", or null/"none"
 */
export const getOptions = (
  optionsSource,
  fieldSchema,
  dataProvider,
  labelColumn,
  valueColumn,
  customOptions,
  sortOrder
) => {
  // Take options from schema
  if (optionsSource == null || optionsSource === "schema") {
    const schemaOptions = fieldSchema?.constraints?.inclusion ?? []
    return sortOptions(schemaOptions, sortOrder, x => x)
  }

  // Extract options from data provider
  if (optionsSource === "provider" && valueColumn) {
    let valueCache = {}
    let options = []
    dataProvider?.rows?.forEach(row => {
      const value = row?.[valueColumn]
      if (value != null && !valueCache[value]) {
        valueCache[value] = true
        const label = row[labelColumn] || value
        options.push({ value, label })
      }
    })
    return sortOptions(options, sortOrder, x => x.label)
  }

  // Extract custom options
  if (optionsSource === "custom" && customOptions) {
    customOptions.forEach(option => {
      if (typeof option.value === "string") {
        if (option.value.toLowerCase() === "true") {
          option.value = true
        } else if (option.value.toLowerCase() === "false") {
          option.value = false
        }
      }
    })
    return sortOptions(customOptions, sortOrder, x => x.label ?? x.value)
  }

  return []
}

/**
 * Sorts an array of options by their label.
 *
 * @param {Array}    options   - Options array to sort
 * @param {string}   sortOrder - "ascending", "descending", or null/undefined/"none"
 * @param {Function} getLabel  - Accessor that returns the label string for an option
 * @returns {Array} Sorted (or original) options array
 */
const sortOptions = (options, sortOrder, getLabel) => {
  if (!sortOrder || sortOrder === "none" || !options?.length) {
    return options
  }
  const sorted = [...options].sort((a, b) => {
    const la = String(getLabel(a) ?? "").toLowerCase()
    const lb = String(getLabel(b) ?? "").toLowerCase()
    if (la < lb) return -1
    if (la > lb) return 1
    return 0
  })
  return sortOrder === "descending" ? sorted.reverse() : sorted
}
