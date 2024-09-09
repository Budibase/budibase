export function enrichSchemaWithRelColumns(schema) {
  if (!schema) {
    return
  }
  const result = Object.keys(schema).reduce((acc, c) => {
    const field = schema[c]
    acc[c] = field

    if (field.visible !== false && field.columns) {
      for (const relColumn of Object.keys(field.columns)) {
        const relField = field.columns[relColumn]
        if (!relField.visible) {
          continue
        }
        const name = `${field.name}.${relColumn}`
        acc[name] = {
          ...relField,
          name,
          related: { field: c, subField: relColumn },
        }
      }
    }
    return acc
  }, {})

  return result
}
