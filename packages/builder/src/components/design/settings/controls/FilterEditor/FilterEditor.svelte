<script>
  import {
    notifications,
    ActionButton,
    Button,
    Drawer,
    DrawerContent,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "@/dataBinding"
  import FilterBuilder from "./FilterBuilder.svelte"
  import { tables, selectedScreen } from "@/stores/builder"
  import { search, Utils } from "@budibase/frontend-core"
  import { utils } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  export let bindings = []
  export let schema = null

  let drawer

  $: localFilters = value
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: dsSchema = getSchemaForDatasource($selectedScreen, datasource)?.schema
  $: schemaFields = search.getFields(
    $tables.list,
    Object.values(schema || dsSchema || {}),
    { allowLinks: true }
  )
  $: text = getText(value)

  async function saveFilter() {
    const update = Utils.parseFilter(localFilters)
    dispatch("change", update)
    notifications.success("Filters saved")
    drawer.hide()
  }

  const getText = filters => {
    if (Array.isArray(filters)) {
      filters = utils.processSearchFilters(filters)
    }
    const groups = filters?.groups || []
    const allFilters = groups.reduce((acc, group) => {
      return (acc += group.filters.filter(filter => filter.field).length)
    }, 0)
    if (allFilters === 0) {
      return "No filters set"
    } else {
      return `${allFilters} filter${allFilters === 1 ? "" : "s"} set`
    }
  }
</script>

<div class="filter-editor">
  <ActionButton on:click={drawer.show}>{text}</ActionButton>
</div>
<Drawer
  bind:this={drawer}
  title="Filtering"
  on:drawerHide
  on:drawerShow
  on:drawerShow={() => {
    // Reset to the currently available value.
    localFilters = value
  }}
>
  <Button cta slot="buttons" on:click={saveFilter}>Save</Button>
  <DrawerContent slot="body">
    <FilterBuilder
      filters={localFilters}
      {bindings}
      {schemaFields}
      {datasource}
      on:change={e => {
        localFilters = e.detail
      }}
    />
  </DrawerContent>
</Drawer>

<style>
  .filter-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
