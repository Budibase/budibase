<script>
  import { setContext, getContext, onMount } from "svelte"
  import { writable, get } from "svelte/store"

  export let datasource
  export let theme
  export let size

  const { styleable, API } = getContext("sdk")
  const component = getContext("component")

  let loaded = false
  let schema = {}
  let fieldMap = {}

  // Keep form state up to date with form fields
  $: updateFormState(fieldMap)

  // Form state contains observable data about the form
  const formState = writable({ values: {}, errors: {}, valid: true })

  // Form API contains functions to control the form
  const formApi = {
    registerField: (field, validate) => {
      if (!field) {
        return
      }
      if (fieldMap[field] != null) {
        return fieldMap[field]
      }
      fieldMap[field] = {
        fieldState: makeFieldState(field),
        fieldApi: makeFieldApi(field, validate),
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
      value: null,
      error: null,
      valid: true,
    })
  }

  // Updates the form states from the field data
  const updateFormState = fieldMap => {
    let values = {}
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
    } else {
      const table = await API.fetchTableDefinition(datasource?.tableId)
      if (table) {
        if (datasource.type === "query") {
          schema = table.parameters
        } else {
          schema = table.schema || {}
        }
        console.log(table)
      }
    }
    loaded = true
  }

  // Load the form schema on mount
  onMount(fetchSchema)
</script>

<div
  lang="en"
  dir="ltr"
  use:styleable={$component.styles}
  class={`spectrum ${size || 'spectrum--medium'} ${theme || 'spectrum--light'}`}>
  {#if loaded}
    <slot />
  {/if}
</div>

<style>
  .spectrum :global(label) {
    font-size: var(
      --spectrum-alias-item-text-size-m,
      var(--spectrum-global-dimension-font-size-100)
    ) !important;
  }
</style>
