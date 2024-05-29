export const getOptions = (
  optionsSource,
  fieldSchema,
  dataProvider,
  labelColumn,
  valueColumn,
  customOptions
) => {
  // Take options from schema
  if (optionsSource == null || optionsSource === "schema") {
    return fieldSchema?.constraints?.inclusion ?? []
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
    return options
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
    return customOptions
  }

  return []
}
