<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import { setContext, getContext, onMount } from "svelte"
  import { writable, get } from "svelte/store"
  import { createValidatorFromConstraints } from "./validation"
  import { generateID } from "../helpers"

  export let datasource
  export let theme
  export let size

  const component = getContext("component")
  const context = getContext("context")
  const { styleable, API, Provider, ActionTypes } = getContext("sdk")

  let loaded = false
  let schema
  let table
  let fieldMap = {}

  // Checks if the closest data context matches the model for this forms
  // datasource, and use it as the initial form values if so
  const getInitialValues = context => {
    return context && context.tableId === datasource?.tableId ? context : {}
  }

  // Use the closest data context as the initial form values if it matches
  const initialValues = getInitialValues(
    $context[`${$context.closestComponentId}`]
  )

  // Form state contains observable data about the form
  const formState = writable({ values: initialValues, errors: {}, valid: true })

  // Form API contains functions to control the form
  const formApi = {
    registerField: (field, defaultValue = null) => {
      if (!field) {
        return
      }
      if (fieldMap[field] != null) {
        return fieldMap[field]
      }

      // Create validation function based on field schema
      const constraints = schema?.[field]?.constraints
      const validate = createValidatorFromConstraints(constraints, field, table)

      fieldMap[field] = {
        fieldState: makeFieldState(field, defaultValue),
        fieldApi: makeFieldApi(field, defaultValue, validate),
        fieldSchema: schema?.[field] ?? {},
      }
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
  setContext("form", { formApi, formState })

  // Action context to pass to children
  $: actions = [{ type: ActionTypes.ValidateForm, callback: formApi.validate }]

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
      const newValid = !newError

      // Update field state
      fieldState.update(state => {
        state.value = newValue
        state.error = newError
        state.valid = newValid
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

      return newValid
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
  const makeFieldState = (field, defaultValue) => {
    return writable({
      field,
      fieldId: `id-${generateID()}`,
      value: initialValues[field] ?? defaultValue,
      error: null,
      valid: true,
    })
  }

  // Fetches the form schema from this form's datasource, if one exists
  const fetchSchema = async () => {
    if (!datasource?.tableId) {
      schema = {}
      table = null
    } else {
      table = await API.fetchTableDefinition(datasource?.tableId)
      if (table) {
        if (datasource?.type === "query") {
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
  data={{ ...$formState.values, tableId: datasource?.tableId }}>
  <div
    lang="en"
    dir="ltr"
    use:styleable={$component.styles}
    class={`spectrum ${size || 'spectrum--medium'} ${theme || 'spectrum--light'}`}>
    {#if loaded}
      <slot />
    {/if}
  </div>
</Provider>

<style>
  div {
    padding: 20px;
    position: relative;
  }
</style>
