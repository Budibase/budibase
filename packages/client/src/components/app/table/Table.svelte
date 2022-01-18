<script>
  import { getContext } from "svelte"
  import { Table } from "@budibase/bbui"
  import SlotRenderer from "./SlotRenderer.svelte"
  import { UnsortableTypes } from "../../../constants"

  export let dataProvider
  export let columns
  export let showAutoColumns
  export let rowCount
  export let quiet
  export let size
  export let linkRows
  export let linkURL
  export let linkColumn
  export let linkPeek

  const component = getContext("component")
  const { styleable, getAction, ActionTypes, routeStore } = getContext("sdk")
  const customColumnKey = `custom-${Math.random()}`
  const customRenderers = [
    {
      column: customColumnKey,
      component: SlotRenderer,
    },
  ]

  $: hasChildren = $component.children
  $: loading = dataProvider?.loading ?? false
  $: data = dataProvider?.rows || []
  $: fullSchema = dataProvider?.schema ?? {}
  $: fields = getFields(fullSchema, columns, showAutoColumns)
  $: schema = getFilteredSchema(fullSchema, fields, hasChildren)
  $: setSorting = getAction(
    dataProvider?.id,
    ActionTypes.SetDataProviderSorting
  )

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
      if (schema[field] && UnsortableTypes.indexOf(schema[field].type) !== -1) {
        newSchema[field].sortable = false
      }
    })
    return newSchema
  }

  const onSort = e => {
    setSorting({
      column: e.detail.column,
      order: e.detail.order,
    })
  }

  const onClick = e => {
    if (!linkRows || !linkURL) {
      return
    }
    const col = linkColumn || "_id"
    const id = e.detail?.[col]
    if (!id) {
      return
    }
    const split = linkURL.split("/:")
    routeStore.actions.navigate(`${split[0]}/${id}`, linkPeek)
  }
</script>

<div use:styleable={$component.styles} class={size}>
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
    disableSorting
    on:sort={onSort}
    on:click={onClick}
  >
    <slot />
  </Table>
</div>

<style>
  div {
    background-color: var(--spectrum-alias-background-color-secondary);
  }
</style>
