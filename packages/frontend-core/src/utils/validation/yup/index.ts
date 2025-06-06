import { object, string, number, AnySchema } from "yup"
import { writable, get, type Writable } from "svelte/store"
import { Helpers, notifications } from "@budibase/bbui"

type ValidationState = {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  valid: boolean
}

type ValidatorMap = Record<string, AnySchema>

type AddValidatorTypeOptions = {
  minLength?: number
}

export const createValidationStore = () => {
  const DEFAULT: ValidationState = {
    values: {},
    errors: {},
    touched: {},
    valid: false,
  }

  const validator: ValidatorMap = {}
  const validation: Writable<ValidationState> = writable(DEFAULT)

  const addValidator = (
    propertyName: string,
    propertyValidator: AnySchema | null
  ) => {
    if (!propertyValidator || !propertyName) return
    validator[propertyName] = propertyValidator
  }

  const addValidatorType = (
    propertyName: string,
    type: string,
    required?: boolean,
    options?: AddValidatorTypeOptions
  ) => {
    if (!type || !propertyName) return

    let propertyValidator: AnySchema

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
      propertyValidator = (propertyValidator as any).min(options.minLength)
    }

    validator[propertyName] = propertyValidator
  }

  const observe = async (propertyName: string, value: any) => {
    const { values } = get(validation)
    let fieldIsValid = false

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
        delete store.errors[propertyName]
        return store
      })
      await obj.validateAt(propertyName, { [propertyName]: value })
      fieldIsValid = true
    } catch (error: any) {
      const [fieldError] = error.errors
      if (fieldError) {
        validation.update(store => {
          store.errors[propertyName] = Helpers.capitalise(fieldError)
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

  const check = async (values: Record<string, any>) => {
    const obj = object().shape(validator)
    // clear the previous errors
    const properties = Object.keys(validator)
    properties.forEach(property => {
      delete get(validation).errors[property]
    })

    let validationError = false
    try {
      await obj.validate(values, { abortEarly: false })
    } catch (error: any) {
      if (!error.inner) {
        notifications.error("Unexpected validation error")
        validationError = true
      } else {
        error.inner.forEach((err: any) => {
          validation.update(store => {
            store.errors[err.path] = Helpers.capitalise(err.message)
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

export type ValidationStore = ReturnType<typeof createValidationStore>
