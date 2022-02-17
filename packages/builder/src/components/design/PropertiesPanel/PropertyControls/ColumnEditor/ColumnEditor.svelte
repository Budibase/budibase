<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import ColumnDrawer from "./ColumnDrawer.svelte"
  import { cloneDeep } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"

  export let componentInstance
  export let value = []

  const dispatch = createEventDispatcher()

  let drawer
  let boundValue

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, datasource).schema
  $: options = Object.keys(schema || {})
  $: sanitisedValue = getValidColumns(value, options)
  $: updateBoundValue(sanitisedValue)

  const updateBoundValue = value => {
    boundValue = cloneDeep(value)
  }

  const getValidColumns = (columns, options) => {
    // If no columns then default to all columns
    if (!Array.isArray(columns) || !columns.length) {
      return options.map(col => ({
        name: col,
        displayName: col,
      }))
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

  const save = () => {
    dispatch("change", getValidColumns(boundValue, options))
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Configure columns</ActionButton>
<Drawer bind:this={drawer} title="Table Columns">
  <svelte:fragment slot="description">
    Configure the columns in your table.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <ColumnDrawer slot="body" bind:columns={boundValue} {options} />
</Drawer>
