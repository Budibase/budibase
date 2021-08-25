<script>
  import { getContext, onMount } from "svelte"
  import InnerForm from "./InnerForm.svelte"

  export let dataSource
  export let theme
  export let size
  export let disabled = false
  export let actionType = "Create"

  const context = getContext("context")
  const { API } = getContext("sdk")

  let loaded = false
  let schema
  let table

  // Returns the closes data context which isn't a built in context
  const getInitialValues = (type, dataSource, context) => {
    // Only inherit values for update forms
    if (type !== "Update") {
      return {}
    }
    // Only inherit values for forms targeting internal tables
    if (!dataSource?.tableId) {
      return {}
    }
    // Don't inherit values representing built in contexts
    if (["user", "url"].includes(context.closestComponentId)) {
      return {}
    }
    // Only inherit values if the table ID matches
    const closestContext = context[`${context.closestComponentId}`] || {}
    if (dataSource.tableId !== closestContext?.tableId) {
      return {}
    }
    return closestContext
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

  $: initialValues = getInitialValues(actionType, dataSource, $context)
  $: resetKey = JSON.stringify(initialValues)

  // Load the form schema on mount
  onMount(fetchSchema)
</script>

{#if loaded}
  {#key resetKey}
    <InnerForm
      {dataSource}
      {theme}
      {size}
      {disabled}
      {actionType}
      {schema}
      {table}
      {initialValues}
    >
      <slot />
    </InnerForm>
  {/key}
{/if}
