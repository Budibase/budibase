<script>
  import { getContext } from "svelte"
  import InnerForm from "./InnerForm.svelte"
  import { Helpers } from "@budibase/bbui"
  import { writable } from "svelte/store"

  export let dataSource
  export let theme
  export let size
  export let disabled = false
  export let actionType = "Create"
  export let initialFormStep = 1

  // Not exposed as a builder setting. Used internally to disable validation
  // for fields rendered in things like search blocks.
  export let disableValidation = false

  // Not exposed as a builder setting. Used internally to allow searching on
  // auto columns.
  export let editAutoColumns = false

  const context = getContext("context")
  const { API, fetchDatasourceSchema } = getContext("sdk")

  const getInitialFormStep = () => {
    const parsedFormStep = parseInt(initialFormStep)
    if (isNaN(parsedFormStep)) {
      return 1
    }
    return parsedFormStep
  }

  let loaded = false
  let schema
  let table
  let currentStep = writable(getInitialFormStep())

  $: fetchSchema(dataSource)
  $: schemaKey = generateSchemaKey(schema)
  $: initialValues = getInitialValues(actionType, dataSource, $context)
  $: resetKey = Helpers.hashString(
    schemaKey + JSON.stringify(initialValues) + disabled
  )

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
    // Always inherit the closest datasource
    const closestContext = context[`${context.closestComponentId}`] || {}
    return closestContext || {}
  }

  // Fetches the form schema from this form's dataSource
  const fetchSchema = async dataSource => {
    if (dataSource?.tableId && dataSource?.type !== "query") {
      try {
        table = await API.fetchTableDefinition(dataSource.tableId)
      } catch (error) {
        table = null
      }
    }
    const res = await fetchDatasourceSchema(dataSource)
    schema = res || {}
    if (!loaded) {
      loaded = true
    }
  }

  // Generates a predictable string that uniquely identifies a schema. We can't
  // simply stringify the whole schema as there are array fields which have
  // random order.
  const generateSchemaKey = schema => {
    if (!schema) {
      return null
    }
    const fields = Object.keys(schema)
    fields.sort()
    return fields.map(field => `${field}:${schema[field].type}`).join("-")
  }
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
      {disableValidation}
      {editAutoColumns}
      {currentStep}
    >
      <slot />
    </InnerForm>
  {/key}
{/if}
