import { capitalise } from "helpers"
import { object } from "yup"
import { writable, get } from "svelte/store"

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

  const check = async values => {
    const obj = object().shape(validator)
    // clear the previous errors
    const properties = Object.keys(validator)
    properties.forEach(property => (get(validation).errors[property] = null))
    try {
      await obj.validate(values, { abortEarly: false })
    } catch (error) {
      error.inner.forEach(err => {
        validation.update(store => {
          store.errors[err.path] = capitalise(err.message)
          return store
        })
      })
    }

    let valid
    if (properties.length) {
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
  }
}
