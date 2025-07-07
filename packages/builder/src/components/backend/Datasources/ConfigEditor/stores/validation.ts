import {
  DatasourceConfig,
  DatasourceFieldType,
  UIIntegration,
} from "@budibase/types"
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

  function handleFieldValidators(datasourceConfig: DatasourceConfig) {
    Object.entries(datasourceConfig).forEach(([key, properties]) => {
      if (properties.type === DatasourceFieldType.FIELD_GROUP) {
        handleFieldValidators(properties.fields || {})
        return
      }

      if (properties.required) {
        validatorFields[key] = propertyValidator(properties.type).required()
      } else {
        validatorFields[key] = propertyValidator(properties.type).notRequired()
      }
    })
  }

  if (integration?.datasource) {
    handleFieldValidators(integration.datasource)
  }

  return validatorFields
}
