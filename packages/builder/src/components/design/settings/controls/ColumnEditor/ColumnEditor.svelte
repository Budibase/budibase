<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { search } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"
  import ColumnDrawer from "./ColumnDrawer.svelte"
  import { cloneDeep } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "@/dataBinding"
  import { selectedScreen, tables } from "@/stores/builder"

  export let componentInstance
  export let value = []
  export let allowCellEditing = true
  export let allowReorder = true

  const dispatch = createEventDispatcher()

  let drawer
  let boundValue

  $: text = getText(value)
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchema($selectedScreen, datasource)
  $: options = allowCellEditing
    ? Object.keys(schema || {})
    : enrichedSchemaFields?.map(field => field.name)
  $: sanitisedValue = getValidColumns(value, options)
  $: updateBoundValue(sanitisedValue)
  $: enrichedSchemaFields = search.getFields(
    $tables.list,
    Object.values(schema || {}),
    {
      allowLinks: true,
    }
  )

  $: {
    value = (value || []).filter(
      column => (schema || {})[column.name || column] !== undefined
    )
  }

  const getText = value => {
    if (!value?.length) {
      return "All columns"
    }
    let text = `${value.length} column`
    if (value.length !== 1) {
      text += "s"
    }
    return text
  }

  const getSchema = (asset, datasource) => {
    const schema = getSchemaForDatasource(asset, datasource).schema

    // Don't show ID and rev in tables
    if (schema) {
      delete schema._id
      delete schema._rev
    }

    return schema
  }

  const updateBoundValue = value => {
    boundValue = cloneDeep(value)
  }

  const getValidColumns = (columns, options) => {
    if (!Array.isArray(columns) || !columns.length) {
      return []
    }
    // We need to account for legacy configs which would just be an array
    // of strings
    if (typeof columns[0] === "string") {
      columns = columns.map(col => ({
        name: col,
        displayName: col,
      }))
    }
    return columns.filter(column => {
      return options.includes(column.name)
    })
  }

  const open = () => {
    updateBoundValue(sanitisedValue)
    drawer.show()
  }

  const save = () => {
    dispatch("change", getValidColumns(boundValue, options))
    drawer.hide()
  }
</script>

<div class="column-editor">
  <ActionButton on:click={open}>{text}</ActionButton>
</div>
<Drawer bind:this={drawer} title="Columns">
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <ColumnDrawer
    slot="body"
    bind:columns={boundValue}
    {options}
    {schema}
    {allowCellEditing}
    {allowReorder}
  />
</Drawer>

<style>
  .column-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
