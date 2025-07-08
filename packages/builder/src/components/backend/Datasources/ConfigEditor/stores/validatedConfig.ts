import { derived, writable, get } from "svelte/store"
import { getValidatorFields } from "./validation"
import { capitalise } from "@/helpers"
import { notifications } from "@budibase/bbui"
import { object } from "yup"
import { DatasourceFieldType, UIIntegration } from "@budibase/types"
import { processStringSync } from "@budibase/string-templates"

interface ValidatedConfigItem {
  key: string
  value: any
  error: string | null
  name: string
  placeholder: string | undefined
  type: DatasourceFieldType
  config: any | undefined
}

interface ValidatedConfigStore {
  validatedConfig: ValidatedConfigItem[]
  config: Record<string, unknown>
  errors: Record<string, string>
  preventSubmit: boolean
}

export const createValidatedConfigStore = (
  integration: UIIntegration,
  config: Record<string, any>
) => {
  const configStore = writable(config)

  const allValidators = getValidatorFields(integration)
  const selectedValidatorsStore = writable<typeof allValidators>({})
  const errorsStore = writable<Record<string, string>>({})

  const validate = async () => {
    try {
      const $selectedValidatorsStore = get(selectedValidatorsStore)
      const { validatedConfig } = get(combined)

      const validatorsToApply = validatedConfig.reduce(
        (result, { key, type }) => {
          if (type === DatasourceFieldType.FIELD_GROUP) {
            const groupFields = Object.entries($selectedValidatorsStore)
              .filter(([fieldKey]) => fieldKey.startsWith(`${key}.`))
              .reduce(
                (acc, [validatorKey, validator]) => {
                  acc[validatorKey.split(".")[1]] = validator

                  return acc
                },
                {} as typeof $selectedValidatorsStore
              )
            result[key] = object(groupFields)
          } else if ($selectedValidatorsStore[key]) {
            result[key] = $selectedValidatorsStore[key]
          }
          return result
        },
        {} as typeof allValidators
      )
      await object()
        .shape(validatorsToApply)
        .validate(get(configStore), { abortEarly: false })

      errorsStore.set({})

      return true
    } catch (error: any) {
      // Yup error
      if (error.inner) {
        const errors: Record<string, string> = {}

        const inner: { path: string; message: string }[] = error.inner
        inner.forEach(innerError => {
          errors[innerError.path] = capitalise(innerError.message)
        })

        errorsStore.set(errors)
      } else {
        // Non-yup error
        notifications.error("Unexpected validation error")
      }

      return false
    }
  }

  const updateFieldValue = (key: string, value: any[]) => {
    configStore.update($configStore => {
      const newStore = { ...$configStore }

      if (integration.datasource?.[key]?.type === "fieldGroup") {
        value.forEach(field => {
          newStore[field.key] = field.value
        })
        if (
          !("config" in integration.datasource[key]) ||
          !integration.datasource[key].config?.nestedFields
        ) {
          value.forEach(field => {
            newStore[field.key] = field.value
          })
        } else {
          newStore[key] = value.reduce(
            (p, field) => ({
              ...p,
              [field.key]: field.value,
            }),
            {}
          )
        }
      } else {
        newStore[key] = value
      }

      return newStore
    })
    validate()
  }

  const markAllFieldsActive = () => {
    selectedValidatorsStore.set(allValidators)
    validate()
  }

  const markFieldActive = (key: string) => {
    selectedValidatorsStore.update($validatorsStore => ({
      ...$validatorsStore,
      [key]: allValidators[key],
    }))
    validate()
  }

  const combined = derived(
    [configStore, errorsStore, selectedValidatorsStore],
    ([
      $configStore,
      $errorsStore,
      $selectedValidatorsStore,
    ]): ValidatedConfigStore => {
      const validatedConfig: ValidatedConfigItem[] = []

      const allowedRestKeys = ["rejectUnauthorized", "downloadImages"]
      Object.entries(integration.datasource || {}).forEach(
        ([key, properties]) => {
          if (integration.name === "REST" && !allowedRestKeys.includes(key)) {
            return
          }

          const getValue = () => {
            if (properties.type === "fieldGroup") {
              return Object.entries(properties.fields || {}).map(
                ([fieldKey, fieldProperties]) => {
                  return {
                    key: fieldKey,
                    value: $configStore[fieldKey],
                    error: $errorsStore[`${key}.${fieldKey}`],
                    name: capitalise(fieldProperties.display || fieldKey),
                    type: fieldProperties.type,
                  }
                }
              )
            }

            return $configStore[key]
          }

          if (
            !properties.hidden ||
            !eval(processStringSync(properties.hidden, $configStore))
          ) {
            validatedConfig.push({
              key,
              value: getValue(),
              error: $errorsStore[key],
              name: capitalise(properties.display || key),
              placeholder: properties.placeholder,
              type: properties.type,
              config: (properties as any).config,
            })
          }
        }
      )

      const allFieldsActive =
        Object.keys($selectedValidatorsStore).length ===
        Object.keys(allValidators).length

      const hasErrors = Object.keys($errorsStore).length > 0

      return {
        validatedConfig,
        config: $configStore,
        errors: $errorsStore,
        preventSubmit: allFieldsActive && hasErrors,
      }
    }
  )

  return {
    subscribe: combined.subscribe,
    updateFieldValue,
    markAllFieldsActive,
    markFieldActive,
    validate,
  }
}
