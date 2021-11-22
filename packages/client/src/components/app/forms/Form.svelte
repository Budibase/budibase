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
    // Always inherit the closest data source
    const closestContext = context[`${context.closestComponentId}`] || {}
    return closestContext || {}
  }

  // Fetches the form schema from this form's dataSource
  const fetchSchema = async () => {
    if (!dataSource) {
      schema = {}
    }

    // If the datasource is a query, then we instead use a schema of the query
    // parameters rather than the output schema
    else if (
      dataSource.type === "query" &&
      dataSource._id &&
      actionType === "Create"
    ) {
      const query = await API.fetchQueryDefinition(dataSource._id)
      let paramSchema = {}
      const params = query.parameters || []
      params.forEach(param => {
        paramSchema[param.name] = { ...param, type: "string" }
      })
      schema = paramSchema
    }

    // For all other cases, just grab the normal schema
    else {
      const dataSourceSchema = await API.fetchDatasourceSchema(dataSource)
      schema = dataSourceSchema || {}
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
