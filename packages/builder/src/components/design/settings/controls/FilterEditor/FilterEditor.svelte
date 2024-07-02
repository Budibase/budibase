<script>
  import {
    notifications,
    ActionButton,
    Button,
    Drawer,
    DrawerContent,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import FilterBuilder from "./FilterBuilder.svelte"
  import { tables, selectedScreen } from "stores/builder"
  import { search } from "@budibase/frontend-core"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  export let bindings = []
  export let schema = null

  let drawer

  $: tempValue = value
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: dsSchema = getSchemaForDatasource($selectedScreen, datasource)?.schema
  $: schemaFields = search.getFields(
    $tables.list,
    Object.values(schema || dsSchema || {}),
    { allowLinks: true }
  )
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
<Drawer bind:this={drawer} title="Filtering" on:drawerHide on:drawerShow>
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <DrawerContent slot="body">
    <FilterBuilder
      filters={value}
      {bindings}
      {schemaFields}
      {datasource}
      on:change={e => (tempValue = e.detail)}
    />
  </DrawerContent>
</Drawer>

<style>
  .filter-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
