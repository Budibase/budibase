export const getOptions = (
  optionsSource,
  fieldSchema,
  dataProvider,
  labelColumn,
  valueColumn,
  customOptions
) => {
  const isArray = fieldSchema?.type === "array"
  // Take options from schema
  if (optionsSource == null || optionsSource === "schema") {
    return fieldSchema?.constraints?.inclusion ?? []
  }

  if (optionsSource === "provider" && isArray) {
    let optionsSet = {}

    dataProvider?.rows?.forEach(row => {
      const value = row?.[valueColumn]
      if (value != null) {
        const label = row[labelColumn] || value
        optionsSet[value] = { value, label }
      }
    })
    return Object.values(optionsSet)
  }

  // Extract options from data provider
  if (optionsSource === "provider" && valueColumn) {
    let optionsSet = {}
    dataProvider?.rows?.forEach(row => {
      const value = row?.[valueColumn]
      if (value != null) {
        const label = row[labelColumn] || value
        optionsSet[value] = { value, label }
      }
    })
    return Object.values(optionsSet)
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
