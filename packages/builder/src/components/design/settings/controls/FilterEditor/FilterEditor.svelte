<script>
  import { notifications, ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import FilterDrawer from "./FilterDrawer.svelte"
  import { currentAsset } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  export let bindings = []

  let drawer

  $: tempValue = value
  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, dataSource)?.schema
  $: schemaFields = Object.values(schema || {})

  async function saveFilter() {
    dispatch("change", tempValue)
    notifications.success("Filters saved")
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Define filters</ActionButton>
<Drawer bind:this={drawer} title="Filtering">
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <FilterDrawer
    slot="body"
    filters={value}
    {bindings}
    {schemaFields}
    tableId={dataSource.tableId}
    on:change={e => (tempValue = e.detail)}
  />
</Drawer>
