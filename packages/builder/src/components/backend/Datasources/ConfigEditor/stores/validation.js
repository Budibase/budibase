import { string, number } from "yup"

const propertyValidator = type => {
  if (type === "number") {
    return number().nullable()
  }

  if (type === "email") {
    return string().email().nullable()
  }

  return string().nullable()
}

export const getValidatorFields = integration => {
  const validatorFields = {}

  Object.entries(integration?.datasource || {}).forEach(([key, properties]) => {
    if (properties.required) {
      validatorFields[key] = propertyValidator(properties.type).required()
    } else {
      validatorFields[key] = propertyValidator(properties.type).notRequired()
    }
  })

  return validatorFields
}
