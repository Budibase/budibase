<script>
  import { getContext } from "svelte"
  import InnerForm from "./InnerForm.svelte"
  import { Helpers } from "@budibase/bbui"
  import { writable } from "svelte/store"

  export let dataSource
  export let size
  export let disabled = false
  export let readonly = false
  export let actionType = "Create"
  export let initialFormStep = 1

  // Not exposed as a builder setting. Used internally to disable validation
  // for fields rendered in things like search blocks.
  export let disableSchemaValidation = false

  // Not exposed as a builder setting. Used internally to allow searching on
  // auto columns.
  export let editAutoColumns = false

  const context = getContext("context")
  const component = getContext("component")
  const { fetchDatasourceSchema, fetchDatasourceDefinition } = getContext("sdk")

  const getInitialFormStep = () => {
    const parsedFormStep = parseInt(initialFormStep)
    if (isNaN(parsedFormStep)) {
      return 1
    }
    return parsedFormStep
  }

  let definition
  let schema
  let loaded = false
  let currentStep = getContext("current-step") || writable(getInitialFormStep())

  $: fetchSchema(dataSource)
  $: schemaKey = generateSchemaKey(schema)
  $: initialValues = getInitialValues(
    actionType,
    dataSource,
    $component.path,
    $context
  )
  $: resetKey = Helpers.hashString(
    schemaKey + JSON.stringify(initialValues) + disabled + readonly
  )

  // Returns the closes data context which isn't a built in context
  const getInitialValues = (type, dataSource, path, context) => {
    // Only inherit values for update forms
    if (type !== "Update") {
      return {}
    }
    // Only inherit values for forms targeting internal tables
    const dsType = dataSource?.type
    if (dsType !== "table" && dsType !== "viewV2") {
      return {}
    }
    // Look up the component tree and find something that is provided by an
    // ancestor that matches our datasource. This is for backwards compatibility
    // as previously we could use the "closest" context.
    for (let id of path.toReversed().slice(1)) {
      // Check for matching view datasource
      if (
        dataSource.type === "viewV2" &&
        context[id]?._viewId === dataSource.id
      ) {
        return context[id]
      }
      // Check for matching table datasource
      if (
        dataSource.type === "table" &&
        context[id]?.tableId === dataSource.tableId
      ) {
        return context[id]
      }
    }
    return {}
  }

  // Fetches the form schema from this form's dataSource
  const fetchSchema = async dataSource => {
    try {
      definition = await fetchDatasourceDefinition(dataSource)
    } catch (error) {
      definition = null
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
      {size}
      {disabled}
      {readonly}
      {schema}
      {definition}
      {initialValues}
      {disableSchemaValidation}
      {editAutoColumns}
      {currentStep}
    >
      <slot />
    </InnerForm>
  {/key}
{/if}
