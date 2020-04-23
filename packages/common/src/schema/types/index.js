import boolean from "./boolean"
import datetime from "./datetime"
import link from "./link"
import number from "./number"
import select from "./select"
import text from "./text"

const allTypes = {
  boolean,
  datetime,
  link,
  number,
  select,
  text,
}

export function listTypes() {
  return Object.keys(allTypes)
}

export function newField(name, type) {
  const field = allTypes[type].default()
  field.name = name
  field.required = false
  return field
}

export function fieldsToSchema(fields) {
  const required = fields.filter(f => f.required).map(f => f.name)

  return {
    type: "object",
    required,
    properties: fields.reduce((sch, field) => {
      sch[field.name] = allTypes[field.type].toSchema(field)
      return sch
    }, {}),
  }
}

export function schemaToFields(modelSchema) {
  return Object.keys(modelSchema.properties).map(key => {
    const schema = modelSchema.properties[key]
    for (let type in allTypes) {
      if (allTypes[type].isType(schema)) {
        const field = allTypes[type].fromSchema(schema)
        field.required = modelSchema.required.includes(key)
        field.name = key
        return field
      }
    }
  })
}
