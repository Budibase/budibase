import { derived, writable, get } from "svelte/store"
import { getValidatorFields } from "./validation"
import { capitalise } from "helpers"
import { notifications } from "@budibase/bbui"
import { object } from "yup"

export const createValidatedConfigStore = (integration, config) => {
  const configStore = writable(config)
  const allValidators = getValidatorFields(integration)
  const selectedValidatorsStore = writable({})
  const errorsStore = writable({})

  const validate = async () => {
    try {
      await object()
        .shape(get(selectedValidatorsStore))
        .validate(get(configStore), { abortEarly: false })

      errorsStore.set({})

      return true
    } catch (error) {
      // Yup error
      if (error.inner) {
        const errors = {}

        error.inner.forEach(innerError => {
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

  const updateFieldValue = (key, value) => {
    configStore.update($configStore => {
      const newStore = { ...$configStore }

      if (integration.datasource[key].type === "fieldGroup") {
        value.forEach(field => {
          newStore[field.key] = field.value
        })
        if (!integration.datasource[key].config?.nestedFields) {
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

  const markFieldActive = key => {
    selectedValidatorsStore.update($validatorsStore => ({
      ...$validatorsStore,
      [key]: allValidators[key],
    }))
    validate()
  }

  const combined = derived(
    [configStore, errorsStore, selectedValidatorsStore],
    ([$configStore, $errorsStore, $selectedValidatorsStore]) => {
      const validatedConfig = []

      Object.entries(integration.datasource).forEach(([key, properties]) => {
        if (integration.name === "REST" && key !== "rejectUnauthorized") {
          return
        }

        const getValue = () => {
          if (properties.type === "fieldGroup") {
            return Object.entries(properties.fields).map(
              ([fieldKey, fieldProperties]) => {
                return {
                  key: fieldKey,
                  name: capitalise(fieldProperties.display || fieldKey),
                  type: fieldProperties.type,
                  value: $configStore[fieldKey],
                }
              }
            )
          }

          return $configStore[key]
        }

        validatedConfig.push({
          key,
          value: getValue(),
          error: $errorsStore[key],
          name: capitalise(properties.display || key),
          type: properties.type,
          hidden: properties.hidden,
          config: properties.config,
        })
      })

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
