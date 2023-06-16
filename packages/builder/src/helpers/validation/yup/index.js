import { capitalise } from "helpers"
import { object, string, number } from "yup"
import { writable, get } from "svelte/store"
import { notifications } from "@budibase/bbui"

export const createValidationStore = () => {
  const DEFAULT = {
    errors: {},
    touched: {},
    valid: false,
  }

  const validator = {}
  const validation = writable(DEFAULT)

  const addValidator = (propertyName, propertyValidator) => {
    if (!propertyValidator || !propertyName) {
      return
    }
    validator[propertyName] = propertyValidator
  }

  const addValidatorType = (propertyName, type, required) => {
    if (!type || !propertyName) {
      return
    }

    let propertyValidator
    switch (type) {
      case "number":
        propertyValidator = number().nullable()
        break
      case "email":
        propertyValidator = string().email().nullable()
        break
      default:
        propertyValidator = string().nullable()
    }

    if (required) {
      propertyValidator = propertyValidator.required()
    }

    validator[propertyName] = propertyValidator
  }

  const check = async values => {
    const obj = object().shape(validator)
    // clear the previous errors
    const properties = Object.keys(validator)
    properties.forEach(property => (get(validation).errors[property] = null))

    let validationError = false
    try {
      await obj.validate(values, { abortEarly: false })
    } catch (error) {
      if (!error.inner) {
        notifications.error("Unexpected validation error", error)
        validationError = true
      } else {
        error.inner.forEach(err => {
          validation.update(store => {
            store.errors[err.path] = capitalise(err.message)
            return store
          })
        })
      }
    }

    let valid
    if (properties.length && !validationError) {
      valid = await obj.isValid(values)
    } else {
      // don't say valid until validators have been loaded
      valid = false
    }

    validation.update(store => {
      store.valid = valid
      return store
    })
  }

  return {
    subscribe: validation.subscribe,
    set: validation.set,
    check,
    addValidator,
    addValidatorType,
  }
}
