import { Component } from "./Component"
import { getSchemaForDatasource } from "../../../dataBinding"
import { _ } from "../../../../../lang/i18n"

const fieldTypeToComponentMap = {
  string: "stringfield",
  number: "numberfield",
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
          placeholder: $_("builderStore.store.screenTemplates.utils.commomComponents.Choose_option"),
          optionsType: "select",
          optionsSource: "schema",
        })
      } else if (fieldType === "longform") {
        component.customProps({
          format: "auto",
        })
      } else if (fieldType === "array") {
        component.customProps({
          placeholder: $_("builderStore.store.screenTemplates.utils.commomComponents.Choose_option"),
          optionsSource: "schema",
        })
      } else if (fieldType === "link") {
        let placeholder =
          fieldSchema.relationshipType === "one-to-many"
            ? $_("builderStore.store.screenTemplates.utils.commomComponents.Choose_option")
            : $_("builderStore.store.screenTemplates.utils.commomComponents.Choose_options")
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
