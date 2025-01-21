<script>
  import { setContext, getContext } from "svelte"
  import { derived, get, writable } from "svelte/store"
  import { createValidatorFromConstraints } from "./validation"
  import { Helpers } from "@budibase/bbui"

  export let dataSource
  export let disabled = false
  export let readonly = false
  export let initialValues
  export let size
  export let schema
  export let definition
  export let disableSchemaValidation = false
  export let editAutoColumns = false

  // For internal use only, to disable context when being used with standalone
  // fields
  export let provideContext = true

  // We export this store so that when we remount the inner form we can still
  // persist what step we're on
  export let currentStep

  const component = getContext("component")
  const { styleable, Provider, ActionTypes } = getContext("sdk")

  let fields = []
  const formState = writable({
    values: {},
    errors: {},
    valid: true,
    currentStep: get(currentStep),
  })

  // Reactive derived stores to derive form state from field array
  $: values = deriveFieldProperty(fields, f => f.fieldState.value)
  $: errors = deriveFieldProperty(fields, f => f.fieldState.error)
  $: enrichments = deriveBindingEnrichments(fields)
  $: valid = !Object.values($errors).some(error => error != null)

  // Derive whether the current form step is valid
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

  // Derive value of whole form
  $: formValue = deriveFormValue(initialValues, $values, $enrichments)

  // Create data context to provide
  $: dataContext = {
    ...formValue,

    // These static values are prefixed to avoid clashes with actual columns
    __value: formValue,
    __valid: valid,
    __currentStep: $currentStep,
    __currentStepValid: $currentStepValid,
  }

  // Generates a derived store from an array of fields, comprised of a map of
  // extracted values from the field array
  const deriveFieldProperty = (fieldStores, getProp) => {
    return derived(fieldStores, fieldValues => {
      const reducer = (map, field) => ({ ...map, [field.name]: getProp(field) })
      return fieldValues.reduce(reducer, {})
    })
  }

  // Derives any enrichments which need to be made so that bindings work for
  // special data types like attachments. Relationships are currently not
  // handled as we don't have the primaryDisplay field that is required.
  const deriveBindingEnrichments = fieldStores => {
    return derived(fieldStores, fieldValues => {
      let enrichments = {}
      fieldValues.forEach(field => {
        if (field.type === "attachment") {
          const value = field.fieldState.value
          let url = null
          if (Array.isArray(value) && value[0] != null) {
            url = value[0].url
          }
          enrichments[`${field.name}_first`] = url
        }
      })
      return enrichments
    })
  }

  // Derive the overall form value and deeply set all field paths so that we
  // can support things like JSON fields.
  const deriveFormValue = (initialValues, values, enrichments) => {
    let formValue = Helpers.cloneDeep(initialValues || {})

    // We need to sort the keys to avoid a JSON field overwriting a nested field
    const sortedFields = Object.entries(values || {})
      .map(([key, value]) => {
        const field = getField(key)
        return {
          key,
          value,
          lastUpdate: get(field).fieldState?.lastUpdate || 0,
        }
      })
      .sort((a, b) => {
        return a.lastUpdate > b.lastUpdate
      })

    // Merge all values and enrichments into a single value
    sortedFields.forEach(({ key, value }) => {
      Helpers.deepSet(formValue, key, value)
    })
    Object.entries(enrichments || {}).forEach(([key, value]) => {
      Helpers.deepSet(formValue, key, value)
    })
    return formValue
  }

  // Searches the field array for a certain field
  const getField = name => {
    return fields.find(field => get(field).name === name)
  }

  // Sanitises a value by ensuring it doesn't contain any invalid data
  const sanitiseValue = (value, schema, type) => {
    // Check arrays - remove any values not present in the field schema and
    // convert any values supplied to strings
    if (Array.isArray(value) && type === "array" && schema) {
      const options = schema?.constraints?.inclusion || []
      return value.map(opt => String(opt)).filter(opt => options.includes(opt))
    }
    return value
  }

  const formApi = {
    registerField: (
      field,
      type,
      defaultValue = null,
      fieldDisabled = false,
      fieldReadOnly = false,
      validationRules,
      step = 1
    ) => {
      if (!field) {
        return
      }
      // Create validation function based on field schema
      const schemaConstraints = disableSchemaValidation
        ? null
        : schema?.[field]?.constraints
      const validator = createValidatorFromConstraints(
        schemaConstraints,
        validationRules,
        field,
        definition
      )

      // Sanitise the default value to ensure it doesn't contain invalid data
      defaultValue = sanitiseValue(defaultValue, schema?.[field], type)

      // If we've already registered this field then keep some existing state
      let initialValue = Helpers.deepGet(initialValues, field) ?? defaultValue
      let initialError = null
      let fieldId = `id-${Helpers.uuid()}`
      const existingField = getField(field)
      if (existingField) {
        const { fieldState } = get(existingField)
        fieldId = fieldState.fieldId

        // Determine the initial value for this field, reusing the current
        // value if one exists
        if (fieldState.value != null && fieldState.value !== "") {
          initialValue = fieldState.value
        }

        // If this field has already been registered and we previously had an
        // error set, then re-run the validator to see if we can unset it
        if (fieldState.error) {
          initialError = validator?.(initialValue)
        }
      }

      // Auto columns are always disabled
      const isAutoColumn = !!schema?.[field]?.autocolumn

      // Construct field info
      const fieldInfo = writable({
        name: field,
        type,
        step: step || 1,
        fieldState: {
          fieldId,
          value: initialValue,
          error: initialError,
          disabled:
            disabled || fieldDisabled || (isAutoColumn && !editAutoColumns),
          readonly: readonly || fieldReadOnly || schema?.[field]?.readonly,
          defaultValue,
          validator,
          lastUpdate: Date.now(),
        },
        fieldApi: makeFieldApi(field),
        fieldSchema: schema?.[field] ?? {},
      })

      // Add this field
      if (existingField) {
        const otherFields = fields.filter(info => get(info).name !== field)
        fields = [...otherFields, fieldInfo]
      } else {
        fields = [...fields, fieldInfo]
      }

      return fieldInfo
    },
    validate: () => {
      const stepFields = fields.filter(
        field => get(field).step === get(currentStep)
      )
      // We want to validate every field (even if validation fails early) to
      // ensure that all fields are populated with errors if invalid
      let valid = true
      let hasScrolled = false
      stepFields.forEach(field => {
        const fieldValid = get(field).fieldApi.validate()
        valid = valid && fieldValid
        if (!valid && !hasScrolled) {
          handleScrollToField({ field: get(field) })
          hasScrolled = true
        }
      })

      return valid
    },
    reset: () => {
      // Reset the form by resetting each individual field
      fields.forEach(field => {
        get(field).fieldApi.reset()
      })
    },
    changeStep: ({ type, number }) => {
      if (type === "next") {
        currentStep.update(step => step + 1)
      } else if (type === "prev") {
        currentStep.update(step => Math.max(1, step - 1))
      } else if (type === "first") {
        currentStep.set(1)
      } else if (type === "specific" && number && !isNaN(number)) {
        currentStep.set(parseInt(number))
      }
    },
    setStep: step => {
      if (step) {
        currentStep.set(step)
      }
    },
    setFieldValue: (fieldName, value) => {
      const field = getField(fieldName)
      if (!field) {
        return
      }
      const { fieldApi } = get(field)
      fieldApi.setValue(value)
    },
    resetField: fieldName => {
      const field = getField(fieldName)
      if (!field) {
        return
      }
      const { fieldApi } = get(field)
      fieldApi.reset()
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
        return false
      }

      // Update field state
      const error = validator?.(value)
      fieldInfo.update(state => {
        state.fieldState.value = value
        state.fieldState.error = error
        state.fieldState.lastUpdate = Date.now()
        return state
      })

      return true
    }

    // Clears the value of a certain field back to the default value
    const reset = () => {
      const fieldInfo = getField(field)
      const { fieldState } = get(fieldInfo)
      const newValue = fieldState.defaultValue

      // Update field state
      fieldInfo.update(state => {
        state.fieldState.value = newValue
        state.fieldState.error = null
        state.fieldState.lastUpdate = Date.now()
        return state
      })
    }

    // Updates the validator rules for a certain field
    const updateValidation = validationRules => {
      const fieldInfo = getField(field)
      const { fieldState } = get(fieldInfo)
      const { value, error } = fieldState

      // Create new validator
      const schemaConstraints = disableSchemaValidation
        ? null
        : schema?.[field]?.constraints
      const validator = createValidatorFromConstraints(
        schemaConstraints,
        validationRules,
        field,
        definition
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

    // We don't want to actually remove the field state when deregistering, just
    // remove any errors and validation
    const deregister = () => {
      const fieldInfo = getField(field)
      fieldInfo.update(state => {
        state.fieldState.validator = null
        state.fieldState.error = null
        return state
      })
    }

    // Updates the disabled state of a certain field
    const setDisabled = fieldDisabled => {
      const fieldInfo = getField(field)

      // Auto columns are always disabled
      const isAutoColumn = !!schema?.[field]?.autocolumn

      // Update disabled state
      fieldInfo.update(state => {
        state.fieldState.disabled = disabled || fieldDisabled || isAutoColumn
        return state
      })
    }

    return {
      setValue,
      reset,
      updateValidation,
      setDisabled,
      deregister,
      validate: () => {
        // Validate the field by force setting the same value again
        const fieldInfo = getField(field)
        setValue(get(fieldInfo).fieldState.value, true)
        return !get(fieldInfo).fieldState.error
      },
    }
  }

  // Provide form state and api for full control by children
  setContext("form", {
    formState,
    formApi,

    // Datasource is needed by attachment fields to be able to upload files
    // to the correct table ID
    dataSource,
  })

  // Provide form step context so that forms without any step components
  // register their fields to step 1
  setContext("form-step", writable(1))

  const handleUpdateFieldValue = ({ type, field, value }) => {
    if (type === "set") {
      formApi.setFieldValue(field, value)
    } else {
      formApi.resetField(field)
    }
  }

  const handleScrollToField = ({ field }) => {
    if (!field.fieldState) {
      field = get(getField(field))
    }
    const fieldId = field.fieldState.fieldId
    const fieldElement = document.getElementById(fieldId)
    if (fieldElement) {
      fieldElement.focus({ preventScroll: true })
    }
    const label = document.querySelector(`label[for="${fieldId}"]`)
    if (label) {
      label.style.scrollMargin = "100px"
      label.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }

  // Action context to pass to children
  const actions = [
    { type: ActionTypes.ValidateForm, callback: formApi.validate },
    { type: ActionTypes.ClearForm, callback: formApi.reset },
    { type: ActionTypes.ChangeFormStep, callback: formApi.changeStep },
    { type: ActionTypes.UpdateFieldValue, callback: handleUpdateFieldValue },
    { type: ActionTypes.ScrollTo, callback: handleScrollToField },
  ]
</script>

{#if provideContext}
  <Provider {actions} data={dataContext}>
    <div use:styleable={$component.styles} class={size}>
      <slot />
    </div>
  </Provider>
{:else}
  <div use:styleable={$component.styles} class={size}>
    <slot />
  </div>
{/if}
