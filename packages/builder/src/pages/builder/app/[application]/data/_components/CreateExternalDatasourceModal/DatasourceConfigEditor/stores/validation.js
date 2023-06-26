import { capitalise } from "helpers"
import { object, string, number } from "yup"
import { derived, writable, get } from "svelte/store"
import { notifications } from "@budibase/bbui"

const propertyValidator = type => {
  if (type === "number") {
    return number().nullable()
  }

  if (type === "email") {
    return string().email().nullable()
  }

  return string().nullable()
}

const getValidatorFields = integration => {
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

export const createValidationStore = integration => {
  const allValidators = getValidatorFields(integration)
  const selectedValidatorsStore = writable({})
  const errorsStore = writable({})

  const markAllFieldsActive = () => {
    selectedValidatorsStore.set(allValidators)
  }

  const markFieldActive = key => {
    selectedValidatorsStore.update($validatorsStore => ({
      ...$validatorsStore,
      [key]: allValidators[key],
    }))
  }

  const validate = async config => {
    try {
      await object()
        .shape(get(selectedValidatorsStore))
        .validate(config, { abortEarly: false })

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

  const combined = derived(
    [errorsStore, selectedValidatorsStore],
    ([$errorsStore, $selectedValidatorsStore]) => {
      return {
        errors: $errorsStore,
        invalid: Object.keys($errorsStore).length > 0,
        allFieldsActive:
          Object.keys($selectedValidatorsStore).length ===
          Object.keys(allValidators).length,
      }
    }
  )

  return {
    subscribe: combined.subscribe,
    markAllFieldsActive,
    markFieldActive,
    validate,
  }
}
