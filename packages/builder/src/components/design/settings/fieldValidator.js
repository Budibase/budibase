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
        support: null,
        message: null,
        warnings: [],
        errors: []
      }
      const generalUnsupportedFields = ["array", "attachment", "barcodeqr", "link", "bb_reference"]
      if (generalUnsupportedFields.includes(fieldSchema.type)) {
        response.errors.push(`${fieldSchema.type} columns can not be used as chart inputs.`)
      }

      if (fieldSchema.type === "json") {
          response.errors.push(`JSON columns can not be used as chart inputs, but individual properties of this JSON field can be be used if supported.`)
      }

      if (fieldSchema.type === "string") {
        response.warnings.push(
          "This column can be used as input for a chart, but non-numeric values may cause unexpected behavior.")
      }
      if (fieldSchema.type === "date") {
        response.warnings.push(
          "This column can be used as input for a chart, but it is parsed differently for various charts.")
      }

      const isRequired = fieldSchema?.constraints?.presence?.allowEmpty === false
      if (!isRequired) {
        response.warnings.push(
          "This column is optional, and some rows may not have a value.")
      }

      if (response.errors.length > 0) {
        response.support = constants.unsupported
        response.message = "This column can not be used as a chart input."
      } else if (response.warnings.length > 0) {
        response.support = constants.partialSupport
        response.message = "This column can be used as a chart input, but certain values may cause issues."
      } else {
        response.support = constants.supported
        response.message = "This column can be used as a chart input."
      }

      return response
    } catch (e) {
      console.log(e)
      return {
        support: constants.partialSupport,
        message: "There was an issue validating this field, it may not be fully supported for use with charts.",
        warnings: [],
        errors: []
      }
    }
  }
};
