import { UIIntegration } from "@budibase/types"
import { string, number, object, type AnySchema } from "yup"

const propertyValidator = (type: string) => {
  if (type === "number") {
    return number().nullable()
  }

  if (type === "email") {
    return string().email().nullable()
  }

  if (type === "object") {
    return object().nullable()
  }

  return string().nullable()
}

export const getValidatorFields = (integration: UIIntegration) => {
  const validatorFields: Record<string, AnySchema> = {}

  Object.entries(integration?.datasource || {}).forEach(([key, properties]) => {
    if (properties.required) {
      validatorFields[key] = propertyValidator(properties.type).required()
    } else {
      validatorFields[key] = propertyValidator(properties.type).notRequired()
    }
  })

  return validatorFields
}
