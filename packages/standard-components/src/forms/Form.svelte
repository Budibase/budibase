<script>
  import "@spectrum-css/fieldlabel/dist/index-vars.css"
  import { setContext, getContext, onMount } from "svelte"
  import { writable, get } from "svelte/store"
  import { createValidatorFromConstraints } from "./validation"

  export let datasource
  export let theme
  export let size

  const { styleable, API, setBindableValue, DataProvider } = getContext("sdk")
  const component = getContext("component")
  const dataContext = getContext("data")

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
    $dataContext[$dataContext.closestComponentId]
  )

  // Form state contains observable data about the form
  const formState = writable({ values: initialValues, errors: {}, valid: true })
  $: updateFormState(fieldMap)

  // Form API contains functions to control the form
  const formApi = {
    registerField: field => {
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
        fieldState: makeFieldState(field),
        fieldApi: makeFieldApi(field, validate),
        fieldSchema: schema?.[field] ?? {},
      }
      fieldMap = fieldMap
      return fieldMap[field]
    },
  }

  // Provide both form API and state to children
  setContext("form", { formApi, formState })

  // Creates an API for a specific field
  const makeFieldApi = (field, validate) => {
    return {
      setValue: value => {
        const { fieldState } = fieldMap[field]
        fieldState.update(state => {
          state.value = value
          state.error = validate ? validate(value) : null
          state.valid = !state.error
          return state
        })
        fieldMap = fieldMap
      },
    }
  }

  // Creates observable state data about a specific field
  const makeFieldState = field => {
    return writable({
      field,
      fieldId: `${Math.random()
        .toString(32)
        .substr(2)}/${field}`,
      value: initialValues[field] ?? null,
      error: null,
      valid: true,
    })
  }

  // Updates the form states from the field data
  const updateFormState = fieldMap => {
    let values = { ...initialValues }
    let errors = {}
    Object.entries(fieldMap).forEach(([field, formField]) => {
      const fieldState = get(formField.fieldState)
      values[field] = fieldState.value
      if (fieldState.error) {
        errors[field] = fieldState.error
      }
    })
    const valid = Object.keys(errors).length === 0
    formState.set({ values, errors, valid })
  }

  // Fetches the form schema from this form's datasource, if one exists
  const fetchSchema = async () => {
    if (!datasource?.tableId) {
      schema = {}
      table = null
    } else {
      table = await API.fetchTableDefinition(datasource?.tableId)
      if (table) {
        if (datasource.type === "query") {
          console.log("No implementation for queries yet")
          schema = {}
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

<DataProvider row={{ ...$formState.values, tableId: datasource?.tableId }}>
  <div
    lang="en"
    dir="ltr"
    use:styleable={$component.styles}
    class={`spectrum ${size || 'spectrum--medium'} ${theme || 'spectrum--light'}`}>
    {#if loaded}
      <slot />
    {/if}
  </div>
</DataProvider>

<style>
  div {
    padding: 20px;
  }
</style>
