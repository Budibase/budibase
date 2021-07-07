<script>
  import { getContext } from "svelte"
  import { Table } from "@budibase/bbui"
  import SlotRenderer from "./SlotRenderer.svelte"

  export let dataProvider
  export let columns
  export let showAutoColumns
  export let rowCount
  export let quiet

  const component = getContext("component")
  const { styleable } = getContext("sdk")
  const customColumnKey = `custom-${Math.random()}`
  const customRenderers = [
    {
      column: customColumnKey,
      component: SlotRenderer,
    },
  ]

  // Table state
  $: hasChildren = $component.children
  $: loading = dataProvider?.loading ?? false
  $: data = dataProvider?.rows || []
  $: fullSchema = dataProvider?.schema ?? {}
  $: fields = getFields(fullSchema, columns, showAutoColumns)
  $: schema = getFilteredSchema(fullSchema, fields, hasChildren)

  const getFields = (schema, customColumns, showAutoColumns) => {
    // Check for an invalid column selection
    let invalid = false
    customColumns?.forEach(column => {
      if (schema[column] == null) {
        invalid = true
      }
    })

    // Use column selection if it exists
    if (!invalid && customColumns?.length) {
      return customColumns
    }

    // Otherwise generate columns
    let columns = []
    let autoColumns = []
    Object.entries(schema).forEach(([field, fieldSchema]) => {
      if (!fieldSchema?.autocolumn) {
        columns.push(field)
      } else if (showAutoColumns) {
        autoColumns.push(field)
      }
    })
    return columns.concat(autoColumns)
  }

  const getFilteredSchema = (schema, fields, hasChildren) => {
    let newSchema = {}
    if (hasChildren) {
      newSchema[customColumnKey] = {
        displayName: null,
        order: 0,
        sortable: false,
        divider: true,
      }
    }
    fields.forEach(field => {
      newSchema[field] = schema[field]
    })
    return newSchema
  }
</script>

<div use:styleable={$component.styles}>
  <Table
    {data}
    {schema}
    {loading}
    {rowCount}
    {quiet}
    {customRenderers}
    allowSelectRows={false}
    allowEditRows={false}
    allowEditColumns={false}
    showAutoColumns={true}
  >
    <slot />
  </Table>
</div>

<style>
  div {
    background-color: var(--spectrum-alias-background-color-secondary);
  }
</style>
