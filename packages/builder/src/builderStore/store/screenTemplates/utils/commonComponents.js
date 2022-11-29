import { Component } from "./Component"
import { rowListUrl } from "../rowListScreen"
import { getSchemaForDatasource } from "../../../dataBinding"

export function spectrumColor(number) {
  // Acorn throws a parsing error in this file if the word g-l-o-b-a-l is found
  // (without dashes - I can't even type it in a comment).
  // God knows why. It seems to think optional chaining further down the
  // file is invalid if the word g-l-o-b-a-l is found - hence the reason this
  // statement is split into parts.
  return "var(--spectrum-glo" + `bal-color-gray-${number})`
}

export function makeLinkComponent(tableName) {
  return new Component("@budibase/standard-components/link")
    .text(tableName)
    .customProps({
      url: `/${tableName.toLowerCase()}`,
      openInNewTab: false,
      color: spectrumColor(700),
      size: "S",
      align: "left",
    })
}

export function makeMainForm() {
  return new Component("@budibase/standard-components/form")
    .normalStyle({
      width: "600px",
    })
    .instanceName("Form")
}

export function makeBreadcrumbContainer(tableName, text) {
  const link = makeLinkComponent(tableName).instanceName("Back Link")

  const arrowText = new Component("@budibase/standard-components/text")
    .type("none")
    .normalStyle({
      "margin-right": "4px",
      "margin-left": "4px",
    })
    .text(">")
    .instanceName("Arrow")
    .customProps({
      color: spectrumColor(700),
      size: "S",
      align: "left",
    })

  const identifierText = new Component("@budibase/standard-components/text")
    .text(text)
    .instanceName("Identifier")
    .customProps({
      color: spectrumColor(700),
      size: "S",
      align: "left",
    })

  return new Component("@budibase/standard-components/container")
    .customProps({
      gap: "N",
      direction: "row",
      hAlign: "left",
      vAlign: "middle",
      size: "shrink",
    })
    .normalStyle({
      width: "600px",
      "margin-right": "auto",
      "margin-left": "auto",
    })
    .instanceName("Breadcrumbs")
    .addChild(link)
    .addChild(arrowText)
    .addChild(identifierText)
}

export function makeSaveButton(table, formId) {
  return new Component("@budibase/standard-components/button")
    .text("Save")
    .customProps({
      type: "primary",
      size: "M",
      onClick: [
        {
          "##eventHandlerType": "Validate Form",
          parameters: {
            componentId: formId,
          },
        },
        {
          parameters: {
            providerId: formId,
            tableId: table._id,
          },
          "##eventHandlerType": "Save Row",
        },
        {
          parameters: {
            url: rowListUrl(table),
          },
          "##eventHandlerType": "Navigate To",
        },
      ],
    })
    .instanceName("Save Button")
}

export function makeTitleContainer(title) {
  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Title")
    .text(title)
    .customProps({
      size: "M",
      align: "left",
    })

  return new Component("@budibase/standard-components/container")
    .normalStyle({
      "margin-top": "32px",
      "margin-bottom": "32px",
    })
    .customProps({
      direction: "row",
      hAlign: "stretch",
      vAlign: "middle",
      size: "shrink",
      gap: "M",
    })
    .instanceName("Title Container")
    .addChild(heading)
}

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
