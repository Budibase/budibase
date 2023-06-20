import { capitalise } from "helpers"
import { object, string, number } from "yup"
import { writable, get } from "svelte/store"
import { notifications } from "@budibase/bbui"

export const createValidationStore = () => {
  const DEFAULT = {
    values: {},
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

  const addValidatorType = (propertyName, type, required, options) => {
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
      case "password":
        propertyValidator = string().nullable()
        break
      default:
        propertyValidator = string().nullable()
    }

    if (required) {
      propertyValidator = propertyValidator.required()
    }

    if (options?.minLength) {
      propertyValidator = propertyValidator.min(options.minLength)
    }

    validator[propertyName] = propertyValidator
  }

  const observe = async (propertyName, value) => {
    const values = get(validation).values
    let fieldIsValid
    if (!Object.prototype.hasOwnProperty.call(values, propertyName)) {
      // Initial setup
      values[propertyName] = value
      return
    }

    if (value === values[propertyName]) {
      return
    }

    const obj = object().shape(validator)
    try {
      validation.update(store => {
        store.errors[propertyName] = null
        return store
      })
      await obj.validateAt(propertyName, { [propertyName]: value })
      fieldIsValid = true
    } catch (error) {
      const [fieldError] = error.errors
      if (fieldError) {
        validation.update(store => {
          store.errors[propertyName] = capitalise(fieldError)
          store.valid = false
          return store
        })
      }
    }

    if (fieldIsValid) {
      // Validate the rest of the fields
      try {
        await obj.validate(
          { ...values, [propertyName]: value },
          { abortEarly: false }
        )
        validation.update(store => {
          store.valid = true
          return store
        })
      } catch {
        validation.update(store => {
          store.valid = false
          return store
        })
      }
    }
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
    observe,
  }
}
