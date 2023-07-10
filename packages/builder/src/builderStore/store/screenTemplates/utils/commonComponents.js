import { Component } from "./Component"
import { getSchemaForDatasource } from "../../../dataBinding"

const fieldTypeToComponentMap = {
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
}

export function makeDatasourceFormComponents(datasource) {
  const { schema } = getSchemaForDatasource(null, datasource, {
    formSchema: true,
  })
  let components = []
  let fields = Object.keys(schema || {})
  fields.forEach(field => {
    const fieldSchema = schema[field]
    // skip autocolumns
    if (fieldSchema.autocolumn || fieldSchema.nestedJSON) {
      return
    }
    const fieldType =
      typeof fieldSchema === "object" ? fieldSchema.type : fieldSchema
    const componentType = fieldTypeToComponentMap[fieldType]
    const fullComponentType = `@budibase/standard-components/${componentType}`
    if (componentType) {
      const component = new Component(fullComponentType)
        .instanceName(field)
        .customProps({
          field,
          label: field,
          placeholder: field,
        })
      if (fieldType === "options") {
        component.customProps({
          placeholder: "Choose an option",
          optionsType: "select",
          optionsSource: "schema",
        })
      } else if (fieldType === "longform") {
        component.customProps({
          format: "auto",
        })
      } else if (fieldType === "array") {
        component.customProps({
          placeholder: "Choose an option",
          optionsSource: "schema",
        })
      } else if (fieldType === "link") {
        let placeholder =
          fieldSchema.relationshipType === "one-to-many"
            ? "Choose an option"
            : "Choose some options"
        component.customProps({ placeholder })
      } else if (fieldType === "boolean") {
        component.customProps({ text: field, label: "" })
      } else if (fieldType === "datetime") {
        component.customProps({
          enableTime: !fieldSchema?.dateOnly,
          timeOnly: fieldSchema?.timeOnly,
          ignoreTimezones: fieldSchema.ignoreTimezones,
        })
      }
      components.push(component)
    }
  })
  return components
}
