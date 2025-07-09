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
  function handleFieldValidators(
    datasourceConfig: DatasourceConfig
  ): Record<string, AnySchema> {
    const result: Record<string, AnySchema> = {}
    Object.entries(datasourceConfig).forEach(([key, properties]) => {
      if (properties.type === DatasourceFieldType.FIELD_GROUP) {
        const fieldGroupValidator = handleFieldValidators(
          properties.fields || {}
        )
        for (const [fieldKey, fieldValidator] of Object.entries(
          fieldGroupValidator
        )) {
          result[`${key}.${fieldKey}`] = fieldValidator
        }
        return
      }

      if (properties.required) {
        result[key] = propertyValidator(properties.type)
          .required()
          .label(properties.display || key)
      } else {
        result[key] = propertyValidator(properties.type)
          .notRequired()
          .label(properties.display || key)
      }
    })

    return result
  }

  const validatorFields = handleFieldValidators(integration.datasource || {})

  return validatorFields
}
