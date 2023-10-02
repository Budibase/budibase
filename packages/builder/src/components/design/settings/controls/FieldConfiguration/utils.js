export const convertOldFieldFormat = fields => {
  if (!fields) {
    return []
  }
  const converted = fields.map(field => {
    if (typeof field === "string") {
      // existed but was a string
      return {
        field,
        active: true,
      }
    } else if (typeof field?.active != "boolean") {
      // existed but had no state
      return {
        field: field.name,
        active: true,
      }
    } else {
      return field
    }
  })
  return converted
}

export const getComponentForField = (field, schema) => {
  if (!field || !schema?.[field]) {
    return null
  }
  const type = schema[field].type
  return FieldTypeToComponentMap[type]
}

export const FieldTypeToComponentMap = {
  string: "stringfield",
  number: "numberfield",
  bigint: "bigintfield",
  options: "optionsfield",
  array: "multifieldselect",
  boolean: "booleanfield",
  longform: "longformfield",
  datetime: "datetimefield",
  attachment: "attachmentfield",
  link: "relationshipfield",
  json: "jsonfield",
  barcodeqr: "codescanner",
  bb_reference: "bbreferencefield",
}
