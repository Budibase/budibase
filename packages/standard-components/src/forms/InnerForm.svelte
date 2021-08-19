<script>
  import { setContext, getContext } from "svelte"
  import { derived, get, writable } from "svelte/store"
  import { createValidatorFromConstraints } from "./validation"
  import { generateID } from "../helpers"

  export let dataSource
  export let disabled = false
  export let initialValues
  export let schema
  export let table

  const component = getContext("component")
  const { styleable, Provider, ActionTypes } = getContext("sdk")

  let fields = []
  const currentStep = writable(1)
  const formState = writable({
    values: {},
    errors: {},
    valid: true,
    currentStep: 1,
  })

  // Reactive derived stores to derive form state from field array
  $: values = deriveFieldProperty(fields, f => f.fieldState.value)
  $: errors = deriveFieldProperty(fields, f => f.fieldState.error)
  $: valid = !Object.values($errors).some(error => error != null)

  // Derive which fields belong in which steps
  $: currentStepValid = derived(
    [currentStep, ...fields],
    ([currentStepValue, ...fieldsValue]) => {
      return !fieldsValue
        .filter(f => f.step === currentStepValue)
        .some(f => f.fieldState.error != null)
    }
  )

  // Update form state store from derived stores
  $: {
    formState.set({
      values: $values,
      errors: $errors,
      valid,
      currentStep: $currentStep,
    })
  }

  // Generates a derived store from an array of fields, comprised of a map of
  // extracted values from the field array
  const deriveFieldProperty = (fieldStores, getProp) => {
    return derived(fieldStores, fieldValues => {
      const reducer = (map, field) => ({ ...map, [field.name]: getProp(field) })
      return fieldValues.reduce(reducer, {})
    })
  }

  // Searches the field array for a certain field
  const getField = name => {
    return fields.find(field => get(field).name === name)
  }

  const formApi = {
    registerField: (
      field,
      defaultValue = null,
      fieldDisabled = false,
      validationRules,
      step = 1
    ) => {
      if (!field) {
        return
      }

      // Skip if we've already registered this field
      const existingField = getField(field)
      if (existingField) {
        return existingField
      }

      // Auto columns are always disabled
      const isAutoColumn = !!schema?.[field]?.autocolumn

      // Create validation function based on field schema
      const schemaConstraints = schema?.[field]?.constraints
      const validator = createValidatorFromConstraints(
        schemaConstraints,
        validationRules,
        field,
        table
      )

      // Construct field info
      const fieldInfo = writable({
        name: field,
        step: step || 1,
        fieldState: {
          fieldId: `id-${generateID()}`,
          value: initialValues[field] ?? defaultValue,
          error: null,
          disabled: disabled || fieldDisabled || isAutoColumn,
          defaultValue,
          validator,
        },
        fieldApi: makeFieldApi(field, defaultValue),
        fieldSchema: schema?.[field] ?? {},
      })

      // Add this field
      fields = [...fields, fieldInfo]

      return fieldInfo
    },
    validate: (onlyCurrentStep = false) => {
      // Validate only the current step if required
      if (onlyCurrentStep) {
        const stepFields = fields.filter(f => get(f).step === get(currentStep))
        for (let field of stepFields) {
          if (!get(field).fieldApi.validate()) {
            return false
          }
        }
        return true
      }

      // Otherwise validate all fields
      for (let field of fields) {
        if (!get(field).fieldApi.validate()) {
          return false
        }
      }
      return true
    },
    clear: () => {
      // Clear the form by clearing each individual field
      fields.forEach(field => {
        get(field).fieldApi.clearValue()
      })
    },
    nextStep: () => {
      currentStep.update(step => step + 1)
    },
    prevStep: () => {
      currentStep.update(step => Math.max(1, step - 1))
    },
  }

  // Creates an API for a specific field
  const makeFieldApi = field => {
    // Sets the value for a certain field and invokes validation
    const setValue = (value, skipCheck = false) => {
      const fieldInfo = getField(field)
      const { fieldState } = get(fieldInfo)
      const { validator } = fieldState

      // Skip if the value is the same
      if (!skipCheck && fieldState.value === value) {
        return
      }

      // Update field state
      const error = validator ? validator(value) : null
      fieldInfo.update(state => {
        state.fieldState.value = value
        state.fieldState.error = error
        return state
      })

      return !error
    }

    // Clears the value of a certain field back to the initial value
    const clearValue = () => {
      const fieldInfo = getField(field)
      const { fieldState } = get(fieldInfo)
      const newValue = initialValues[field] ?? fieldState.defaultValue

      // Update field state
      fieldInfo.update(state => {
        state.fieldState.value = newValue
        state.fieldState.error = null
        return state
      })
    }

    // Updates the validator rules for a certain field
    const updateValidation = validationRules => {
      const fieldInfo = getField(field)
      const { fieldState } = get(fieldInfo)
      const { value, error } = fieldState

      // Create new validator
      const schemaConstraints = schema?.[field]?.constraints
      const validator = createValidatorFromConstraints(
        schemaConstraints,
        validationRules,
        field,
        table
      )

      // Update validator
      fieldInfo.update(state => {
        state.fieldState.validator = validator
        return state
      })

      // If there is currently an error, run the validator again in case
      // the error should be cleared by the new validation rules
      if (error) {
        setValue(value, true)
      }
    }

    return {
      setValue,
      clearValue,
      updateValidation,
      validate: () => {
        // Validate the field by force setting the same value again
        const { fieldState } = get(getField(field))
        return setValue(fieldState.value, true)
      },
    }
  }

  // Provide form state and api for full control by children
  setContext("form", {
    formState,
    formApi,

    // Data source is needed by attachment fields to be able to upload files
    // to the correct table ID
    dataSource,
  })

  // Provide form step context so that forms without any step components
  // register their fields to step 1
  setContext("form-step", 1)

  // Action context to pass to children
  const actions = [
    { type: ActionTypes.ValidateForm, callback: formApi.validate },
    { type: ActionTypes.ClearForm, callback: formApi.clear },
    { type: ActionTypes.NextFormStep, callback: formApi.nextStep },
    { type: ActionTypes.PrevFormStep, callback: formApi.prevStep },
  ]
</script>

<Provider
  {actions}
  data={{
    ...$values,
    valid,
    currentStep: $currentStep,
    currentStepValid: $currentStepValid,
  }}
>
  <div use:styleable={$component.styles}>
    <slot />
  </div>
</Provider>
