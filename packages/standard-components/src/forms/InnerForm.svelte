<script>
  import { setContext, getContext, onMount } from "svelte"
  import { writable, get } from "svelte/store"
  import { createValidatorFromConstraints } from "./validation"
  import { generateID } from "../helpers"

  export let dataSource
  export let disabled = false
  export let initialValues

  const component = getContext("component")
  const { styleable, API, Provider, ActionTypes } = getContext("sdk")

  let loaded = false
  let schema
  let table
  let fieldMap = {}

  // Form state contains observable data about the form
  const formState = writable({ values: initialValues, errors: {}, valid: true })

  // Form API contains functions to control the form
  const formApi = {
    registerField: (field, defaultValue = null, fieldDisabled = false) => {
      if (!field) {
        return
      }

      // Auto columns are always disabled
      const isAutoColumn = !!schema?.[field]?.autocolumn

      // Create validation function based on field schema
      const constraints = schema?.[field]?.constraints
      const validate = createValidatorFromConstraints(constraints, field, table)

      // Construct field object
      fieldMap[field] = {
        fieldState: makeFieldState(
          field,
          defaultValue,
          disabled || fieldDisabled || isAutoColumn
        ),
        fieldApi: makeFieldApi(field, defaultValue, validate),
        fieldSchema: schema?.[field] ?? {},
      }

      // Set initial value
      const initialValue = get(fieldMap[field].fieldState).value
      formState.update(state => ({
        ...state,
        values: {
          ...state.values,
          [field]: initialValue,
        },
      }))

      return fieldMap[field]
    },
    validate: () => {
      const fields = Object.keys(fieldMap)
      fields.forEach(field => {
        const { fieldApi } = fieldMap[field]
        fieldApi.validate()
      })
      return get(formState).valid
    },
  }

  // Provide both form API and state to children
  setContext("form", { formApi, formState, dataSource })

  // Action context to pass to children
  const actions = [
    { type: ActionTypes.ValidateForm, callback: formApi.validate },
  ]

  // Creates an API for a specific field
  const makeFieldApi = (field, defaultValue, validate) => {
    const setValue = (value, skipCheck = false) => {
      const { fieldState } = fieldMap[field]

      // Skip if the value is the same
      if (!skipCheck && get(fieldState).value === value) {
        return
      }

      const newValue = value == null ? defaultValue : value
      const newError = validate ? validate(newValue) : null

      // Update field state
      fieldState.update(state => {
        state.value = newValue
        state.error = newError
        return state
      })

      // Update form state
      formState.update(state => {
        state.values = { ...state.values, [field]: newValue }
        if (newError) {
          state.errors = { ...state.errors, [field]: newError }
        } else {
          delete state.errors[field]
        }
        state.valid = Object.keys(state.errors).length === 0
        return state
      })

      return !newError
    }
    return {
      setValue,
      validate: () => {
        const { fieldState } = fieldMap[field]
        setValue(get(fieldState).value, true)
      },
    }
  }

  // Creates observable state data about a specific field
  const makeFieldState = (field, defaultValue, fieldDisabled) => {
    return writable({
      field,
      fieldId: `id-${generateID()}`,
      value: initialValues[field] ?? defaultValue,
      error: null,
      disabled: fieldDisabled,
    })
  }

  // Fetches the form schema from this form's dataSource, if one exists
  const fetchSchema = async () => {
    if (!dataSource?.tableId) {
      schema = {}
      table = null
    } else {
      table = await API.fetchTableDefinition(dataSource?.tableId)
      if (table) {
        if (dataSource?.type === "query") {
          schema = {}
          const params = table.parameters || []
          params.forEach(param => {
            schema[param.name] = { ...param, type: "string" }
          })
        } else {
          schema = table.schema || {}
        }
      }
    }
    loaded = true
  }

  // Load the form schema on mount
  onMount(fetchSchema)
</script>

<Provider
  {actions}
  data={{ ...$formState.values, tableId: dataSource?.tableId }}
>
  <div use:styleable={$component.styles}>
    {#if loaded}
      <slot />
    {/if}
  </div>
</Provider>
