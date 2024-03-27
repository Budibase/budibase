export const unsupported = Symbol("values-validator-unsupported")
export const partialSupport = Symbol("values-validator-partial-support")
export const supported = Symbol("values-validator-supported")

const validatorMap = {
  chart: (fieldSchema) => {
    if (
      fieldSchema.type === "json" ||
      fieldSchema.type === "array" ||
      fieldSchema.type === "attachment" ||
      fieldSchema.type === "barcodeqr" ||
      fieldSchema.type === "link" ||
      fieldSchema.type === "bb_reference"
    ) {
      return {
        support: unsupported,
        message: "This field cannot be used as a chart value"
      }
    }

    if (fieldSchema.type === "string") {
      return {
        support: partialSupport,
        message: "This field can be used as a chart value, but non-numeric values will not be parsed correctly"
      }
    }

    if (fieldSchema.type === "number") {
      return {
        support: supported,
        message: "This field can be used for chart values"
      }
    }

    return {
      support: partialSupport,
      message: "This field can be used as a chart value, but it may not be parsed correctly"
    }
  }
};
export default validatorMap;

