<script>
  import { getContext } from "svelte"
  import InnerForm from "./InnerForm.svelte"
  import { Helpers } from "@budibase/bbui"

  export let dataSource
  export let theme
  export let size
  export let disabled = false
  export let actionType = "Create"

  const context = getContext("context")
  const { API, fetchDatasourceSchema } = getContext("sdk")

  let loaded = false
  let schema
  let table

  $: fetchSchema(dataSource)
  $: fetchTable(dataSource)

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
    // Always inherit the closest data source
    const closestContext = context[`${context.closestComponentId}`] || {}
    return closestContext || {}
  }

  // Fetches the form schema from this form's dataSource
  const fetchSchema = async dataSource => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
    if (!loaded) {
      loaded = true
    }
  }

  const fetchTable = async dataSource => {
    if (dataSource?.tableId) {
      try {
        table = await API.fetchTableDefinition(dataSource.tableId)
      } catch (error) {
        table = null
      }
    }
  }

  $: initialValues = getInitialValues(actionType, dataSource, $context)
  $: resetKey = Helpers.hashString(
    JSON.stringify(initialValues) + JSON.stringify(schema)
  )
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
