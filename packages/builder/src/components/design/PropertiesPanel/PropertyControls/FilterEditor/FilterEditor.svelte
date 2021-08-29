<script>
  import { notifications, ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import FilterDrawer from "./FilterDrawer.svelte"
  import { currentAsset } from "builderStore"
  import { _ as t } from "svelte-i18n"

  const dispatch = createEventDispatcher()

  export let value = []
  export let componentInstance
  export let bindings = []

  let drawer
  let tempValue = value || []

  $: dataSource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, dataSource)?.schema
  $: schemaFields = Object.values(schema || {})
  $: internalTable = dataSource?.type === "table"

  const saveFilter = async () => {
    dispatch("change", tempValue)
    notifications.success($t('filters-saved'))
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Define filters</ActionButton>
<Drawer bind:this={drawer} title={ $t('filtering') }>
  <Button cta slot="buttons" on:click={saveFilter}>{ $t('save') }</Button>
  <FilterDrawer
    slot="body"
    bind:filters={tempValue}
    {bindings}
    {schemaFields}
  />
</Drawer>
