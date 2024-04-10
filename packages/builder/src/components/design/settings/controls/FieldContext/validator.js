import { capitalize } from 'lodash';

export const errors = {
  general: Symbol("values-validator-general"),
  jsonPrimitivesOnly: Symbol("values-validator-json-primitives-only"),
}

export const warnings = {
  stringAsNumber: Symbol("values-validator-string-as-number"),
  chartDatetime: Symbol("values-validator-chart-datetime"),
  notRequired: Symbol("values-validator-not-required"),
}

export const constants = {
  unsupported: Symbol("values-validator-unsupported"),
  partialSupport: Symbol("values-validator-partialSupport"),
  supported: Symbol("values-validator-supported")
}

export const validate = (fieldSchema) => {
  try {
    const response = {
      level: null,
      warnings: [],
      errors: [],
      text: "",
      icon: "",
      iconColor: ""
    }
    const generalUnsupportedFields = ["array", "attachment", "barcodeqr", "link", "bb_reference"]
    if (generalUnsupportedFields.includes(fieldSchema.type)) {
      response.errors.push(errors.general)
    }

    if (fieldSchema.type === "json") {
        response.errors.push(errors.jsonPrimitivesOnly)
    }

    if (fieldSchema.type === "string") {
      response.warnings.push(warnings.stringAsNumber)
    }
    if (fieldSchema.type === "datetime") {
      response.warnings.push(warnings.chartDatetime);
        //"This column can be used as an input for a chart, but it may be parsed differently depending on which is used.
    }

    const isRequired = fieldSchema?.constraints?.presence?.allowEmpty === false
    if (!isRequired) {
      response.warnings.push(warnings.notRequired);
    }

    if (response.errors.length > 0) {
      response.level = constants.unsupported
      response.text = "Not compatible"
      response.icon = "Alert"
      response.iconColor = "var(--red)"
    } else if (response.warnings.length > 0) {
      response.level = constants.partialSupport
      response.text = "Partially compatible"
      response.icon = "AlertCheck"
      response.iconColor = "var(--yellow)"
    } else {
      response.level = constants.supported
      response.text = "Compatible"
      response.icon = "CheckmarkCircle"
      response.iconColor = "var(--green)"
    }

    return response
  } catch (e) {
    return {
      level: constants.partialSupport,
      warnings: [],
      errors: [],
      text: "Partially compatible",
      icon: "AlertCheck",
      iconColor: "var(--yellow)"
    }
  }
}
