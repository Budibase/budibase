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
  export let schema = null

  let drawer

  $: tempValue = value
  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: dsSchema = getSchemaForDatasource($currentAsset, datasource)?.schema
  $: schemaFields = Object.values(schema || dsSchema || {})
  $: text = getText(value?.filter(filter => filter.field))

  async function saveFilter() {
    dispatch("change", tempValue)
    notifications.success("Filters saved")
    drawer.hide()
  }

  const getText = filters => {
    if (!filters?.length) {
      return "No filters set"
    } else {
      return `${filters.length} filter${filters.length === 1 ? "" : "s"} set`
    }
  }
</script>

<div class="filter-editor">
  <ActionButton on:click={drawer.show}>{text}</ActionButton>
</div>
<Drawer bind:this={drawer} title="Filtering">
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <FilterDrawer
    slot="body"
    filters={value}
    {bindings}
    {schemaFields}
    {datasource}
    on:change={e => (tempValue = e.detail)}
  />
</Drawer>

<style>
  .filter-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
