import { capitalize } from 'lodash';

export const constants = {
  warning: Symbol("values-validator-warning"),
  error: Symbol("values-validator-error"),
  unsupported: Symbol("values-validator-unsupported"),
  partialSupport: Symbol("values-validator-partialSupport"),
  supported: Symbol("values-validator-supported")
}

export const validators = {
  chart: (fieldSchema) => {
    try {
      const response = {
        level: null,
        message: null,
        warnings: [],
        errors: []
      }
      const generalUnsupportedFields = ["array", "attachment", "barcodeqr", "link", "bb_reference"]
      if (generalUnsupportedFields.includes(fieldSchema.type)) {
        response.errors.push('This column can not be used a chart input.')
      }

      if (fieldSchema.type === "json") {
          response.errors.push(`This column can not be used as a chart input, but individual properties of a JSON object can be be used if supported.`)
      }

      if (fieldSchema.type === "string") {

        response.warnings.push(
          "string number warning")
      }
      if (fieldSchema.type === "datetime") {
        response.warnings.push(
          "This column can be used as an input for a chart, but it may be parsed differently depending on which is used.")
      }

      const isRequired = fieldSchema?.constraints?.presence?.allowEmpty === false
      if (!isRequired) {
        response.warnings.push(
          "This column is optional, and some rows may not have a value.")
      }

      if (response.errors.length > 0) {
        response.level = constants.unsupported
        response.message = "This column can not be used as a chart input."
      } else if (response.warnings.length > 0) {
        response.level = constants.partialSupport
        response.message = "This column can be used as a chart input, but certain values may cause issues."
      } else {
        response.level = constants.supported
        response.message = "This column can be used as a chart input."
      }

      return response
    } catch (e) {
      console.log(e)
      return {
        level: constants.partialSupport,
        message: "There was an issue validating this field, it may not be fully supported for use with charts.",
        warnings: [],
        errors: []
      }
    }
  }
};
